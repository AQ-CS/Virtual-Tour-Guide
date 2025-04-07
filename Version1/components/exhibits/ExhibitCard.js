// components/exhibits/ExhibitCard.js

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

import Typography from '../ui/Typography';
import Card from '../ui/Card';

const ExhibitCard = ({
  exhibit,
  onPress,
  onAddToTour,
  isFavorite = false,
  onToggleFavorite,
  compact = false,
}) => {
  return (
    <Card onPress={onPress} style={[styles.card, compact && styles.compactCard]}>
      <Image 
        source={{ uri: exhibit.imageUrl || 'https://via.placeholder.com/300x200' }} 
        style={[styles.image, compact && styles.compactImage]}
        resizeMode="cover"
      />
      
      <View style={styles.overlay}>
        {!compact && (
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(exhibit.id)}
          >
            <Typography variant="h3" color="white">
              {isFavorite ? '★' : '☆'}
            </Typography>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Typography 
            variant={compact ? 'body' : 'h3'} 
            numberOfLines={1}
          >
            {exhibit.name}
          </Typography>
          
          {!compact && (
            <View style={styles.category}>
              <Typography variant="caption" color="white">
                {exhibit.category}
              </Typography>
            </View>
          )}
        </View>
        
        {!compact && (
          <Typography variant="caption" numberOfLines={2} style={styles.description}>
            {exhibit.description}
          </Typography>
        )}
        
        <View style={styles.footer}>
          {!compact && (
            <Typography variant="caption" color="light">
              {exhibit.era || 'Unknown era'}
            </Typography>
          )}
          
          {!compact && onAddToTour && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => onAddToTour(exhibit.id)}
            >
              <Typography variant="caption" color="primary">
                + Add to Tour
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SIZES.md,
    padding: 0,
    overflow: 'hidden',
  },
  compactCard: {
    width: 150,
    marginRight: SIZES.md,
  },
  image: {
    width: '100%',
    height: 180,
  },
  compactImage: {
    height: 100,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: SIZES.xs,
  },
  favoriteButton: {
    padding: SIZES.xs,
  },
  content: {
    padding: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  category: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.xs,
    paddingVertical: 2,
    borderRadius: SIZES.borderRadius / 2,
  },
  description: {
    marginBottom: SIZES.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  addButton: {
    padding: SIZES.xs,
  }
});

export default ExhibitCard;