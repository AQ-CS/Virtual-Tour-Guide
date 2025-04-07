// components/ui/Card.js

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const Card = ({ 
  children, 
  onPress, 
  style, 
  elevation = 'small', // small, medium, large, none
  outlined = false,
  padded = true,
}) => {
  
  const getShadow = () => {
    if (elevation === 'none') return {};
    return SHADOWS[elevation] || SHADOWS.small;
  };
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container
      style={[
        styles.card,
        padded && styles.padded,
        getShadow(),
        outlined && styles.outlined,
        style
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
  },
  padded: {
    padding: SIZES.cardPadding,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default Card;