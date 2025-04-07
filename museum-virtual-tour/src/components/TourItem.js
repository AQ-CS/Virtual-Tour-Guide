// File: src/components/TourItem.js - For tour display/management

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TourItem = ({ tour, onPress, onEdit, onCancel }) => {
  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#8C52FF';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.tourName}>{tour.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tour.status) }]}>
          <Text style={styles.statusText}>{tour.status}</Text>
        </View>
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{tour.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{tour.time}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="hourglass-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{tour.duration} min</Text>
        </View>
      </View>
      
      <View style={styles.exhibitInfo}>
        <Text style={styles.exhibitCount}>
          {tour.exhibits.length} {tour.exhibits.length === 1 ? 'exhibit' : 'exhibits'}
        </Text>
      </View>
      
      {tour.status === 'upcoming' && (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(tour)}>
            <Ionicons name="create-outline" size={18} color="#8C52FF" />
            <Text style={[styles.actionText, {color: '#8C52FF'}]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onCancel(tour)}>
            <Ionicons name="close-circle-outline" size={18} color="#dc3545" />
            <Text style={[styles.actionText, {color: '#dc3545'}]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tourName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  exhibitInfo: {
    marginBottom: 12,
  },
  exhibitCount: {
    color: '#666',
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    padding: 6,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TourItem;