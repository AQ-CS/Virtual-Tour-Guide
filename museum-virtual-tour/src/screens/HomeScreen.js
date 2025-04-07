// File: src/screens/HomeScreen.js - Main dashboard

import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ImageBackground 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../AppContext';
import ExhibitCard from '../components/ExhibitCard';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentUser, exhibits, tours } = useContext(AppContext);
  const [popularExhibits, setPopularExhibits] = useState([]);
  const [upcomingTours, setUpcomingTours] = useState([]);
  
  useEffect(() => {
    // Sort and get top rated exhibits
    const topRated = [...exhibits].sort((a, b) => b.rating - a.rating).slice(0, 3);
    setPopularExhibits(topRated);
    
    // Get user's upcoming tours
    const userTours = tours
      .filter(tour => tour.userId === currentUser.id && tour.status === 'upcoming')
      .slice(0, 2);
    setUpcomingTours(userTours);
  }, [exhibits, tours, currentUser]);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.username}>{currentUser.name}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: currentUser.image }} style={styles.profileImage} />
        </TouchableOpacity>
      </View>
      
      {/* Featured Banner */}
      <TouchableOpacity 
        style={styles.featuredBanner}
        onPress={() => navigation.navigate('Exhibits')}
      >
        <ImageBackground
          source={require('../../assets/images/featured_banner.jpg')}
          style={styles.bannerImage}
          imageStyle={{ borderRadius: 16 }}
        >
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Explore the Museum</Text>
              <Text style={styles.bannerSubtitle}>Discover our collection of iconic exhibits</Text>
              <View style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Browse All</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      
      {/* Your Tours Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Tours</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tours')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingTours.length > 0 ? (
          upcomingTours.map(tour => (
            <View key={tour.id} style={styles.tourItem}>
              <View style={styles.tourInfo}>
                <Text style={styles.tourName}>{tour.name}</Text>
                <View style={styles.tourDetails}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.tourDate}>{tour.date} at {tour.time}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.viewTourButton}
                onPress={() => navigation.navigate('Tours', { tourId: tour.id })}
              >
                <Text style={styles.viewTourText}>View</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No upcoming tours</Text>
            <TouchableOpacity 
              style={styles.createTourButton}
              onPress={() => navigation.navigate('Tours')}
            >
              <Text style={styles.createTourText}>Create a Tour</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Popular Exhibits Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Exhibits</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Exhibits')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {popularExhibits.map(exhibit => (
          <ExhibitCard 
            key={exhibit.id}
            exhibit={exhibit}
            onPress={() => navigation.navigate('Exhibits', { exhibitId: exhibit.id })}
          />
        ))}
      </View>
      
      {/* Quick Actions Section */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Navigate')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="navigate" size={24} color="#2196F3" />
          </View>
          <Text style={styles.quickActionText}>3D Navigation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Crowd')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#F1F8E9' }]}>
            <Ionicons name="people" size={24} color="#8BC34A" />
          </View>
          <Text style={styles.quickActionText}>Live Crowd</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Home', { screen: 'SmartAgent' })}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#E8EAF6' }]}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#3F51B5" />
          </View>
          <Text style={styles.quickActionText}>Smart Agent</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  featuredBanner: {
    marginHorizontal: 20,
    marginVertical: 16,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  bannerContent: {
    maxWidth: '70%',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(140, 82, 255, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#8C52FF',
    fontWeight: '600',
  },
  tourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tourInfo: {
    flex: 1,
  },
  tourName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  tourDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tourDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  viewTourButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  viewTourText: {
    color: '#8C52FF',
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
  },
  emptyStateText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#666',
  },
  createTourButton: {
    backgroundColor: '#8C52FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createTourText: {
    color: '#fff',
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 16,
    marginBottom: 30,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;