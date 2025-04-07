// app/tours/edit.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SIZES } from '../../constants/theme';

import Typography from '../../components/ui/Typography';
import TourForm from '../../components/tours/TourForm';

// Mock tour data
const mockTours = {
  '1': {
    id: '1',
    name: 'Islamic Art Exploration',
    description: 'Discover the beauty of Islamic art and architecture throughout history.',
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    exhibits: ['exhibit1', 'exhibit2', 'exhibit3'],
  },
  // Other tours would be defined here
};

// Mock exhibits data
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

export default function EditTour() {
  const { id } = useLocalSearchParams();
  const [tour, setTour] = useState(null);
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate API call to fetch tour data
    setTimeout(() => {
      const tourData = mockTours[id] || {
        id: id,
        name: '',
        description: '',
        date: '',
        exhibits: [],
      };
      
      setTour(tourData);
      setExhibits(mockExhibits);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleUpdateTour = (tourData) => {
    setSaving(true);
    
    // Simulate API call to update tour
    setTimeout(() => {
      setSaving(false);
      router.replace('/tours');
    }, 1500);
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Typography>Loading tour information...</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">Edit Tour</Typography>
      </View>
      
      <TourForm
        initialData={tour}
        onSubmit={handleUpdateTour}
        onCancel={handleCancel}
        loading={saving}
        exhibits={exhibits}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: SIZES.md,
    alignItems: 'center',
  },
});