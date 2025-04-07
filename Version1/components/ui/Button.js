// components/ui/Button.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', // primary, secondary, outline, text
  size = 'medium',     // small, medium, large
  disabled = false,
  loading = false,
  icon = null,
  style = {},
  textStyle = {}
}) => {
  
  // Define styles based on variant and size
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: COLORS.primary,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SIZES.xs,
          paddingHorizontal: SIZES.md,
          minHeight: SIZES.buttonHeight - 16,
        };
      case 'large':
        return {
          paddingVertical: SIZES.md,
          paddingHorizontal: SIZES.xl,
          minHeight: SIZES.buttonHeight + 8,
        };
      default:
        return {
          paddingVertical: SIZES.sm,
          paddingHorizontal: SIZES.lg,
          minHeight: SIZES.buttonHeight,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.textLight;
    
    switch (variant) {
      case 'outline':
      case 'text':
        return COLORS.primary;
      default:
        return COLORS.background;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={getTextColor()} 
          size="small" 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[
            styles.text,
            { color: getTextColor() },
            size === 'small' && { fontSize: SIZES.sm },
            size === 'large' && { fontSize: SIZES.lg },
            textStyle
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.borderRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  text: {
    fontSize: SIZES.md,
    fontWeight: '500',
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;