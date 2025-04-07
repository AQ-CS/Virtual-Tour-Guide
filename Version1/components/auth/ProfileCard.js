// components/auth/ProfileCard.js

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

import Card from '../ui/Card';
import Typography from '../ui/Typography';
import Button from '../ui/Button';

const ProfileCard = ({
  user,
  onEditProfile,
}) => {
  return (
    <Card style={styles.card} elevation="medium">
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Typography variant="h2" color="white">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
              </Typography>
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Typography variant="h3">{user?.name || 'Museum Visitor'}</Typography>
          <Typography variant="caption">{user?.email || ''}</Typography>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Typography variant="h3" align="center">{user?.completedTours || 0}</Typography>
          <Typography variant="caption" align="center">Tours</Typography>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Typography variant="h3" align="center">{user?.favoriteExhibits?.length || 0}</Typography>
          <Typography variant="caption" align="center">Favorites</Typography>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Typography variant="h3" align="center">{user?.reviewsLeft || 0}</Typography>
          <Typography variant="caption" align="center">Reviews</Typography>
        </View>
      </View>
      
      <Button 
        title="Edit Profile" 
        variant="outline"
        onPress={onEditProfile} 
        style={styles.editButton}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  avatarContainer: {
    marginRight: SIZES.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SIZES.lg,
  },
  statItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.divider,
  },
  editButton: {
    marginTop: SIZES.xs,
  }
});

export default ProfileCard;