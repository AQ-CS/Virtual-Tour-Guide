// app/exhibits/review.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants/theme';

import Typography from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ExhibitReview() {
  const { id } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRatingSelect = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    
    // Simulate API call to submit review
    setTimeout(() => {
      setLoading(false);
      router.back();
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">Rate Exhibit</Typography>
        <Typography variant="body" style={styles.subtitle}>
          Share your thoughts about this exhibit
        </Typography>
      </View>
      
      <View style={styles.ratingContainer}>
        <Typography variant="body" style={styles.ratingLabel}>
          How would you rate this exhibit?
        </Typography>
        
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              title={star.toString()}
              variant={rating >= star ? 'primary' : 'outline'}
              size="small"
              onPress={() => handleRatingSelect(star)}
              style={styles.starButton}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.commentContainer}>
        <Typography variant="body" style={styles.commentLabel}>
          Your comments (optional)
        </Typography>
        
        <Input
          placeholder="Share your experience..."
          value={comment}
          onChangeText={setComment}
          multiline
          inputStyle={styles.commentInput}
        />
      </View>
      
      <View style={styles.actions}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => router.back()}
          style={styles.cancelButton}
        />
        
        <Button
          title="Submit Review"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  subtitle: {
    marginTop: SIZES.xs,
    color: COLORS.textSecondary,
  },
  ratingContainer: {
    marginBottom: SIZES.xl,
  },
  ratingLabel: {
    marginBottom: SIZES.md,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  starButton: {
    width: 50,
  },
  commentContainer: {
    marginBottom: SIZES.xl,
  },
  commentLabel: {
    marginBottom: SIZES.sm,
  },
  commentInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xl,
  },
  cancelButton: {
    flex: 1,
    marginRight: SIZES.md,
  },
  submitButton: {
    flex: 2,
  },
});