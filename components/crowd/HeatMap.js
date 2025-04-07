// components/crowd/HeatMap.js

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import Typography from '../ui/Typography';

const HeatMap = ({
  crowdData = []  // Array of objects with x, y, count properties
}) => {
  // For a real app, you would use canvas or a specialized library
  // This is a simplified version using React Native Views
  
  const maxDensity = Math.max(...crowdData.map(point => point.count), 1);
  
  // Get color based on density (red for high, green for low)
  const getDensityColor = (density) => {
    const normalizedDensity = density / maxDensity;
    
    // RGB values for gradient from green to yellow to red
    const r = Math.min(255, Math.round(normalizedDensity * 255));
    const g = Math.min(255, Math.round(255 - (normalizedDensity * 155)));
    const b = 0;
    
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };
  
  // Return appropriate size based on density
  const getDensitySize = (density) => {
    const normalizedDensity = density / maxDensity;
    return Math.max(20, Math.round(normalizedDensity * 50));
  };
  
  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.title}>
        Current Museum Crowd
      </Typography>
      
      <View style={styles.mapContainer}>
        {/* Museum floor plan background would go here */}
        <View style={styles.floorPlan}>
          {/* Example room outlines */}
          <View style={styles.room1} />
          <View style={styles.room2} />
          <View style={styles.room3} />
          <View style={styles.corridor} />
          
          {/* Render density points */}
          {crowdData.map((point, index) => (
            <View
              key={index}
              style={[
                styles.densityPoint,
                {
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  backgroundColor: getDensityColor(point.count),
                  width: getDensitySize(point.count),
                  height: getDensitySize(point.count),
                  borderRadius: getDensitySize(point.count) / 2,
                }
              ]}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: getDensityColor(1) }]} />
          <Typography variant="caption">Low Density</Typography>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: getDensityColor(maxDensity / 2) }]} />
          <Typography variant="caption">Medium Density</Typography>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: getDensityColor(maxDensity) }]} />
          <Typography variant="caption">High Density</Typography>
        </View>
      </View>
      
      <Typography variant="caption" align="center" style={styles.lastUpdated}>
        Last updated: Just now
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.md,
  },
  title: {
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  mapContainer: {
    height: 300,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  floorPlan: {
    flex: 1,
    position: 'relative',
  },
  // Example room layouts (would be more detailed in a real app)
  room1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '35%',
    height: '35%',
    borderWidth: 1,
    borderColor: COLORS.text,
    backgroundColor: 'rgba(240, 240, 240, 0.5)',
  },
  room2: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: '35%',
    height: '35%',
    borderWidth: 1,
    borderColor: COLORS.text,
    backgroundColor: 'rgba(240, 240, 240, 0.5)',
  },
  room3: {
    position: 'absolute',
    bottom: '10%',
    left: '25%',
    width: '50%',
    height: '35%',
    borderWidth: 1,
    borderColor: COLORS.text,
    backgroundColor: 'rgba(240, 240, 240, 0.5)',
  },
  corridor: {
    position: 'absolute',
    top: '45%',
    left: '25%',
    width: '50%',
    height: '10%',
    borderWidth: 1,
    borderColor: COLORS.text,
    backgroundColor: 'rgba(240, 240, 240, 0.5)',
  },
  densityPoint: {
    position: 'absolute',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.md,
    padding: SIZES.sm,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SIZES.xs,
  },
  lastUpdated: {
    marginTop: SIZES.md,
  },
});

export default HeatMap;