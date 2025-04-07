// File: src/screens/TourScreen.js - All tour functionality

import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../AppContext';
import AppHeader from '../components/AppHeader';
import TourItem from '../components/TourItem';
import ExhibitCard from '../components/ExhibitCard';

const TourScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tours, setTours, currentUser, exhibits } = useContext(AppContext);
  
  const [userTours, setUserTours] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // New tour state
  const [newTourName, setNewTourName] = useState('');
  const [newTourDate, setNewTourDate] = useState('');
  const [newTourTime, setNewTourTime] = useState('');
  const [newTourExhibits, setNewTourExhibits] = useState([]);
  const [showExhibitsSelector, setShowExhibitsSelector] = useState(false);
  
  useEffect(() => {
    // Filter tours by user
    const filtered = tours.filter(tour => tour.userId === currentUser.id);
    
    // Apply status filter
    if (selectedFilter !== 'all') {
      const statusFiltered = filtered.filter(tour => tour.status === selectedFilter);
      setUserTours(statusFiltered);
    } else {
      setUserTours(filtered);
    }
    
    // Check if we should open a specific tour from params
    if (route.params?.tourId) {
      const tour = tours.find(t => t.id === route.params.tourId);
      if (tour) {
        setSelectedTour(tour);
        setModalVisible(true);
        // Clear the parameter after use
        navigation.setParams({ tourId: undefined });
      }
    }
    
    // Check if we should create a new tour
    if (route.params?.newTour) {
      setCreateModalVisible(true);
      
      // If an exhibit was passed, add it to the new tour
      if (route.params?.exhibitId) {
        setNewTourExhibits([route.params.exhibitId]);
      }
      
      // Clear the parameters after use
      navigation.setParams({ newTour: undefined, exhibitId: undefined });
    }
  }, [tours, currentUser, selectedFilter, route.params]);
  
  const handleEditTour = (tour) => {
    setSelectedTour(tour);
    setNewTourName(tour.name);
    setNewTourDate(tour.date);
    setNewTourTime(tour.time);
    setNewTourExhibits(tour.exhibits);
    setCreateModalVisible(true);
  };
  
  const handleCancelTour = (tour) => {
    const updatedTours = tours.map(t => {
      if (t.id === tour.id) {
        return { ...t, status: 'cancelled' };
      }
      return t;
    });
    
    setTours(updatedTours);
  };

