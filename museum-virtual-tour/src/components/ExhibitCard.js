// File: src/components/ExhibitCard.js - For displaying exhibits

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ExhibitCard = ({ exhibit, onPress, onAddToTour, compact = false }) => {
  // Default image if none provided or for testing without real images
  const imageSrc = exhibit.image.includes('http') 
    ? { uri: exhibit.image } 
    : require('../../assets/images/placeholder.png');
  
  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onPress}>
        <Image source={imageSrc} style={styles.compactImage} />
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle} numberOfLines={1}>{exhibit.name}</Text>
          <Text style={styles.compactLocation} numberOfLines={1}>{exhibit.location}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={imageSrc} style={styles.image} />
      <View style={styles.overlay}>
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
        
        {onAddToTour && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => onAddToTour(exhibit)}
          >
            <Ionicons name="add-circle" size={32} color="#8C52FF" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  },
  rating: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  // Compact card styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
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