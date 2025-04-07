// app/index.js

import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../constants/theme';

import Button from '../components/ui/Button';
import Typography from '../components/ui/Typography';
import Card from '../components/ui/Card';

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/museum-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Typography variant="h1" style={styles.title}>
          UAE Museum Virtual Tour Guide
        </Typography>
        <Typography variant="body" style={styles.subtitle}>
          Explore the rich cultural heritage and iconic exhibits of the UAE through an immersive digital experience
        </Typography>
      </View>

      <View style={styles.actions}>
        <Button 
          title="Sign In" 
          onPress={() => router.push('/auth/login')}
          style={styles.button}
        />
        <Button 
          title="Register" 
          variant="outline"
          onPress={() => router.push('/auth/register')}
          style={styles.button}
        />
      </View>

      <View style={styles.featuresContainer}>
        <Typography variant="h2" style={styles.sectionTitle}>
          Key Features
        </Typography>

        <View style={styles.features}>
          <Card style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: `${COLORS.primary}20` }]}>
              <Typography variant="h2" color="primary">🗺️</Typography>
            </View>
            <Typography variant="h3" style={styles.featureTitle}>
              Custom Tours
            </Typography>
            <Typography variant="body">
              Create and customize your museum experience with personalized tours
            </Typography>
          </Card>

          <Card style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: `${COLORS.secondary}20` }]}>
              <Typography variant="h2" color="secondary">🤖</Typography>
            </View>
            <Typography variant="h3" style={styles.featureTitle}>
              Smart Guide
            </Typography>
            <Typography variant="body">
              Get instant information about exhibits from our AI-powered assistant
            </Typography>
          </Card>

          <Card style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: `${COLORS.teal}20` }]}>
              <Typography variant="h2" color="teal">🏛️</Typography>
            </View>
            <Typography variant="h3" style={styles.featureTitle}>
              3D Navigation
            </Typography>
            <Typography variant="body">
              Navigate the museum with interactive 3D maps and directions
            </Typography>
          </Card>

          <Card style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: `${COLORS.gold}20` }]}>
              <Typography variant="h2" color="gold">👥</Typography>
            </View>
            <Typography variant="h3" style={styles.featureTitle}>
              Crowd Monitor
            </Typography>
            <Typography variant="body">
              Check current museum crowds to plan the perfect visit time
            </Typography>
          </Card>
        </View>
      </View>

      <View style={styles.exploreSection}>
        <Typography variant="h2" style={styles.sectionTitle}>
          Explore As Guest
        </Typography>
        <Typography variant="body" style={styles.exploreParagraph}>
          Want to take a quick look? Explore our museum's highlights without signing in.
        </Typography>
        <Button 
          title="Browse Exhibits" 
          variant="secondary"
          onPress={() => router.push('/exhibits')}
          style={styles.exploreButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: SIZES.lg,
    paddingTop: SIZES.xl * 2,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SIZES.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: SIZES.lg,
    color: COLORS.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: SIZES.lg,
  },
  button: {
    minWidth: 140,
    marginHorizontal: SIZES.sm,
  },
  featuresContainer: {
    padding: SIZES.lg,
  },
  sectionTitle: {
    marginBottom: SIZES.lg,
    textAlign: 'center',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    marginBottom: SIZES.md,
    alignItems: 'center',
    padding: SIZES.md,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  featureTitle: {
    textAlign: 'center',
    marginBottom: SIZES.xs,
  },
  exploreSection: {
    padding: SIZES.lg,
    marginTop: SIZES.md,
    marginBottom: SIZES.xl * 2,
    alignItems: 'center',
  },
  exploreParagraph: {
    textAlign: 'center',
    marginBottom: SIZES.lg,
    paddingHorizontal: SIZES.lg,
  },
  exploreButton: {
    minWidth: 200,
  },
});