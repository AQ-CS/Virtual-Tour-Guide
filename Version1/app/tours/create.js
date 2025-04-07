// app/tours/create.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES } from '../../constants/theme';

import Typography from '../../components/ui/Typography';
import TourForm from '../../components/tours/TourForm';

// Mock data for demonstration
const mockExhibits = [
  {
    id: 'exhibit1',
    name: 'Ancient Bedouin Artifacts',
    category: 'Heritage',
  },
  {
    id: 'exhibit2',
    name: 'Islamic Calligraphy',
    category: 'Art',
  },
  {
    id: 'exhibit3',
    name: 'Pearl Diving Heritage',
    category: 'Maritime',
  },
  {
    id: 'exhibit4',
    name: 'Modern Architecture of UAE',
    category: 'Modern',
  },
  {
    id: 'exhibit5',
    name: 'Traditional Clothing',
    category: 'Culture',
  },
  {
    id: 'exhibit6',
    name: 'Desert Wildlife',
    category: 'Natural History',
  },
];

export default function CreateTour() {
  const router = useRouter();
  const { exhibitId } = useLocalSearchParams();
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch exhibits data
    setTimeout(() => {
      setExhibits(mockExhibits);
      setLoading(false);
    }, 800);
  }, []);

  const handleSubmitTour = (tourData) => {
    setSubmitting(true);
    
    // Simulate API call to create tour
    setTimeout(() => {
      setSubmitting(false);
      
      // Navigate back to tours list
      router.replace('/tours');
    }, 1500);
  };

  const handleCancel = () => {
    router.back();
  };

  // Create initial data with pre-selected exhibit if provided
  const initialData = {
    name: '',
    description: '',
    date: '',
    exhibits: exhibitId ? [exhibitId] : [],
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Typography>Loading exhibits data...</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Typography variant="h2" style={styles.title}>
        Create New Tour
      </Typography>
      
      <Typography variant="body" style={styles.subtitle}>
        Plan your museum experience by selecting exhibits and setting a date
      </Typography>
      
      <TourForm
        initialData={initialData}
        onSubmit={handleSubmitTour}
        onCancel={handleCancel}
        loading={submitting}
        exhibits={exhibits}
      />
    </View>
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
  title: {
    textAlign: 'center',
    marginBottom: SIZES.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SIZES.lg,
    color: COLORS.textSecondary,
  },
});