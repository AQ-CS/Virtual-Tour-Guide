// File: src/screens/CrowdScreen.js - Crowd monitoring

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const CrowdScreen = () => {
  const [crowdData, setCrowdData] = useState({
    totalVisitors: 248,
    floors: [
      { id: 1, count: 113, status: 'busy' },
      { id: 2, count: 82, status: 'moderate' },
      { id: 3, count: 53, status: 'light' }
    ],
    exhibits: [
      { id: '1', name: 'Pearl Diving Heritage', count: 32, status: 'busy' },
      { id: '2', name: 'Islamic Golden Age Innovations', count: 41, status: 'busy' },
      { id: '5', name: 'Calligraphy Through Centuries', count: 28, status: 'moderate' },
      { id: '3', name: 'Desert Life Adaptation', count: 19, status: 'light' },
      { id: '4', name: 'Modern UAE Architecture', count: 22, status: 'moderate' }
    ],
    timeOfDay: [
      { hour: '9AM', visitors: 42 },
      { hour: '10AM', visitors: 87 },
      { hour: '11AM', visitors: 134 },
      { hour: '12PM', visitors: 186 },
      { hour: '1PM', visitors: 248 },
      { hour: '2PM', visitors: 215 },
      { hour: '3PM', visitors: 187 },
      { hour: '4PM', visitors: 156 },
      { hour: '5PM', visitors: 120 },
      { hour: '6PM', visitors: 85 }
    ],
    lastUpdated: new Date()
  });
  
  const [selectedView, setSelectedView] = useState('overview');
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random fluctuation in crowd data
      const newTotalVisitors = crowdData.totalVisitors + Math.floor(Math.random() * 10) - 5;
      
      // Update floor counts
      const newFloors = crowdData.floors.map(floor => {
        const variation = Math.floor(Math.random() * 6) - 3;
        const newCount = Math.max(0, floor.count + variation);
        let status = 'light';
        if (newCount > 100) status = 'busy';
        else if (newCount > 60) status = 'moderate';
        
        return { ...floor, count: newCount, status };
      });
      
      // Update exhibit counts
      const newExhibits = crowdData.exhibits.map(exhibit => {
        const variation = Math.floor(Math.random() * 4) - 2;
        const newCount = Math.max(0, exhibit.count + variation);
        let status = 'light';
        if (newCount > 30) status = 'busy';
        else if (newCount > 20) status = 'moderate';
        
        return { ...exhibit, count: newCount, status };
      });
      
      setCrowdData({
        ...crowdData,
        totalVisitors: newTotalVisitors,
        floors: newFloors,
        exhibits: newExhibits,
        lastUpdated: new Date()
      });
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [crowdData]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'busy': return '#f44336';
      case 'moderate': return '#ff9800';
      case 'light': return '#4caf50';
      default: return '#8C52FF';
    }
  };
  
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    return `${Math.floor(seconds / 3600)} hours ago`;
  };
  
  return (
    <View style={styles.container}>
      <AppHeader title="Crowd Monitoring" />
      
      <ScrollView style={styles.content}>
        {/* Overview Section */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryTitle}>Current Visitors</Text>
              <Text style={styles.visitorCount}>{crowdData.totalVisitors}</Text>
              <Text style={styles.lastUpdated}>
                Updated {formatTimeAgo(crowdData.lastUpdated)}
              </Text>
            </View>
            <View style={styles.crowdIcon}>
              <Ionicons name="people" size={48} color="#8C52FF" />
            </View>
          </View>
        </View>
        
        {/* View Selector */}
        <View style={styles.viewSelector}>
          <TouchableOpacity
            style={[
              styles.viewTab,
              selectedView === 'overview' && styles.activeViewTab
            ]}
            onPress={() => setSelectedView('overview')}
          >
            <Text style={[
              styles.viewTabText,
              selectedView === 'overview' && styles.activeViewTabText
            ]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewTab,
              selectedView === 'byFloor' && styles.activeViewTab
            ]}
            onPress={() => setSelectedView('byFloor')}
          >
            <Text style={[
              styles.viewTabText,
              selectedView === 'byFloor' && styles.activeViewTabText
            ]}>
              By Floor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewTab,
              selectedView === 'byExhibit' && styles.activeViewTab
            ]}
            onPress={() => setSelectedView('byExhibit')}
          >
            <Text style={[
              styles.viewTabText,
              selectedView === 'byExhibit' && styles.activeViewTabText
            ]}>
              By Exhibit
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Overview View */}
        {selectedView === 'overview' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Crowd Heatmap</Text>
            <Image 
              source={require('../../assets/images/heatmap.jpg')}
              style={styles.heatmapImage}
              resizeMode="contain"
            />
            
            <Text style={styles.sectionTitle}>Today's Visitor Count</Text>
            <View style={styles.chartContainer}>
              {crowdData.timeOfDay.map((item, index) => (
                <View key={index} style={styles.chartBarContainer}>
                  <View 
                    style={[
                      styles.chartBar, 
                      { height: (item.visitors / 250) * 150 }
                    ]}
                  />
                  <Text style={styles.chartLabel}>{item.hour}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* By Floor View */}
        {selectedView === 'byFloor' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Visitors by Floor</Text>
            
            {crowdData.floors.map(floor => (
              <View key={floor.id} style={styles.floorCard}>
                <View style={styles.floorHeader}>
                  <Text style={styles.floorTitle}>Floor {floor.id}</Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(floor.status) }
                  ]}>
                    <Text style={styles.statusText}>{floor.status}</Text>
                  </View>
                </View>
                
                <View style={styles.floorDetails}>
                  <View style={styles.visitorCountCircle}>
                    <Text style={styles.visitorCountText}>{floor.count}</Text>
                  </View>
                  <View style={styles.floorInfoText}>
                    <Text style={styles.floorInfoLabel}>Visitors</Text>
                    <Text style={styles.crowdAdvice}>
                      {floor.status === 'busy' 
                        ? 'Consider visiting this floor later' 
                        : floor.status === 'moderate' 
                          ? 'Moderately crowded' 
                          : 'Good time to visit now'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* By Exhibit View */}
        {selectedView === 'byExhibit' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Visitors by Exhibit</Text>
            
            {crowdData.exhibits.map(exhibit => (
              <View key={exhibit.id} style={styles.exhibitCrowdCard}>
                <Text style={styles.exhibitCrowdName}>{exhibit.name}</Text>
                <View style={styles.exhibitCrowdDetails}>
                  <Text style={styles.exhibitCrowdCount}>{exhibit.count} visitors</Text>
                  <View style={[
                    styles.statusIndicator, 
                    { backgroundColor: getStatusColor(exhibit.status) }
                  ]} />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  visitorCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888',
  },
  crowdIcon: {
    backgroundColor: 'rgba(140, 82, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  viewTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeViewTab: {
    backgroundColor: '#8C52FF',
  },
  viewTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeViewTabText: {
    color: '#fff',
  },
  sectionContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  heatmapImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 24,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  chartBarContainer: {
    alignItems: 'center',
    width: '8%',
  },
  chartBar: {
    width: '100%',
    backgroundColor: '#8C52FF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  floorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  floorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  floorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  floorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitorCountCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(140, 82, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  visitorCountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8C52FF',
  },
  floorInfoText: {
    flex: 1,
  },
  floorInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  crowdAdvice: {
    fontSize: 14,
    color: '#333',
  },
  exhibitCrowdCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  exhibitCrowdName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  exhibitCrowdDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exhibitCrowdCount: {
    fontSize: 14,
    color: '#666',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default CrowdScreen;