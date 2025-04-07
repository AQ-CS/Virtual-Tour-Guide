// app/exhibits/[id].js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

import Typography from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// Mock data for demonstration
const mockExhibits = {
  'exhibit1': {
    id: 'exhibit1',
    name: 'Ancient Bedouin Artifacts',
    description: 'This collection showcases tools, ornaments, and daily items used by Bedouin tribes in the Arabian Peninsula. These artifacts provide valuable insights into the nomadic lifestyle and resourcefulness of Bedouin communities, who adapted to the harsh desert conditions.\n\nHighlights include hand-crafted jewelry, traditional coffee pots (dallah), woven textiles, and hunting equipment. Each piece demonstrates the remarkable craftsmanship and cultural heritage of the region\'s indigenous people.',
    longDescription: 'The Bedouin, nomadic Arab peoples of the Middle Eastern deserts, developed a distinct culture adapted to the harsh desert environment. This exhibit showcases artifacts dating from the 18th and 19th centuries, representing a way of life that has existed for thousands of years but has undergone significant changes in the modern era.\n\nThe items in this collection reflect the resourcefulness and practicality of Bedouin craftsmanship. Every material was utilized efficiently, with multiple purposes often assigned to a single item. The aesthetic elements seen in these artifacts combine geometric patterns with organic motifs, reflecting both Islamic artistic traditions and the natural world.\n\nMany of these artifacts were donated by prominent UAE families who maintained collections of traditional items to preserve their cultural heritage. Conservation efforts have been made to maintain these pieces in their original condition while making them accessible to the public.',
    category: 'Heritage',
    era: '18th-19th Century',
    imageUrl: 'https://via.placeholder.com/500x300?text=Bedouin+Artifacts',
    galleryImages: [
      'https://via.placeholder.com/400x300?text=Bedouin+Artifact+1',
      'https://via.placeholder.com/400x300?text=Bedouin+Artifact+2',
      'https://via.placeholder.com/400x300?text=Bedouin+Artifact+3',
    ],
    location: 'West Wing, Gallery 2',
    reviews: [
      { id: 'r1', user: 'Ahmed S.', rating: 5, comment: 'Fascinating collection that tells the story of early desert life.' },
      { id: 'r2', user: 'Sarah M.', rating: 4, comment: 'The craftsmanship on display is incredible. Highly recommended!' },
    ],
    relatedExhibits: ['exhibit3', 'exhibit5']
  },
  'exhibit2': {
    id: 'exhibit2',
    name: 'Islamic Calligraphy',
    description: 'Beautiful examples of Islamic calligraphy from different periods, showcasing the art of Arabic script. This collection features works from master calligraphers across the Islamic world.',
    longDescription: 'Islamic calligraphy is considered one of the highest art forms in Islamic culture. The prohibition of figurative representation in religious contexts led to the elevation of Arabic script as both a communication medium and an art form.\n\nThis collection spans from the 9th to the 19th century, displaying the evolution of various calligraphic styles including Kufic, Naskh, Thuluth, Diwani, and Nastaliq. The works are executed on various media including parchment, paper, ceramic, metal, and architectural elements.\n\nMany pieces feature verses from the Quran, poetry, or wisdom sayings. The aesthetic value of these works goes beyond their textual meaning, as the arrangement and flow of the script creates a visual harmony that can be appreciated even by those who cannot read Arabic.\n\nConservation of these delicate pieces involves careful climate control and limited light exposure to preserve their vibrant colors and intricate details.',
    category: 'Art',
    era: 'Various Periods',
    imageUrl: 'https://via.placeholder.com/500x300?text=Islamic+Calligraphy',
    galleryImages: [
      'https://via.placeholder.com/400x300?text=Calligraphy+1',
      'https://via.placeholder.com/400x300?text=Calligraphy+2',
      'https://via.placeholder.com/400x300?text=Calligraphy+3',
    ],
    location: 'East Wing, Gallery 3',
    reviews: [
      { id: 'r1', user: 'Fatima A.', rating: 5, comment: 'The precision and beauty of these works is breathtaking.' },
      { id: 'r2', user: 'Omar K.', rating: 5, comment: 'As someone who studies Arabic calligraphy, this collection is exceptional.' },
    ],
    relatedExhibits: ['exhibit4']
  },
  // Add more exhibit data as needed
};

