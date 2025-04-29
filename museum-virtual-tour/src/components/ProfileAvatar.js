// src/components/ProfileAvatar.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileAvatar = ({ user, size = 50, textSize = 18, style }) => {
  // Default values if user or profileImage is missing
  const defaultBgColor = '#8C52FF';
  const defaultInitials = 'U';
  
  // Handle different user data structures gracefully
  let initials = defaultInitials;
  let backgroundColor = defaultBgColor;
  let profileImageURI = null;
  
  if (user) {
    // Check if there's a profile image URI first
    profileImageURI = user.profileImageURI || null;
    
    // If no URI or we should use initials, set up initials display
    if (!profileImageURI && user.profileImage) {
      // Use the profileImage object if present
      initials = user.profileImage.initials || defaultInitials;
      backgroundColor = user.profileImage.backgroundColor || defaultBgColor;
      
      // If profileImage has a useInitials flag and it's false, don't display initials
      if (user.profileImage.useInitials === false && !profileImageURI) {
        // This is a safety check in case the URI was lost but the flag persists
        initials = defaultInitials;
      }
    } else if (!profileImageURI && user.name) {
      // Generate initials from name for users that don't have profileImage yet
      const names = user.name.split(' ');
      if (names.length === 1) {
        initials = names[0].substring(0, 2).toUpperCase();
      } else {
        initials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
    }
  }
  
  // If we have a profile image URI, render the image
  if (profileImageURI) {
    return (
      <View 
        style={[
          styles.avatarContainer, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
          },
          style
        ]}
      >
        <Image 
          source={{ uri: profileImageURI }} 
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      </View>
    );
  }
  
  // Otherwise render the initials
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