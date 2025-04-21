// File: src/screens/CrowdScreen.js - Crowd monitoring with enhanced interactive chart

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../components/AppHeader';

const CrowdScreen = () => {
  const [crowdData, setCrowdData] = useState({
    totalVisitors: 248,
    floors: [
      { id: 1, count: 143, status: 'busy' },
      { id: 2, count: 105, status: 'moderate' }
    ],
    exhibits: [
      { id: '1', name: 'Pearl Diving Heritage', count: 45, status: 'busy' },
      { id: '3', name: 'Desert Life Adaptation', count: 25, status: 'moderate' },
      { id: '4', name: 'Modern UAE Architecture', count: 32, status: 'moderate' },
      { id: '2', name: 'Islamic Golden Age Innovations', count: 48, status: 'busy' },
      { id: '5', name: 'Calligraphy Through Centuries', count: 34, status: 'moderate' }
    ],
    timeOfDay: [
      { hour: '9AM', visitors: 42, status: 'light' },
      { hour: '10AM', visitors: 87, status: 'moderate' },
      { hour: '11AM', visitors: 134, status: 'moderate' },
      { hour: '12PM', visitors: 186, status: 'busy' },
      { hour: '1PM', visitors: 248, status: 'busy' },
      { hour: '2PM', visitors: 215, status: 'busy' },
      { hour: '3PM', visitors: 187, status: 'busy' },
      { hour: '4PM', visitors: 156, status: 'moderate' },
      { hour: '5PM', visitors: 120, status: 'moderate' },
      { hour: '6PM', visitors: 85, status: 'moderate' }
    ],
    lastUpdated: new Date()
  });
  
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  
  // Determine status based on visitor count
  useEffect(() => {
    const updatedTimeOfDay = crowdData.timeOfDay.map(slot => {
      let status = 'light';
      if (slot.visitors > 175) status = 'busy';
      else if (slot.visitors > 100) status = 'moderate';
      return { ...slot, status };
    });
    
    setCrowdData(prev => ({
      ...prev,
      timeOfDay: updatedTimeOfDay
    }));
  }, []);
  
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
        if (newCount > 120) status = 'busy';
        else if (newCount > 80) status = 'moderate';
        
        return { ...floor, count: newCount, status };
      });
      
      // Update exhibit counts
      const newExhibits = crowdData.exhibits.map(exhibit => {
        const variation = Math.floor(Math.random() * 4) - 2;
        const newCount = Math.max(0, exhibit.count + variation);
        let status = 'light';
        if (newCount > 35) status = 'busy';
        else if (newCount > 25) status = 'moderate';
        
        return { ...exhibit, count: newCount, status };
      });
      
      // Update time of day data
      const newTimeOfDay = crowdData.timeOfDay.map(slot => {
        const variation = Math.floor(Math.random() * 8) - 4;
        const newVisitors = Math.max(0, slot.visitors + variation);
        let status = 'light';
        if (newVisitors > 175) status = 'busy';
        else if (newVisitors > 100) status = 'moderate';
        
        return { ...slot, visitors: newVisitors, status };
      });
      
      setCrowdData({
        ...crowdData,
        totalVisitors: newTotalVisitors,
        floors: newFloors,
        exhibits: newExhibits,
        timeOfDay: newTimeOfDay,
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
  
  const handleBarPress = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setTimeModalVisible(true);
  };
  
  return (
    <View style={styles.container}>
      {/* Purple-white gradient background */}
      <LinearGradient
        colors={['#8C52FF', '#A67FFB', '#F0EBFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />
      
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
            <Text style={styles.infoMessage}>
              View the crowd heatmap in the Navigation screen for a visual representation of crowded areas.
            </Text>
            
            <Text style={styles.sectionTitle}>Today's Visitor Count</Text>
            <View style={styles.chartContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartContent}>
                {crowdData.timeOfDay.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.chartBarContainer}
                    onPress={() => handleBarPress(item)}
                    activeOpacity={0.7}
                  >
                    <View 
                      style={[
                        styles.chartBar, 
                        { 
                          height: (item.visitors / 250) * 150,
                          backgroundColor: getStatusColor(item.status)
                        }
                      ]}
                    />
                    <Text style={styles.chartLabel}>{item.hour}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.crowdLegend}>
              <Text style={styles.legendTitle}>Crowd Level Legend:</Text>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, {backgroundColor: '#4caf50'}]} />
                <Text style={styles.legendText}>Light (Good time to visit)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, {backgroundColor: '#ff9800'}]} />
                <Text style={styles.legendText}>Moderate (Average wait times)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, {backgroundColor: '#f44336'}]} />
                <Text style={styles.legendText}>Busy (Consider visiting later)</Text>
              </View>
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
                    <Text style={styles.floorInfoExhibits}>
                      {floor.id === 1 ? 
                        'Pearl Diving, Desert Life, Modern Architecture' : 
                        'Islamic Golden Age, Calligraphy'}
                    </Text>
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
                <Text style={styles.exhibitLocation}>
                  {(exhibit.id === '1' || exhibit.id === '3' || exhibit.id === '4') ? 
                    'Floor 1' : 'Floor 2'}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      
      {/* Time Slot Detail Modal */}
      <Modal
        visible={timeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTimeModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTimeModalVisible(false)}
        >
          {selectedTimeSlot && (
            <View style={styles.timeModalContent}>
              <View style={styles.timeModalHeader}>
                <Text style={styles.timeModalTitle}>{selectedTimeSlot.hour} Visitor Data</Text>
                <TouchableOpacity onPress={() => setTimeModalVisible(false)}>
                  <Ionicons name="close-circle" size={24} color="#8C52FF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.timeDataContainer}>
                <View style={styles.timeVisitorCircle}>
                  <Text style={styles.timeVisitorCount}>{selectedTimeSlot.visitors}</Text>
                  <Text style={styles.timeVisitorLabel}>Visitors</Text>
                </View>
                
                <View style={styles.timeStatusContainer}>
                  <Text style={styles.timeStatusLabel}>Crowd Status:</Text>
                  <View style={[
                    styles.timeStatusBadge,
                    { backgroundColor: getStatusColor(selectedTimeSlot.status) }
                  ]}>
                    <Text style={styles.timeStatusText}>{selectedTimeSlot.status}</Text>
                  </View>
                  
                  <Text style={styles.timeAdvice}>
                    {selectedTimeSlot.status === 'busy' 
                      ? 'This is a peak time with high visitor count. Consider visiting during another time slot for a less crowded experience.'
                      : selectedTimeSlot.status === 'moderate'
                        ? 'This time has an average number of visitors. Expect some waiting time at popular exhibits.'
                        : 'This is a great time to visit! Lower visitor numbers mean more space and shorter wait times.'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(140, 82, 255, 0.2)',
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
    color: '#333',
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
  infoMessage: {
    backgroundColor: 'rgba(140, 82, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8C52FF',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    height: 230,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chartContent: {
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  chartBarContainer: {
    alignItems: 'center',
    width: 40,
    marginHorizontal: 6,
    justifyContent: 'flex-end',
    height: 180,
  },
  chartBar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  crowdLegend: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#555',
  },
  floorCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
  floorInfoExhibits: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  crowdAdvice: {
    fontSize: 14,
    color: '#333',
  },
  exhibitCrowdCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    marginBottom: 4,
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
  exhibitLocation: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  timeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timeDataContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeVisitorCircle: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(140, 82, 255, 0.1)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  timeVisitorCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8C52FF',
  },
  timeVisitorLabel: {
    fontSize: 12,
    color: '#666',
  },
  timeStatusContainer: {
    flex: 1,
  },
  timeStatusLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 12,
  },
  timeStatusText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timeAdvice: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  }
});

export default CrowdScreen;