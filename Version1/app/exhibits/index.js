// app/exhibits/index.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants/theme';

import Typography from '../../components/ui/Typography';
import ExhibitCard from '../../components/exhibits/ExhibitCard';

// Mock data for demonstration
const mockExhibits = [
  {
    id: 'exhibit1',
    name: 'Ancient Bedouin Artifacts',
    description: 'Collection of tools, ornaments, and daily items used by Bedouin tribes in the Arabian Peninsula.',
    category: 'Heritage',
    era: '18th-19th Century',
    imageUrl: 'https://via.placeholder.com/300x200?text=Bedouin+Artifacts',
  },
  {
    id: 'exhibit2',
    name: 'Islamic Calligraphy',
    description: 'Beautiful examples of Islamic calligraphy from different periods, showcasing the art of Arabic script.',
    category: 'Art',
    era: 'Various Periods',
    imageUrl: 'https://via.placeholder.com/300x200?text=Islamic+Calligraphy',
  },
  {
    id: 'exhibit3',
    name: 'Pearl Diving Heritage',
    description: 'Artifacts and interactive displays about the traditional pearl diving industry that was central to the UAE economy.',
    category: 'Maritime',
    era: '19th-20th Century',
    imageUrl: 'https://via.placeholder.com/300x200?text=Pearl+Diving',
  },
  {
    id: 'exhibit4',
    name: 'Modern Architecture of UAE',
    description: 'Exhibition showcasing the architectural marvels of modern UAE, from the Burj Khalifa to the Louvre Abu Dhabi.',
    category: 'Modern',
    era: '21st Century',
    imageUrl: 'https://via.placeholder.com/300x200?text=Modern+Architecture',
  },
  {
    id: 'exhibit5',
    name: 'Traditional Clothing',
    description: 'Collection of traditional Emirati clothing for men and women, showing the evolution of fashion while preserving cultural identity.',
    category: 'Culture',
    era: 'Various Periods',
    imageUrl: 'https://via.placeholder.com/300x200?text=Traditional+Clothing',
  },
  {
    id: 'exhibit6',
    name: 'Desert Wildlife',
    description: 'Discover the diverse wildlife that has adapted to survive in the harsh desert climate of the UAE.',
    category: 'Natural History',
    era: 'Contemporary',
    imageUrl: 'https://via.placeholder.com/300x200?text=Desert+Wildlife',
  },
];

// Category filters
const categories = ['All', 'Heritage', 'Art', 'Maritime', 'Modern', 'Culture', 'Natural History'];

export default function Exhibits() {
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Simulate API call to fetch exhibits
    setTimeout(() => {
      setExhibits(mockExhibits);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewExhibit = (exhibitId) => {
    router.push(`/exhibits/${exhibitId}`);
  };

  const handleAddToTour = (exhibitId) => {
    // In a real app, this would open a modal to select which tour to add to
    // or navigate to a specific page
    alert(`Add exhibit ${exhibitId} to tour`);
  };

  const handleToggleFavorite = (exhibitId) => {
    if (favorites.includes(exhibitId)) {
      setFavorites(favorites.filter(id => id !== exhibitId));
    } else {
      setFavorites([...favorites, exhibitId]);
    }
  };

  // Filter exhibits based on search and category
  const filteredExhibits = exhibits.filter(exhibit => {
    const matchesSearch = exhibit.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         exhibit.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exhibit.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exhibits..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Typography
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.selectedCategoryText
                ]}
              >
                {item}
              </Typography>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Typography>Loading exhibits...</Typography>
        </View>
      ) : (
        <FlatList
          data={filteredExhibits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExhibitCard
              exhibit={item}
              onPress={() => handleViewExhibit(item.id)}
              onAddToTour={() => handleAddToTour(item.id)}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={styles.exhibitsList}
          numColumns={1}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.md,
  },
  searchContainer: {
    marginBottom: SIZES.md,
  },
  searchInput: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.md,
    fontSize: SIZES.md,
  },
  categoriesContainer: {
    marginBottom: SIZES.md,
  },
  categoriesList: {
    paddingVertical: SIZES.xs,
  },
  categoryButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    marginRight: SIZES.sm,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.card,
  },
  selectedCategory: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.text,
  },
  selectedCategoryText: {
    color: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exhibitsList: {
    paddingBottom: SIZES.xl,
  },
});