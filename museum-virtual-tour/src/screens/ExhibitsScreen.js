// File: src/screens/ExhibitsScreen.js - With null check for currentUser

import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../AppContext';
import AppHeader from '../components/AppHeader';
import ExhibitCard from '../components/ExhibitCard';

const ExhibitsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { exhibits, currentUser, tours, setTours, isLoading } = useContext(AppContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredExhibits, setFilteredExhibits] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedExhibit, setSelectedExhibit] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedExhibitRating, setSelectedExhibitRating] = useState(0);
  const [selectedExhibitComment, setSelectedExhibitComment] = useState('');

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
        <Text style={styles.loadingText}>Loading exhibits...</Text>
      </View>
    );
  }
  
  // Extract all unique categories
  useEffect(() => {
    if (exhibits) {
      const uniqueCategories = ['All', ...new Set(exhibits.map(exhibit => exhibit.category))];
      setCategories(uniqueCategories);
    }
  }, [exhibits]);
  
  // Filter exhibits based on search and category
  useEffect(() => {
    if (exhibits) {
      let filtered = [...exhibits];
      
      if (searchQuery) {
        filtered = filtered.filter(exhibit => 
          exhibit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exhibit.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(exhibit => exhibit.category === selectedCategory);
      }
      
      setFilteredExhibits(filtered);
      
      // Check if we should open a specific exhibit from params
      if (route.params?.exhibitId) {
        const exhibit = exhibits.find(ex => ex.id === route.params.exhibitId);
        if (exhibit) {
          setSelectedExhibit(exhibit);
          setDetailsVisible(true);
          // Clear the parameter after use
          navigation.setParams({ exhibitId: undefined });
        }
      }
    }
  }, [exhibits, searchQuery, selectedCategory, route.params]);
  
  const addToTour = (exhibit) => {
    // Check if user has any upcoming tours
    const userTours = tours.filter(t => t.userId === currentUser.id && t.status === 'upcoming');
    
    if (userTours.length === 0) {
      // Redirect to tour creation
      navigation.navigate('Tours', { newTour: true, exhibitId: exhibit.id });
    } else {
      // Prompt user to select a tour (simplified - just adds to first tour)
      const updatedTours = tours.map(tour => {
        if (tour.id === userTours[0].id) {
          if (!tour.exhibits.includes(exhibit.id)) {
            return {
              ...tour,
              exhibits: [...tour.exhibits, exhibit.id]
            };
          }
        }
        return tour;
      });
      
      setTours(updatedTours);
      alert(`Added "${exhibit.name}" to your tour!`);
    }
  };
  
  const handleRateExhibit = () => {
    // This would typically update the rating in a real backend
    alert(`Thank you for rating "${selectedExhibit.name}" with ${selectedExhibitRating} stars!`);
    setDetailsVisible(false);
  };
  
  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item && styles.selectedCategoryChip
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text 
        style={[
          styles.categoryChipText,
          selectedCategory === item && styles.selectedCategoryChipText
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
  
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
        title="Explore Exhibits" 
      />
      
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8C52FF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exhibits..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#8C52FF" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryChip}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Exhibits list */}
      <FlatList
        data={filteredExhibits}
        renderItem={({ item }) => (
          <ExhibitCard
            exhibit={item}
            onPress={() => {
              setSelectedExhibit(item);
              setDetailsVisible(true);
            }}
            onAddToTour={() => addToTour(item)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.exhibitsList}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Exhibit details modal */}
      <Modal
        visible={detailsVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setDetailsVisible(false)}
      >
        {selectedExhibit && (
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#8C52FF', '#A67FFB', '#F0EBFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.backgroundGradient}
            />
            
            <AppHeader 
              title="Exhibit Details" 
              onBackPress={() => setDetailsVisible(false)}
              rightIcon="add-circle-outline"
              onRightPress={() => addToTour(selectedExhibit)}
            />
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.exhibitImageContainer}>
                <Image 
                  source={
                    selectedExhibit.image.includes('http') 
                      ? { uri: selectedExhibit.image } 
                      : require('../../assets/images/placeholder.png')
                  }
                  style={styles.exhibitImage}
                />
              </View>
              
              <View style={styles.exhibitInfo}>
                <Text style={styles.exhibitTitle}>{selectedExhibit.name}</Text>
                
                <View style={styles.exhibitMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.metaText}>{selectedExhibit.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.metaText}>{selectedExhibit.rating}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="pricetag-outline" size={16} color="#666" />
                    <Text style={styles.metaText}>{selectedExhibit.category}</Text>
                  </View>
                </View>
                
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>{selectedExhibit.description}</Text>
                </View>
                
                <View style={styles.ratingSection}>
                  <Text style={styles.ratingTitle}>Rate This Exhibit</Text>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <TouchableOpacity 
                        key={star}
                        onPress={() => setSelectedExhibitRating(star)}
                      >
                        <Ionicons 
                          name={selectedExhibitRating >= star ? "star" : "star-outline"} 
                          size={36} 
                          color="#FFD700" 
                          style={styles.starIcon}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Share your thoughts about this exhibit..."
                    multiline
                    value={selectedExhibitComment}
                    onChangeText={setSelectedExhibitComment}
                    placeholderTextColor="#999"
                  />
                  
                  <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handleRateExhibit}
                  >
                    <Text style={styles.submitButtonText}>Submit Rating</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(140, 82, 255, 0.2)',
  },
  selectedCategoryChip: {
    backgroundColor: '#8C52FF',
  },
  categoryChipText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  exhibitsList: {
    padding: 16,
    paddingBottom: 32,
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  exhibitImageContainer: {
    width: '100%',
    height: 250,
    overflow: 'hidden',
  },
  exhibitImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  exhibitInfo: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 24,
  },
  exhibitTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  exhibitMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 4,
    color: '#666',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  ratingSection: {
    marginTop: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(140, 82, 255, 0.1)',
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starIcon: {
    marginHorizontal: 8,
  },
  commentInput: {
    backgroundColor: '#f9f7ff',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(140, 82, 255, 0.1)',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#8C52FF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExhibitsScreen;