// app/tours/[id].js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

import Typography from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';

// Mock data for tours
const mockTours = {
  '1': {
    id: '1',
    name: 'Islamic Art Exploration',
    description: 'Discover the beauty of Islamic art and architecture throughout history.',
    date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    exhibits: ['exhibit2', 'exhibit4', 'exhibit5'],
    completed: false,
    cancelled: false,
  },
  '2': {
    id: '2',
    name: 'Modern UAE',
    description: 'Explore the rapid development and modernization of the UAE through the years.',
    date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    exhibits: ['exhibit4', 'exhibit3'],
    completed: false,
    cancelled: false,
  },
  // Add more tour data as needed
};

// Mock exhibit data
const mockExhibits = {
  'exhibit2': {
    id: 'exhibit2',
    name: 'Islamic Calligraphy',
    description: 'Beautiful examples of Islamic calligraphy from different periods, showcasing the art of Arabic script.',
    category: 'Art',
    location: 'East Wing, Gallery 3',
    imageUrl: 'https://via.placeholder.com/300x200?text=Islamic+Calligraphy',
  },
  'exhibit3': {
    id: 'exhibit3',
    name: 'Pearl Diving Heritage',
    description: 'Artifacts and interactive displays about the traditional pearl diving industry that was central to the UAE economy.',
    category: 'Maritime',
    location: 'West Wing, Gallery 1',
    imageUrl: 'https://via.placeholder.com/300x200?text=Pearl+Diving',
  },
  'exhibit4': {
    id: 'exhibit4',
    name: 'Modern Architecture of UAE',
    description: 'Exhibition showcasing the architectural marvels of modern UAE, from the Burj Khalifa to the Louvre Abu Dhabi.',
    category: 'Modern',
    location: 'Central Hall',
    imageUrl: 'https://via.placeholder.com/300x200?text=Modern+Architecture',
  },
  'exhibit5': {
    id: 'exhibit5',
    name: 'Traditional Clothing',
    description: 'Collection of traditional Emirati clothing for men and women, showing the evolution of fashion while preserving cultural identity.',
    category: 'Culture',
    location: 'East Wing, Gallery 2',
    imageUrl: 'https://via.placeholder.com/300x200?text=Traditional+Clothing',
  },
};

