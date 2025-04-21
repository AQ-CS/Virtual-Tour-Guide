// File: src/components/ExhibitCard.js - Enhanced with modern design elements and dynamic image loading

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Define an image map - this is how we handle dynamic images in React Native
// The key should match the filename in your exhibit data
const exhibitImages = {
  'pearl_diving.png': require('../../assets/models/pearl_diving.png'),
  'pearl_diving.jpg': require('../../assets/models/pearl_diving.png'),
  'islamic_innovations.jpg': require('../../assets/models/golden_age.png'),
  'desert_life.jpg': require('../../assets/models/desert_life.png'),
  'uae_architecture.jpg': require('../../assets/models/uae_architecture.png'),
  'calligraphy.jpg': require('../../assets/models/calligraphy.png'),
  // Add other exhibit images as needed
};

const ExhibitCard = ({ exhibit, onPress, onAddToTour, compact = false }) => {
  // Get image source from map or default to placeholder
  const getImageSource = () => {
    // If it's a URL, return as uri
    if (exhibit.image && exhibit.image.startsWith('http')) {
      return { uri: exhibit.image };
    }
    
    // If the image exists in our map, use it
    if (exhibit.image && exhibitImages[exhibit.image]) {
      return exhibitImages[exhibit.image];
    }
    
    // Otherwise use placeholder
    return require('../../assets/images/placeholder.png');
  };
  
  const imageSource = getImageSource();
  
  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onPress} activeOpacity={0.9}>
        <Image source={imageSource} style={styles.compactImage} />
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle} numberOfLines={1}>{exhibit.name}</Text>
          <Text style={styles.compactLocation} numberOfLines={1}>{exhibit.location}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image source={imageSource} style={styles.image} />
      
      {/* Semi-transparent gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{exhibit.name}</Text>
          <View style={styles.detailsRow}>
            <Ionicons name="location" size={16} color="#fff" />
            <Text style={styles.location}>{exhibit.location}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{exhibit.rating}</Text>
          </View>
        </View>
        
        {/* Glass-morphism add button */}
        {onAddToTour && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => onAddToTour(exhibit)}
          >
            <BlurView intensity={70} tint="light" style={styles.addButtonBlur}>
              <Ionicons name="add" size={24} color="#8C52FF" />
            </BlurView>
          </TouchableOpacity>
        )}
      </LinearGradient>
      
      {/* Category badge */}
      <View style={styles.categoryBadge}>
        <BlurView intensity={80} tint="light" style={styles.categoryBlur}>
          <Text style={styles.categoryText}>{exhibit.category}</Text>
        </BlurView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  rating: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  // Glass morphism add button
  addButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonBlur: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  // Category badge
  categoryBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 10,
  },
  categoryBlur: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  // Compact card styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  compactImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  compactLocation: {
    fontSize: 14,
    color: '#666',
  },
});

export default ExhibitCard;