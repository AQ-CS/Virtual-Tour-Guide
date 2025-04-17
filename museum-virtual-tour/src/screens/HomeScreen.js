// File: src/screens/HomeScreen.js - Add null check for currentUser

import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../AppContext';
import ExhibitCard from '../components/ExhibitCard';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentUser, exhibits, tours, isLoading } = useContext(AppContext);
  const [popularExhibits, setPopularExhibits] = useState([]);
  const [upcomingTours, setUpcomingTours] = useState([]);
  
  useEffect(() => {
    // Only process data when currentUser is available
    if (currentUser && exhibits && tours) {
      // Sort and get top rated exhibits
      const topRated = [...exhibits].sort((a, b) => b.rating - a.rating).slice(0, 3);
      setPopularExhibits(topRated);
      
      // Get user's upcoming tours
      const userTours = tours
        .filter(tour => tour.userId === currentUser.id && tour.status === 'upcoming')
        .slice(0, 2);
      setUpcomingTours(userTours);
    }
  }, [exhibits, tours, currentUser]);
  
  // Show loading indicator if data isn't ready yet
  if (isLoading || !currentUser) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LinearGradient
          colors={['#8C52FF', '#A67FFB', '#F0EBFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.backgroundGradient}
        />
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Elegant purple-white gradient background */}
      <LinearGradient
        colors={['#8C52FF', '#A67FFB', '#F0EBFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      {/* Subtle decorative shapes */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.username}>{currentUser.name}</Text>
          </View>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image source={{ uri: currentUser.image }} style={styles.profileImage} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Featured Banner */}
        <TouchableOpacity 
          style={styles.featuredBanner}
          onPress={() => navigation.navigate('Exhibits')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#6644B8', '#7E5AC7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bannerGradient}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContent}>
                <Text style={styles.bannerTitle}>Explore the Museum</Text>
                <Text style={styles.bannerSubtitle}>Discover our collection of iconic exhibits</Text>
                <View style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>Browse All</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </View>
              </View>
              <View style={styles.bannerIconContainer}>
                <Ionicons name="compass" size={70} color="rgba(255, 255, 255, 0.3)" />
              </View>
            </View>
          </LinearGradient>
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
                <View style={styles.tourColorAccent} />
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
                  <View style={styles.viewTourButtonInner}>
                    <Text style={styles.viewTourText}>View</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="calendar-outline" size={48} color="#8C52FF" />
              <Text style={styles.emptyStateText}>No upcoming tours</Text>
              <TouchableOpacity 
                style={styles.createTourButton}
                onPress={() => navigation.navigate('Tours')}
              >
                <View style={styles.createTourButtonInner}>
                  <Text style={styles.createTourText}>Create a Tour</Text>
                </View>
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
            <View style={styles.quickActionIconWrapper}>
              <Ionicons name="navigate" size={24} color="#8C52FF" />
            </View>
            <Text style={styles.quickActionText}>3D Navigation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('Crowd')}
          >
            <View style={styles.quickActionIconWrapper}>
              <Ionicons name="people" size={24} color="#8C52FF" />
            </View>
            <Text style={styles.quickActionText}>Live Crowd</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('SmartAgent')}
          >
            <View style={styles.quickActionIconWrapper}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#8C52FF" />
            </View>
            <Text style={styles.quickActionText}>Smart Agent</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  // Subtle decorative shapes
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: 120,
    right: -70,
    zIndex: -1,
  },
  decorCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: 350,
    left: -50,
    zIndex: -1,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileImageContainer: {
    padding: 2,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  // Featured banner
  featuredBanner: {
    marginHorizontal: 20,
    marginVertical: 16,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  bannerGradient: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTextContent: {
    flex: 2,
  },
  bannerIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
  // Section styling
  sectionContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 24,
    backgroundColor: 'white',
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(140, 82, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
  },
  seeAllText: {
    color: '#8C52FF',
    fontWeight: '600',
  },
  // Tour items
  tourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#f9f7ff',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tourColorAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#8C52FF',
  },
  tourInfo: {
    flex: 1,
    marginLeft: 8,
  },
  tourName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
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
    borderRadius: 20,
    overflow: 'hidden',
  },
  viewTourButtonInner: {
    backgroundColor: '#8C52FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  viewTourText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Empty state
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 16,
    backgroundColor: '#f9f7ff',
  },
  emptyStateText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#666',
  },
  createTourButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  createTourButtonInner: {
    backgroundColor: '#8C52FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createTourText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Quick actions
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 16,
    marginBottom: 30,
  },
  quickActionItem: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  quickActionIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(140, 82, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    textAlign: 'center',
  },
});

export default HomeScreen;