export default function TourDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tour, setTour] = useState(null);
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch tour details
    setTimeout(() => {
      const tourData = mockTours[id];
      setTour(tourData);
      
      if (tourData && tourData.exhibits) {
        // Get exhibit details for all exhibits in the tour
        const exhibitDetails = tourData.exhibits
          .map(exhibitId => mockExhibits[exhibitId])
          .filter(Boolean);
        
        setExhibits(exhibitDetails);
      }
      
      setLoading(false);
    }, 800);
  }, [id]);

  const handleEditTour = () => {
    router.push(`/tours/edit?id=${id}`);
  };

  const handleCancelTour = () => {
    // Close modal
    setCancelModalVisible(false);
    
    // In a real app, you would call an API to cancel the tour
    setTimeout(() => {
      // Navigate back to tours list
      router.replace('/tours');
    }, 500);
  };

  const handleStartNavigation = (exhibitId) => {
    router.push(`/navigation?destination=${exhibitId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get tour status
  const getTourStatus = () => {
    if (!tour || !tour.date) return 'draft';
    
    const now = new Date();
    const tourDate = new Date(tour.date);
    
    if (tour.cancelled) return 'cancelled';
    if (tourDate < now && tour.completed) return 'completed';
    if (tourDate < now && !tour.completed) return 'missed';
    return 'upcoming';
  };

  // Get status colors and text
  const getStatusStyle = () => {
    const status = getTourStatus();
    
    switch (status) {
      case 'upcoming':
        return { color: COLORS.primary, backgroundColor: `${COLORS.primary}20`, text: 'Upcoming' };
      case 'completed':
        return { color: COLORS.success, backgroundColor: `${COLORS.success}20`, text: 'Completed' };
      case 'missed':
        return { color: COLORS.error, backgroundColor: `${COLORS.error}20`, text: 'Missed' };
      case 'cancelled':
        return { color: COLORS.textLight, backgroundColor: `${COLORS.textLight}20`, text: 'Cancelled' };
      case 'draft':
        return { color: COLORS.warning, backgroundColor: `${COLORS.warning}20`, text: 'Draft' };
      default:
        return { color: COLORS.text, backgroundColor: COLORS.divider, text: 'Unknown' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Typography>Loading tour details...</Typography>
      </View>
    );
  }

  if (!tour) {
    return (
      <View style={styles.errorContainer}>
        <Typography variant="h3">Tour Not Found</Typography>
        <Button 
          title="Back to Tours" 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
      </View>
    );
  }

  const statusStyle = getStatusStyle();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">{tour.name}</Typography>
        
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: statusStyle.backgroundColor }
          ]}
        >
          <Typography 
            variant="body" 
            style={{ color: statusStyle.color }}
          >
            {statusStyle.text}
          </Typography>
        </View>
      </View>
      
      <View style={styles.dateContainer}>
        <Typography variant="h3">Scheduled For:</Typography>
        <Typography variant="body" style={styles.date}>
          {formatDate(tour.date)}
        </Typography>
      </View>
      
      {tour.description && (
        <Card style={styles.descriptionCard}>
          <Typography variant="body">{tour.description}</Typography>
        </Card>
      )}
      
      <View style={styles.exhibitsSection}>
        <Typography variant="h3" style={styles.sectionTitle}>
          Tour Exhibits ({exhibits.length})
        </Typography>
        
        {exhibits.map((exhibit, index) => (
          <Card key={exhibit.id} style={styles.exhibitCard}>
            <TouchableOpacity
              style={styles.exhibitContent}
              onPress={() => router.push(`/exhibits/${exhibit.id}`)}
            >
              <Image 
                source={{ uri: exhibit.imageUrl }} 
                style={styles.exhibitImage}
                resizeMode="cover"
              />
              
              <View style={styles.exhibitInfo}>
                <Typography variant="h3" numberOfLines={1}>{index + 1}. {exhibit.name}</Typography>
                
                <View style={styles.categoryBadge}>
                  <Typography variant="caption" color="white">
                    {exhibit.category}
                  </Typography>
                </View>
                
                <Typography variant="caption" style={styles.exhibitLocation}>
                  Location: {exhibit.location}
                </Typography>
                
                <Typography variant="body" numberOfLines={2} style={styles.exhibitDescription}>
                  {exhibit.description}
                </Typography>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navigationButton}
              onPress={() => handleStartNavigation(exhibit.id)}
            >
              <Typography variant="body" color="primary">Navigate</Typography>
            </TouchableOpacity>
          </Card>
        ))}
      </View>
      
      {exhibits.length === 0 && (
        <View style={styles.emptyExhibits}>
          <Typography variant="body" style={styles.emptyText}>
            No exhibits have been added to this tour yet.
          </Typography>
        </View>
      )}
      
      {getTourStatus() === 'upcoming' && (
        <View style={styles.actions}>
          <Button
            title="Edit Tour"
            onPress={handleEditTour}
            style={styles.actionButton}
          />
          
          <Button
            title="Cancel Tour"
            variant="outline"
            onPress={() => setCancelModalVisible(true)}
            style={styles.actionButton}
          />
        </View>
      )}
      
      <Modal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        title="Cancel Tour"
        footer={
          <View style={styles.modalFooter}>
            <Button
              title="No, Keep It"
              variant="outline"
              onPress={() => setCancelModalVisible(false)}
              style={styles.modalButton}
            />
            
            <Button
              title="Yes, Cancel Tour"
              variant="primary"
              onPress={handleCancelTour}
              style={styles.modalButton}
            />
          </View>
        }
      >
        <Typography variant="body">
          Are you sure you want to cancel this tour? This action cannot be undone.
        </Typography>
      </Modal>
    </ScrollView>
  );
}
// app/tours/[id].js (continued - styles)

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
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SIZES.lg,
    },
    backButton: {
      marginTop: SIZES.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SIZES.md,
    },
    statusBadge: {
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.xs,
      borderRadius: SIZES.borderRadius,
    },
    dateContainer: {
      marginBottom: SIZES.md,
    },
    date: {
      marginTop: SIZES.xs,
      color: COLORS.textSecondary,
    },
    descriptionCard: {
      marginBottom: SIZES.lg,
    },
    exhibitsSection: {
      marginBottom: SIZES.xl,
    },
    sectionTitle: {
      marginBottom: SIZES.md,
    },
    exhibitCard: {
      marginBottom: SIZES.md,
      padding: 0,
      overflow: 'hidden',
    },
    exhibitContent: {
      flexDirection: 'row',
      padding: SIZES.md,
    },
    exhibitImage: {
      width: 100,
      height: 100,
      borderRadius: SIZES.borderRadius,
    },
    exhibitInfo: {
      flex: 1,
      marginLeft: SIZES.md,
    },
    categoryBadge: {
      backgroundColor: COLORS.secondary,
      paddingHorizontal: SIZES.xs,
      paddingVertical: 2,
      borderRadius: SIZES.borderRadius / 2,
      alignSelf: 'flex-start',
      marginTop: SIZES.xs,
      marginBottom: SIZES.xs,
    },
    exhibitLocation: {
      color: COLORS.textSecondary,
      marginBottom: SIZES.xs,
    },
    exhibitDescription: {
      color: COLORS.text,
    },
    navigationButton: {
      padding: SIZES.sm,
      borderTopWidth: 1,
      borderTopColor: COLORS.divider,
      alignItems: 'center',
    },
    emptyExhibits: {
      padding: SIZES.xl,
      alignItems: 'center',
    },
    emptyText: {
      textAlign: 'center',
      color: COLORS.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SIZES.xl,
    },
    actionButton: {
      flex: 1,
      marginHorizontal: SIZES.xs,
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    modalButton: {
      marginLeft: SIZES.sm,
    },
  });