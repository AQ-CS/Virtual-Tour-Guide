// File: src/screens/ProfileScreen.js - Updated with image upload functionality

import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { AppContext } from '../AppContext';
import AppHeader from '../components/AppHeader';
import ExhibitCard from '../components/ExhibitCard';
import ProfileAvatar from '../components/ProfileAvatar';

const ProfileScreen = () => {
  const { currentUser, setCurrentUser, exhibits, handleLogout, isLoading } = useContext(AppContext);
  const [editMode, setEditMode] = useState(false);
  const [showFavoriteExhibits, setShowFavoriteExhibits] = useState(false);
  
  // Edit profile state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [nationality, setNationality] = useState(currentUser?.nationality || '');
  const [profileImageURI, setProfileImageURI] = useState(currentUser?.profileImageURI || null);
  
  // Update local state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setNationality(currentUser.nationality || '');
      setProfileImageURI(currentUser.profileImageURI || null);
    }
  }, [currentUser]);
  
  // Show loading indicator if data isn't ready yet
  if (isLoading || !currentUser) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LinearGradient
          colors={['#8C52FF', '#A67FFB', '#F0EBFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundGradient}
        />
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }
  
  // Get user's favorite exhibits
  const favoriteExhibits = exhibits.filter(exhibit => 
    currentUser.preferences.favoriteExhibits.includes(exhibit.id)
  );
  
  // Request permission to access the photo library
  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photo library to upload a profile picture.');
        return false;
      }
      return true;
    }
    return true;
  };
  
  // Handle selecting an image from the gallery
  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    
    if (hasPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImageURI(result.assets[0].uri);
      }
    }
  };
  
  const handleSaveProfile = () => {
    const updatedUser = {
      ...currentUser,
      name,
      email,
      nationality,
      profileImageURI // Add the profile image URI to the user object
    };
    
    // If using profile image URI, don't need the old initials-based image
    if (profileImageURI) {
      // Keep the profileImage object but mark it as not to be used
      updatedUser.profileImage = {
        ...updatedUser.profileImage,
        useInitials: false
      };
    } else if (!updatedUser.profileImage || updatedUser.profileImage.useInitials === false) {
      // If no image URI and no valid profile image, generate one based on initials
      const names = name.split(' ');
      let initials = '';
      
      if (names.length === 1) {
        initials = names[0].substring(0, 2).toUpperCase();
      } else {
        initials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      
      // Generate a consistent background color based on the name
      const colors = [
        '#8C52FF', '#5271FF', '#52B4FF', '#52FFD0', '#52FF7D',
        '#D0FF52', '#FFD052', '#FF7D52', '#FF5271', '#FF52B4'
      ];
      
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const index = Math.abs(hash) % colors.length;
      const bgColor = colors[index];
      
      updatedUser.profileImage = {
        initials,
        backgroundColor: bgColor,
        useInitials: true
      };
    }
    
    setCurrentUser(updatedUser);
    setEditMode(false);
  };

  return (
    <View style={styles.container}>
      {/* Purple-white gradient background */}
      <LinearGradient
        colors={['#8C52FF', '#A67FFB', '#F0EBFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      <AppHeader 
        title="Profile" 
        rightIcon={editMode ? null : "create-outline"}
        onRightPress={() => setEditMode(true)}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageWrapper}>
            {/* We'll let the ProfileAvatar component handle the image display logic */}
            <ProfileAvatar 
              user={{...currentUser, profileImageURI}} 
              size={100} 
              textSize={36} 
              style={styles.profileAvatar}
            />
            
            {editMode && (
              <TouchableOpacity 
                style={styles.editImageButton}
                onPress={pickImage}
              >
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          
          {!editMode ? (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userDetails}>{currentUser.email}</Text>
              {currentUser.nationality && (
                <Text style={styles.userDetails}>{currentUser.nationality}</Text>
              )}
            </View>
          ) : (
            <View style={styles.editForm}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Nationality"
                value={nationality}
                onChangeText={setNationality}
              />
              
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  style={[styles.editButton, styles.cancelButton]} 
                  onPress={() => {
                    setName(currentUser.name);
                    setEmail(currentUser.email);
                    setNationality(currentUser.nationality || '');
                    setProfileImageURI(currentUser.profileImageURI || null);
                    setEditMode(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.editButton, styles.saveButton]} 
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        {!editMode && (
          <>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Preferences</Text>
              </View>
              
              <View style={styles.preferenceCategories}>
                <Text style={styles.preferenceLabel}>Favorite Categories:</Text>
                <View style={styles.categoriesContainer}>
                  {currentUser.preferences.favoriteCategories.length > 0 ? (
                    currentUser.preferences.favoriteCategories.map((category, index) => (
                      <View key={index} style={styles.categoryChip}>
                        <Text style={styles.categoryChipText}>{category}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyPreferenceText}>No favorite categories yet</Text>
                  )}
                </View>
              </View>
            </View>
            
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Favorite Exhibits</Text>
                <TouchableOpacity onPress={() => setShowFavoriteExhibits(true)}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              {favoriteExhibits.length > 0 ? (
                favoriteExhibits.slice(0, 2).map(exhibit => (
                  <ExhibitCard
                    key={exhibit.id}
                    exhibit={exhibit}
                    compact={true}
                  />
                ))
              ) : (
                <Text style={styles.emptyPreferenceText}>No favorite exhibits yet</Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => handleLogout()}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      
      {/* Favorite Exhibits Modal */}
      <Modal
        visible={showFavoriteExhibits}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFavoriteExhibits(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Favorite Exhibits</Text>
              <TouchableOpacity onPress={() => setShowFavoriteExhibits(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {favoriteExhibits.length > 0 ? (
              <FlatList
                data={favoriteExhibits}
                renderItem={({ item }) => (
                  <ExhibitCard
                    exhibit={item}
                    compact={true}
                  />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.modalList}
              />
            ) : (
              <View style={styles.emptyFavorites}>
                <Ionicons name="heart-outline" size={48} color="#8C52FF" />
                <Text style={styles.emptyFavoritesText}>
                  You haven't added any favorite exhibits yet
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileImageWrapper: {
    position: 'relative',
    padding: 3,
    borderRadius: 53,
    backgroundColor: 'rgba(140, 82, 255, 0.1)',
    marginBottom: 16,
  },
  profileAvatar: {
    // The ProfileAvatar component handles size, this is for additional styling if needed
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#8C52FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  editForm: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f9f7ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(140, 82, 255, 0.2)',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fbeaec',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#8C52FF',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(140, 82, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    color: '#8C52FF',
    fontWeight: '500',
  },
  preferenceCategories: {
    marginBottom: 8,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    backgroundColor: 'rgba(140, 82, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipText: {
    color: '#8C52FF',
    fontWeight: '500',
  },
  emptyPreferenceText: {
    color: '#666',
    fontStyle: 'italic',
    padding: 8,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalList: {
    paddingBottom: 20,
  },
  emptyFavorites: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyFavoritesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ProfileScreen;