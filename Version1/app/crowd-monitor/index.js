// app/crowd-monitor/index.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

import Typography from '../../components/ui/Typography';
import Card from '../../components/ui/Card';
import HeatMap from '../../components/crowd/HeatMap';

// Mock data for demonstration
const mockCrowdData = [
  { x: 25, y: 30, count: 12 },  // Main entrance
  { x: 40, y: 25, count: 18 },  // Popular exhibit 1
  { x: 70, y: 30, count: 24 },  // Popular exhibit 2
  { x: 30, y: 60, count: 8 },   // Less crowded area
  { x: 60, y: 70, count: 15 },  // Cafe area
  { x: 80, y: 50, count: 5 },   // Quiet exhibit
];

// Mock data for busy times
const busyTimesByDay = [
  { day: 'Monday', busy: ['11:00 AM - 1:00 PM'], quiet: ['9:00 AM - 10:30 AM', '3:00 PM - 5:00 PM'] },
  { day: 'Tuesday', busy: ['11:00 AM - 1:00 PM'], quiet: ['9:00 AM - 10:30 AM', '3:00 PM - 5:00 PM'] },
  { day: 'Wednesday', busy: ['11:00 AM - 1:00 PM', '4:00 PM - 6:00 PM'], quiet: ['9:00 AM - 10:30 AM'] },
  { day: 'Thursday', busy: ['11:00 AM - 1:00 PM', '4:00 PM - 6:00 PM'], quiet: ['9:00 AM - 10:30 AM'] },
  { day: 'Friday', busy: ['12:00 PM - 4:00 PM'], quiet: ['10:00 AM - 11:30 AM', '5:00 PM - 8:00 PM'] },
  { day: 'Saturday', busy: ['12:00 PM - 5:00 PM'], quiet: ['10:00 AM - 11:30 AM', '6:00 PM - 9:00 PM'] },
  { day: 'Sunday', busy: ['2:00 PM - 5:00 PM'], quiet: ['10:00 AM - 1:00 PM', '6:00 PM - 8:00 PM'] },
];

export default function CrowdMonitor() {
  const [crowdData, setCrowdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVisitors, setCurrentVisitors] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(300);
  
  useEffect(() => {
    // Simulate API call to fetch current crowd data
    setTimeout(() => {
      setCrowdData(mockCrowdData);
      setCurrentVisitors(87); // Random number for demonstration
      setLoading(false);
    }, 1000);
    
    // In a real app, you might set up a periodic refresh here
  }, []);
  
  // Get current day of week
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // Find busy times for current day
  const todaysBusyTimes = busyTimesByDay.find(day => day.day === currentDay) || busyTimesByDay[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">Museum Crowd Monitor</Typography>
        <Typography variant="body" style={styles.subtitle}>
          Plan your visit by checking current crowd levels
        </Typography>
      </View>
      
      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Typography variant="h3" align="center">{currentVisitors}</Typography>
            <Typography variant="caption" align="center">Current Visitors</Typography>
          </View>
          
          <View style={styles.verticalDivider} />
          
          <View style={styles.statItem}>
            <Typography variant="h3" align="center">{Math.round((currentVisitors / maxCapacity) * 100)}%</Typography>
            <Typography variant="caption" align="center">Capacity</Typography>
          </View>
          
          <View style={styles.verticalDivider} />
          
          <View style={styles.statItem}>
            <Typography variant="h3" align="center">{maxCapacity}</Typography>
            <Typography variant="caption" align="center">Maximum Capacity</Typography>
          </View>
        </View>
        
        <View style={styles.crowdLevelContainer}>
          <Typography variant="caption">Current Crowd Level:</Typography>
          <View style={styles.crowdLevelBar}>
            <View 
              style={[
                styles.crowdLevelFill, 
                { width: `${(currentVisitors / maxCapacity) * 100}%` },
                (currentVisitors / maxCapacity) < 0.3 ? styles.levelLow :
                (currentVisitors / maxCapacity) < 0.7 ? styles.levelMedium :
                styles.levelHigh
              ]} 
            />
          </View>
        </View>
      </Card>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Typography>Loading crowd data...</Typography>
        </View>
      ) : (
        <HeatMap crowdData={crowdData} />
      )}
      
      <Card style={styles.busyTimesCard}>
        <Typography variant="h3" style={styles.cardTitle}>
          Today's Expected Crowd Patterns
        </Typography>
        
        <View style={styles.timeSection}>
          <Typography variant="body" style={styles.timesLabel}>
            Busiest Times:
          </Typography>
          <View style={styles.timesList}>
            {todaysBusyTimes.busy.map((time, index) => (
              <View key={`busy-${index}`} style={[styles.timeChip, styles.busyChip]}>
                <Typography variant="caption" color="error">{time}</Typography>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.timeSection}>
          <Typography variant="body" style={styles.timesLabel}>
            Quietest Times:
          </Typography>
          <View style={styles.timesList}>
            {todaysBusyTimes.quiet.map((time, index) => (
              <View key={`quiet-${index}`} style={[styles.timeChip, styles.quietChip]}>
                <Typography variant="caption" color="success">{time}</Typography>
              </View>
            ))}
          </View>
        </View>
      </Card>
      
      <Typography variant="caption" style={styles.disclaimer}>
        Note: Crowd data is updated every 5 minutes. Predictions are based on historical patterns.
      </Typography>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  statsCard: {
    marginBottom: SIZES.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: COLORS.divider,
  },
  crowdLevelContainer: {
    marginTop: SIZES.sm,
    paddingTop: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  crowdLevelBar: {
    height: 12,
    backgroundColor: COLORS.divider,
    borderRadius: 6,
    marginTop: SIZES.xs,
    overflow: 'hidden',
  },
  crowdLevelFill: {
    height: '100%',
  },
  levelLow: {
    backgroundColor: COLORS.success,
  },
  levelMedium: {
    backgroundColor: COLORS.warning,
  },
  levelHigh: {
    backgroundColor: COLORS.error,
  },
  loadingContainer: {
    padding: SIZES.lg,
    alignItems: 'center',
  },
  busyTimesCard: {
    marginTop: SIZES.lg,
  },
  cardTitle: {
    marginBottom: SIZES.md,
  },
  timeSection: {
    marginBottom: SIZES.md,
  },
  timesLabel: {
    marginBottom: SIZES.xs,
  },
  timesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeChip: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.borderRadius,
    marginRight: SIZES.xs,
    marginBottom: SIZES.xs,
  },
  busyChip: {
    backgroundColor: `${COLORS.error}20`,
  },
  quietChip: {
    backgroundColor: `${COLORS.success}20`,
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: SIZES.lg,
    marginBottom: SIZES.xl,
    color: COLORS.textLight,
  },
});