// app/navigation/map.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import ThreeDScene from '../../components/navigation/ThreeDScene';
import Typography from '../../components/ui/Typography';

export default function Map() {
  const { targetId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ThreeDScene targetExhibit={targetId} />
      <View style={styles.instructions}>
        <Typography variant="body" align="center">
          Use pinch gestures to zoom, drag to rotate, and two fingers to pan around the map.
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instructions: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});