export default function ExhibitDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [exhibit, setExhibit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Simulate API call to fetch exhibit details
    setTimeout(() => {
      setExhibit(mockExhibits[id]);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleAddToTour = () => {
    // In a real app, this would open a modal to select which tour to add to
    router.push(`/tours/create?exhibitId=${id}`);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would update the user's favorites in the database
  };

  const handleNavigateToExhibit = () => {
    router.push(`/navigation?destination=${id}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Typography>Loading exhibit details...</Typography>
      </View>
    );
  }

  if (!exhibit) {
    return (
      <View style={styles.errorContainer}>
        <Typography variant="h3">Exhibit Not Found</Typography>
        <Button 
          title="Back to Exhibits" 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: exhibit.galleryImages?.[selectedImage] || exhibit.imageUrl }} 
          style={styles.mainImage}
          resizeMode="cover"
        />

        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Typography variant="h2" color="white">
            {isFavorite ? '★' : '☆'}
          </Typography>
        </TouchableOpacity>
      </View>

      {exhibit.galleryImages && exhibit.galleryImages.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {exhibit.galleryImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImage(index)}
              style={[
                styles.thumbnail,
                selectedImage === index && styles.selectedThumbnail
              ]}
            >
              <Image 
                source={{ uri: image }} 
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Typography variant="h2">{exhibit.name}</Typography>
          
          <View style={styles.categoryBadge}>
            <Typography variant="caption" color="white">
              {exhibit.category}
            </Typography>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Typography variant="body" color="secondary">
            {exhibit.era}
          </Typography>
          <Typography variant="body">
            Location: {exhibit.location}
          </Typography>
        </View>

        <Typography variant="body" style={styles.description}>
          {exhibit.longDescription || exhibit.description}
        </Typography>

        <View style={styles.actionButtons}>
          <Button
            title="Add to Tour"
            onPress={handleAddToTour}
            style={styles.actionButton}
          />
          
          <Button
            title="Navigate to Exhibit"
            variant="secondary"
            onPress={handleNavigateToExhibit}
            style={styles.actionButton}
          />
        </View>

        {exhibit.reviews && exhibit.reviews.length > 0 && (
          <View style={styles.reviewsSection}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Visitor Reviews
            </Typography>

            {exhibit.reviews.map(review => (
              <Card key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Typography variant="body" style={styles.reviewUser}>
                    {review.user}
                  </Typography>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Typography 
                        key={star}
                        variant="body"
                        color={star <= review.rating ? "gold" : "light"}
                      >
                        ★
                      </Typography>
                    ))}
                  </View>
                </View>
                <Typography variant="body">{review.comment}</Typography>
              </Card>
            ))}

            <Button
              title="Write a Review"
              variant="outline"
              onPress={() => router.push(`/exhibits/review?id=${id}`)}
              style={styles.reviewButton}
            />
          </View>
        )}

        {exhibit.relatedExhibits && exhibit.relatedExhibits.length > 0 && (
          <View style={styles.relatedSection}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Related Exhibits
            </Typography>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.relatedContainer}
            >
              {exhibit.relatedExhibits.map(relatedId => {
                const relatedExhibit = mockExhibits[relatedId];
                if (!relatedExhibit) return null;
                
                return (
                  <TouchableOpacity 
                    key={relatedId}
                    style={styles.relatedExhibit}
                    onPress={() => router.push(`/exhibits/${relatedId}`)}
                  >
                    <Image 
                      source={{ uri: relatedExhibit.imageUrl }} 
                      style={styles.relatedImage}
                      resizeMode="cover"
                    />
                    <Typography variant="body" numberOfLines={2} style={styles.relatedName}>
                      {relatedExhibit.name}
                    </Typography>
                    <Typography variant="caption" color="light">
                      {relatedExhibit.category}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  backButton: {
    marginTop: SIZES.lg,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  favoriteButton: {
    position: 'absolute',
    top: SIZES.md,
    right: SIZES.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailContainer: {
    padding: SIZES.md,
    backgroundColor: COLORS.background,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: SIZES.sm,
    borderRadius: SIZES.borderRadius,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  selectedThumbnail: {
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  categoryBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.borderRadius,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  description: {
    lineHeight: 24,
    marginBottom: SIZES.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SIZES.xs,
  },
  sectionTitle: {
    marginBottom: SIZES.md,
  },
  reviewsSection: {
    marginTop: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  reviewCard: {
    marginBottom: SIZES.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xs,
  },
  reviewUser: {
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewButton: {
    marginTop: SIZES.sm,
  },
  relatedSection: {
    marginBottom: SIZES.xl,
  },
  relatedContainer: {
    flexDirection: 'row',
  },
  relatedExhibit: {
    width: 150,
    marginRight: SIZES.md,
  },
  relatedImage: {
    width: 150,
    height: 100,
    borderRadius: SIZES.borderRadius,
    marginBottom: SIZES.xs,
  },
  relatedName: {
    marginBottom: SIZES.xs,
  },
});