// app/auth/profile.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants/theme';

import Typography from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import ProfileCard from '../../components/auth/ProfileCard';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

// Mock user data for demonstration
const mockUser = {
  id: 'user123',
  name: 'Mohammed Al Farsi',
  email: 'mohammed.alfarsi@example.com',
  photoURL: 'https://via.placeholder.com/150',
  completedTours: 5,
  favoriteExhibits: ['exhibit2', 'exhibit5', 'exhibit6'],
  reviewsLeft: 8,
  preferences: {
    interests: ['Islamic Art', 'Modern Architecture', 'Maritime History'],
    notifications: true,
    language: 'English',
  }
};

// Mock favorite exhibits data
const mockFavoriteExhibits = [
  {
    id: 'exhibit2',
    name: 'Islamic Calligraphy',
    category: 'Art',
    imageUrl: 'https://via.placeholder.com/300x200?text=Islamic+Calligraphy',
  },
  {
    id: 'exhibit5',
    name: 'Traditional Clothing',
    category: 'Culture',
    imageUrl: 'https://via.placeholder.com/300x200?text=Traditional+Clothing',
  },
  {
    id: 'exhibit6',
    name: 'Desert Wildlife',
    category: 'Natural History',
    imageUrl: 'https://via.placeholder.com/300x200?text=Desert+Wildlife',
  },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [favoriteExhibits, setFavoriteExhibits] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    // Simulate API call to fetch user data
    setTimeout(() => {
      setUser(mockUser);
      setFavoriteExhibits(mockFavoriteExhibits);
      setEditedName(mockUser.name);
      setEditedEmail(mockUser.email);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleEditProfile = () => {
    setEditMode(true);
  };
  
  const handleSaveProfile = () => {
    // In a real app, you would call an API to update the user profile
    setUser({
      ...user,
      name: editedName,
      email: editedEmail,
    });
    setEditMode(false);
  };
  
  const handleCancelEdit = () => {
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditMode(false);
  };
  
  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    router.replace('/');
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Typography>Loading profile...</Typography>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {editMode ? (
        <Card style={styles.editCard}>
          <View style={styles.editHeader}>
            <Typography variant="h3">Edit Profile</Typography>
          </View>
          
          <View style={styles.avatarEditContainer}>
            <Image 
              source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }} 
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.changeAvatarButton}>
              <Typography variant="caption" color="primary">Change Photo</Typography>
            </TouchableOpacity>
          </View>
          
          <Input
            label="Full Name"
            value={editedName}
            onChangeText={setEditedName}
            autoCapitalize="words"
          />
          
          <Input
            label="Email"
            value={editedEmail}
            onChangeText={setEditedEmail}
            keyboardType="email-address"
          />
          
          <View style={styles.editActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={handleCancelEdit}
              style={styles.cancelButton}
            />
            
            <Button
              title="Save Changes"
              onPress={handleSaveProfile}
              style={styles.saveButton}
            />
          </View>
        </Card>
      ) : (
        <ProfileCard user={user} onEditProfile={handleEditProfile} />
      )}
      
      <Card style={styles.preferencesCard}>
        <Typography variant="h3" style={styles.sectionTitle}>
          Interests & Preferences
        </Typography>
        
        <View style={styles.interestsContainer}>
          <Typography variant="body" style={styles.interestsLabel}>
            Your Interests:
          </Typography>
          
          <View style={styles.interestTags}>
            {user?.preferences?.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Typography variant="caption">{interest}</Typography>
              </View>
            ))}
            
            <TouchableOpacity style={styles.editInterestsButton}>
              <Typography variant="caption" color="primary">Edit</Typography>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.preferenceItem}>
          <Typography variant="body">App Language</Typography>
          <View style={styles.preferenceValue}>
            <Typography>{user?.preferences?.language || 'English'}</Typography>
            <TouchableOpacity style={styles.editButton}>
              <Typography variant="caption" color="primary">Change</Typography>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.preferenceItem}>
          <Typography variant="body">Notifications</Typography>
          <View style={styles.preferenceValue}>
            <Typography>{user?.preferences?.notifications ? 'Enabled' : 'Disabled'}</Typography>
            <TouchableOpacity style={styles.editButton}>
              <Typography variant="caption" color="primary">Change</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
      
      <Card style={styles.favoritesCard}>
        <Typography variant="h3" style={styles.sectionTitle}>
          Favorite Exhibits
        </Typography>
        
        <View style={styles.favoritesList}>
          {favoriteExhibits.map((exhibit) => (
            <TouchableOpacity 
              key={exhibit.id}
              style={styles.favoriteExhibit}
              onPress={() => router.push(`/exhibits/${exhibit.id}`)}
            >
              <Image 
                source={{ uri: exhibit.imageUrl }} 
                style={styles.exhibitImage}
              />
              <View style={styles.exhibitInfo}>
                <Typography variant="body" numberOfLines={1}>{exhibit.name}</Typography>
                <Typography variant="caption" color="light">{exhibit.category}</Typography>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
      
      <View style={styles.logoutContainer}>
        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editCard: {
    marginBottom: SIZES.lg,
  },
  editHeader: {
    marginBottom: SIZES.md,
  },
  avatarEditContainer: {
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SIZES.xs,
  },
  changeAvatarButton: {
    padding: SIZES.xs,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.md,
  },
  cancelButton: {
    flex: 1,
    marginRight: SIZES.sm,
  },
  saveButton: {
    flex: 2,
  },
  preferencesCard: {
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    marginBottom: SIZES.md,
  },
  interestsContainer: {
    marginBottom: SIZES.md,
  },
  interestsLabel: {
    marginBottom: SIZES.xs,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  interestTag: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.borderRadius,
    marginRight: SIZES.xs,
    marginBottom: SIZES.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editInterestsButton: {
    padding: SIZES.xs,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  preferenceValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: SIZES.sm,
  },
  favoritesCard: {
    marginBottom: SIZES.lg,
  },
  favoritesList: {
    marginTop: SIZES.xs,
  },
  favoriteExhibit: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  exhibitImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.borderRadius,
    marginRight: SIZES.md,
  },
  exhibitInfo: {
    flex: 1,
  },
  logoutContainer: {
    alignItems: 'center',
    marginVertical: SIZES.xl,
  },
  logoutButton: {
    minWidth: 200,
  },
});