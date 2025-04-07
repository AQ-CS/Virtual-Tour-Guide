// components/tours/TourCard.js

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

import Card from '../ui/Card';
import Typography from '../ui/Typography';

const TourCard = ({
  tour,
  onPress,
  onEdit,
  onCancel,
}) => {
  // Function to format date
  const formatDate = (date) => {
    if (!date) return 'No date set';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  
  // Calculate tour status
  const getTourStatus = () => {
    if (!tour.date) return 'draft';
    
    const now = new Date();
    const tourDate = new Date(tour.date);
    
    if (tour.cancelled) return 'cancelled';
    if (tourDate < now && tour.completed) return 'completed';
    if (tourDate < now && !tour.completed) return 'missed';
    return 'upcoming';
  };
  
  // Get status colors
  const getStatusStyle = () => {
    const status = getTourStatus();
    
    switch (status) {
      case 'upcoming':
        return { color: COLORS.primary, backgroundColor: `${COLORS.primary}20` };
      case 'completed':
        return { color: COLORS.success, backgroundColor: `${COLORS.success}20` };
      case 'missed':
        return { color: COLORS.error, backgroundColor: `${COLORS.error}20` };
      case 'cancelled':
        return { color: COLORS.textLight, backgroundColor: `${COLORS.textLight}20` };
      case 'draft':
        return { color: COLORS.warning, backgroundColor: `${COLORS.warning}20` };
      default:
        return { color: COLORS.text, backgroundColor: COLORS.divider };
    }
  };
  
  // Get status text
  const getStatusText = () => {
    const status = getTourStatus();
    
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'missed': return 'Missed';
      case 'cancelled': return 'Cancelled';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Typography variant="h3" numberOfLines={1}>
          {tour.name || 'Untitled Tour'}
        </Typography>
        
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: getStatusStyle().backgroundColor }
          ]}
        >
          <Typography 
            variant="caption" 
            style={{ color: getStatusStyle().color }}
          >
            {getStatusText()}
          </Typography>
        </View>
      </View>
      
      <View style={styles.dateContainer}>
        <Typography variant="caption" color="light">
          {formatDate(tour.date)}
        </Typography>
        
        <Typography variant="caption">
          {tour.exhibits?.length || 0} exhibits
        </Typography>
      </View>
      
      {tour.description && (
        <Typography variant="body" numberOfLines={2} style={styles.description}>
          {tour.description}
        </Typography>
      )}
      
      {getTourStatus() !== 'completed' && getTourStatus() !== 'cancelled' && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onEdit(tour.id)}
            >
              <Typography variant="body" color="primary">
                Edit
              </Typography>
            </TouchableOpacity>
          )}
          
          {onCancel && getTourStatus() === 'upcoming' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onCancel(tour.id)}
            >
              <Typography variant="body" color="error">
                Cancel
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  statusBadge: {
    paddingHorizontal: SIZES.xs,
    paddingVertical: 2,
    borderRadius: SIZES.borderRadius / 2,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xs,
  },
  description: {
    marginTop: SIZES.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SIZES.md,
    paddingTop: SIZES.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  actionButton: {
    marginLeft: SIZES.md,
    padding: SIZES.xs,
  },
});

export default TourCard;