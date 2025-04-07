// app/tours/index.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants/theme';

import Typography from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tours/TourCard';

// Mock data for demonstration
const mockTours = [
  {
    id: '1',
    name: 'Islamic Art Exploration',
    description: 'Discover the beauty of Islamic art and architecture throughout history.',
    date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    exhibits: ['exhibit1', 'exhibit2', 'exhibit3'],
    completed: false,
    cancelled: false,
  },
  {
    id: '2',
    name: 'Modern UAE',
    description: 'Explore the rapid development and modernization of the UAE through the years.',
    date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    exhibits: ['exhibit4', 'exhibit5'],
    completed: false,
    cancelled: false,
  },
  {
    id: '3',
    name: 'Desert Life & Traditions',
    description: 'Learn about traditional Bedouin life and cultural practices in the Arabian desert.',
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    exhibits: ['exhibit6', 'exhibit7', 'exhibit8', 'exhibit9'],
    completed: true,
    cancelled: false,
  },
  {
    id: '4',
    name: 'Maritime Heritage',
    description: 'Discover the rich maritime history of the UAE and its importance to the culture.',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    exhibits: ['exhibit10', 'exhibit11'],
    completed: false,
    cancelled: true,
  },
];

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate API call to fetch tours
    setTimeout(() => {
      setTours(mockTours);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateTour = () => {
    router.push('/tours/create');
  };

  const handleViewTour = (tourId) => {
    router.push(`/tours/${tourId}`);
  };

  const handleEditTour = (tourId) => {
    router.push(`/tours/edit?id=${tourId}`);
  };

  const handleCancelTour = (tourId) => {
    // In a real app, you would call an API here
    setTours(tours.map(tour => 
      tour.id === tourId ? { ...tour, cancelled: true } : tour
    ));
  };

  // Filter tours by status
  const upcomingTours = tours.filter(tour => {
    const tourDate = new Date(tour.date);
    return tourDate > new Date() && !tour.cancelled;
  });

  const pastTours = tours.filter(tour => {
    const tourDate = new Date(tour.date);
    return (tourDate <= new Date() || tour.cancelled);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">My Tours</Typography>
        <Button
          title="Create Tour"
          onPress={handleCreateTour}
          size="small"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Typography>Loading your tours...</Typography>
        </View>
      ) : (
        <ScrollView>
          {upcomingTours.length > 0 && (
            <View style={styles.section}>
              <Typography variant="h3" style={styles.sectionTitle}>Upcoming Tours</Typography>
              {upcomingTours.map(tour => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onPress={() => handleViewTour(tour.id)}
                  onEdit={() => handleEditTour(tour.id)}
                  onCancel={() => handleCancelTour(tour.id)}
                />
              ))}
            </View>
          )}

          {pastTours.length > 0 && (
            <View style={styles.section}>
              <Typography variant="h3" style={styles.sectionTitle}>Past Tours</Typography>
              {pastTours.map(tour => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onPress={() => handleViewTour(tour.id)}
                />
              ))}
            </View>
          )}

          {tours.length === 0 && (
            <View style={styles.emptyContainer}>
              <Typography variant="h3" style={styles.emptyTitle}>No Tours Yet</Typography>
              <Typography style={styles.emptyText}>
                Create your first tour to start exploring the museum.
              </Typography>
              <Button
                title="Create Your First Tour"
                onPress={handleCreateTour}
                style={styles.emptyButton}
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
    paddingHorizontal: SIZES.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    marginBottom: SIZES.md,
    paddingHorizontal: SIZES.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.xl,
    marginTop: SIZES.xl * 2,
  },
  emptyTitle: {
    marginBottom: SIZES.md,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: SIZES.xl,
    color: COLORS.textSecondary,
  },
  emptyButton: {
    minWidth: 200,
  },
});