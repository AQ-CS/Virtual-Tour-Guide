// src/components/ProfileAvatar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileAvatar = ({ user, size = 50, textSize = 18, style }) => {
  // Default values if user or profileImage is missing
  const defaultBgColor = '#8C52FF';
  const defaultInitials = 'U';
  
  // Handle different user data structures gracefully
  let initials = defaultInitials;
  let backgroundColor = defaultBgColor;
  
  if (user) {
    if (user.profileImage) {
      // New format with profileImage object
      initials = user.profileImage.initials || defaultInitials;
      backgroundColor = user.profileImage.backgroundColor || defaultBgColor;
    } else if (user.name) {
      // Generate initials from name for users that don't have profileImage yet
      const names = user.name.split(' ');
      if (names.length === 1) {
        initials = names[0].substring(0, 2).toUpperCase();
      } else {
        initials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
    }
  }
  
  return (
    <View 
      style={[
        styles.avatarContainer, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: backgroundColor
        },
        style
      ]}
    >
      <Text style={[styles.initialsText, { fontSize: textSize }]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    // Elevation for Android
    elevation: 2,
  },
  initialsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});

export default ProfileAvatar;