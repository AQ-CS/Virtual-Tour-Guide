// app/navigation/index.js

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

import Typography from '../../components/ui/Typography';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ThreeDScene from '../../components/navigation/ThreeDScene';

// Mock data for demonstration purposes
const popularDestinations = [
  { id: 'exhibit1', name: 'Ancient Artifacts Gallery' },
  { id: 'exhibit2', name: 'Modern Art Wing' },
  { id: 'exhibit3', name: 'Interactive Displays' },
  { id: 'cafeteria', name: 'Museum Cafeteria' },
  { id: 'giftshop', name: 'Gift Shop' },
  { id: 'restrooms', name: 'Restrooms' },
];

export default function Navigation() {
  const [targetExhibit, setTargetExhibit] = useState(null);
  const [navigationActive, setNavigationActive] = useState(false);
  
  const handleNavigateTo = (destinationId) => {
    setTargetExhibit(destinationId);
    setNavigationActive(true);
  };
  
  const handleExhibitReached = (exhibitId) => {
    // In a real app, you might show more information about the reached exhibit
    console.log(`Reached exhibit: ${exhibitId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">3D Museum Navigation</Typography>
      </View>
      
      <View style={styles.mapContainer}>
        <ThreeDScene
          targetExhibit={targetExhibit}
          onExhibitReached={handleExhibitReached}
        />
      </View>
      
      {!navigationActive ? (
        <ScrollView style={styles.destinationsContainer}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Popular Destinations
          </Typography>
          
          <View style={styles.destinationsList}>
            {popularDestinations.map((destination) => (
              <Card
                key={destination.id}
                style={styles.destinationCard}
                onPress={() => handleNavigateTo(destination.id)}
              >
                <Typography variant="body">{destination.name}</Typography>
              </Card>
            ))}
          </View>
          
          <Typography variant="h3" style={styles.sectionTitle}>
            Need Help?
          </Typography>
          
          <Card style={styles.helpCard}>
            <Typography variant="body" style={styles.helpText}>
              If you're having trouble finding your way, our smart agent can provide personalized assistance.
            </Typography>
            <Button
              title="Chat with Smart Guide"
              variant="secondary"
              onPress={() => {
                // Navigate to smart agent
                router.push('/smart-agent');
              }}
              style={styles.helpButton}
            />
          </Card>
        </ScrollView>
      ) : (
        <View style={styles.navigationActiveContainer}>
          <Typography variant="body" style={styles.navigationText}>
            Following route to selected destination...
          </Typography>
          <Button
            title="Cancel Navigation"
            variant="outline"
            onPress={() => {
              setNavigationActive(false);
              setTargetExhibit(null);
            }}
            style={styles.cancelButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.md,
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    minHeight: 300,
  },
  destinationsContainer: {
    padding: SIZES.md,
  },
  sectionTitle: {
    marginVertical: SIZES.md,
  },
  destinationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: '48%',
    marginBottom: SIZES.sm,
    padding: SIZES.md,
    alignItems: 'center',
  },
  helpCard: {
    marginVertical: SIZES.md,
    padding: SIZES.lg,
    alignItems: 'center',
  },
  helpText: {
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  helpButton: {
    minWidth: 200,
  },
  navigationActiveContainer: {
    padding: SIZES.lg,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  navigationText: {
    marginBottom: SIZES.md,
  },
  cancelButton: {
    minWidth: 200,
  },
});