const handleCreateTour = () => {
    // Validate inputs
    if (!newTourName || !newTourDate || !newTourTime || newTourExhibits.length === 0) {
      alert('Please fill all fields and select at least one exhibit');
      return;
    }
    
    if (selectedTour) {
      // Update existing tour
      const updatedTours = tours.map(tour => {
        if (tour.id === selectedTour.id) {
          return {
            ...tour,
            name: newTourName,
            date: newTourDate,
            time: newTourTime,
            exhibits: newTourExhibits,
          };
        }
        return tour;
      });
      
      setTours(updatedTours);
    } else {
      // Create new tour
      const newTour = {
        id: (tours.length + 1).toString(),
        userId: currentUser.id,
        name: newTourName,
        date: newTourDate,
        time: newTourTime,
        duration: 90, // Default duration
        exhibits: newTourExhibits,
        status: 'upcoming'
      };
      
      setTours([...tours, newTour]);
    }
    
    // Reset form and close modal
    setNewTourName('');
    setNewTourDate('');
    setNewTourTime('');
    setNewTourExhibits([]);
    setSelectedTour(null);
    setCreateModalVisible(false);
  };
  
  const handleRemoveExhibit = (exhibitId) => {
    setNewTourExhibits(newTourExhibits.filter(id => id !== exhibitId));
  };
  
  const handleAddExhibit = (exhibitId) => {
    if (!newTourExhibits.includes(exhibitId)) {
      setNewTourExhibits([...newTourExhibits, exhibitId]);
    }
  };
  
  const getExhibitById = (id) => {
    return exhibits.find(exhibit => exhibit.id === id);
  };
  
  return (
    <View style={styles.container}>
      <AppHeader 
        title="Your Tours" 
        rightIcon="add-circle-outline"
        onRightPress={() => {
          setSelectedTour(null);
          setNewTourName('');
          setNewTourDate('');
          setNewTourTime('');
          setNewTourExhibits([]);
          setCreateModalVisible(true);
        }}
      />
      
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'all' && styles.activeFilterTab
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'all' && styles.activeFilterText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'upcoming' && styles.activeFilterTab
          ]}
          onPress={() => setSelectedFilter('upcoming')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'upcoming' && styles.activeFilterText
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'completed' && styles.activeFilterTab
          ]}
          onPress={() => setSelectedFilter('completed')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'completed' && styles.activeFilterText
          ]}>
            Completed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'cancelled' && styles.activeFilterTab
          ]}
          onPress={() => setSelectedFilter('cancelled')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'cancelled' && styles.activeFilterText
          ]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>
      
      {userTours.length > 0 ? (
        <FlatList
          data={userTours}
          renderItem={({ item }) => (
            <TourItem
              tour={item}
              onPress={() => {
                setSelectedTour(item);
                setModalVisible(true);
              }}
              onEdit={handleEditTour}
              onCancel={handleCancelTour}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.toursList}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No tours found</Text>
          <Text style={styles.emptyStateMessage}>
            {selectedFilter === 'all' 
              ? "You haven't created any tours yet" 
              : `You don't have any ${selectedFilter} tours`}
          </Text>
          <TouchableOpacity
            style={styles.createTourButton}
            onPress={() => {
              setSelectedTour(null);
              setNewTourName('');
              setNewTourDate('');
              setNewTourTime('');
              setNewTourExhibits([]);
              setCreateModalVisible(true);
            }}
          >
            <Text style={styles.createTourButtonText}>Create a Tour</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Tour Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedTour && (
          <View style={styles.modalContainer}>
            <AppHeader 
              title="Tour Details" 
              onBackPress={() => setModalVisible(false)}
              rightIcon={selectedTour.status === 'upcoming' ? "create-outline" : null}
              onRightPress={() => {
                setModalVisible(false);
                handleEditTour(selectedTour);
              }}
            />
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.tourHeader}>
                <Text style={styles.tourTitle}>{selectedTour.name}</Text>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: 
                    selectedTour.status === 'upcoming' ? '#8C52FF' :
                    selectedTour.status === 'completed' ? '#28a745' : '#dc3545'
                  }
                ]}>
                  <Text style={styles.statusText}>{selectedTour.status}</Text>
                </View>
              </View>
              
              <View style={styles.tourInfoSection}>
                <View style={styles.tourInfoItem}>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                  <Text style={styles.tourInfoText}>Date: {selectedTour.date}</Text>
                </View>
                <View style={styles.tourInfoItem}>
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.tourInfoText}>Time: {selectedTour.time}</Text>
                </View>
                <View style={styles.tourInfoItem}>
                  <Ionicons name="hourglass-outline" size={20} color="#666" />
                  <Text style={styles.tourInfoText}>Duration: {selectedTour.duration} minutes</Text>
                </View>
              </View>
              
              <View style={styles.exhibitsSection}>
                <Text style={styles.sectionTitle}>Tour Exhibits</Text>
                
                {selectedTour.exhibits.map(exhibitId => {
                  const exhibit = getExhibitById(exhibitId);
                  return exhibit ? (
                    <ExhibitCard
                      key={exhibit.id}
                      exhibit={exhibit}
                      compact={true}
                      onPress={() => {
                        setModalVisible(false);
                        navigation.navigate('Exhibits', { exhibitId: exhibit.id });
                      }}
                    />
                  ) : null;
                })}
              </View>
              
              {selectedTour.status === 'upcoming' && (
                <TouchableOpacity
                  style={styles.cancelTourButton}
                  onPress={() => {
                    handleCancelTour(selectedTour);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.cancelTourButtonText}>Cancel Tour</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>
      
      {/* Create/Edit Tour Modal */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <AppHeader 
            title={selectedTour ? "Edit Tour" : "Create Tour"} 
            onBackPress={() => setCreateModalVisible(false)}
          />
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Tour Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter tour name"
                value={newTourName}
                onChangeText={setNewTourName}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date</Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
                value={newTourDate}
                onChangeText={setNewTourDate}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Time</Text>
              <TextInput
                style={styles.formInput}
                placeholder="HH:MM"
                value={newTourTime}
                onChangeText={setNewTourTime}
              />
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.exhibitSelectorHeader}>
                <Text style={styles.formLabel}>Selected Exhibits</Text>
                <TouchableOpacity
                  style={styles.addExhibitButton}
                  onPress={() => setShowExhibitsSelector(true)}
                >
                  <Text style={styles.addExhibitButtonText}>+ Add Exhibit</Text>
                </TouchableOpacity>
              </View>
              
              {newTourExhibits.length > 0 ? (
                newTourExhibits.map(exhibitId => {
                  const exhibit = getExhibitById(exhibitId);
                  return exhibit ? (
                    <View key={exhibit.id} style={styles.selectedExhibitItem}>
                      <Text style={styles.selectedExhibitName}>{exhibit.name}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveExhibit(exhibit.id)}
                        style={styles.removeExhibitButton}
                      >
                        <Ionicons name="close-circle" size={24} color="#dc3545" />
                      </TouchableOpacity>
                    </View>
                  ) : null;
                })
              ) : (
                <Text style={styles.noExhibitsText}>No exhibits selected</Text>
              )}
            </View>
            
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateTour}
            >
              <Text style={styles.createButtonText}>
                {selectedTour ? "Save Changes" : "Create Tour"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
          
          {/* Exhibits Selector Modal */}
          <Modal
            visible={showExhibitsSelector}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowExhibitsSelector(false)}
          >
            <View style={styles.selectorOverlay}>
              <View style={styles.selectorContent}>
                <View style={styles.selectorHeader}>
                  <Text style={styles.selectorTitle}>Select Exhibits</Text>
                  <TouchableOpacity onPress={() => setShowExhibitsSelector(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={exhibits}
                  renderItem={({ item }) => (
                    <ExhibitCard
                      exhibit={item}
                      compact={true}
                      onPress={() => {
                        handleAddExhibit(item.id);
                        setShowExhibitsSelector(false);
                      }}
                    />
                  )}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.selectorList}
                />
              </View>
            </View>
          </Modal>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
  },
  activeFilterTab: {
    backgroundColor: '#8C52FF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  toursList: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  createTourButton: {
    backgroundColor: '#8C52FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  createTourButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  tourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tourTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tourInfoSection: {
    marginBottom: 24,
  },
  tourInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tourInfoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  exhibitsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  cancelTourButton: {
    backgroundColor: '#f8d7da',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  cancelTourButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  exhibitSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addExhibitButton: {
    backgroundColor: '#e6f7ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addExhibitButtonText: {
    color: '#1890ff',
    fontWeight: '500',
  },
  selectedExhibitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedExhibitName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  removeExhibitButton: {
    padding: 4,
  },
  noExhibitsText: {
    color: '#666',
    fontStyle: 'italic',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: '#8C52FF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  selectorContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectorList: {
    paddingBottom: 20,
  },
});

export default TourScreen;