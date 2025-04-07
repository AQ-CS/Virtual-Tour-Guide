// File: src/screens/NavigationScreen.js - 3D navigation

import React, { useState, useRef, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { AppContext } from '../AppContext';
import AppHeader from '../components/AppHeader';
import ExhibitCard from '../components/ExhibitCard';

const NavigationScreen = () => {
  const { exhibits } = useContext(AppContext);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [findExhibitModalVisible, setFindExhibitModalVisible] = useState(false);
  const [selectedExhibit, setSelectedExhibit] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // This would be a 3D view in a real implementation
  // For this prototype, we'll use a simple WebView with a placeholder
  const navigationHTML = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            overflow: hidden;
            font-family: Arial, sans-serif;
          }
          #museum-map {
            width: 100%;
            height: 100%;
            background-color: #f9f9f9;
            position: relative;
          }
          .floor-layout {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }
          .exhibit-marker {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: #8C52FF;
            border-radius: 50%;
            transform: translate(-50%, -50%);
          }
          .navigation-path {
            position: absolute;
            height: 5px;
            background-color: #8C52FF;
            transform-origin: 0 0;
          }
          #current-location {
            position: absolute;
            width: 15px;
            height: 15px;
            background-color: #f44336;
            border-radius: 50%;
            transform: translate(-50%, -50%);
          }
        </style>
      </head>
      <body>
        <div id="museum-map">
          <div class="floor-layout" style="background-image: url('about:blank');">
            <!-- Exhibit markers would be placed here -->
            <div class="exhibit-marker" style="top: 30%; left: 20%;" title="Pearl Diving Heritage"></div>
            <div class="exhibit-marker" style="top: 45%; left: 70%;" title="Desert Life Adaptation"></div>
            <div class="exhibit-marker" style="top: 70%; left: 40%;" title="Modern UAE Architecture"></div>
            
            <!-- Navigation path shown when navigating -->
            <div id="navigation-path" class="navigation-path" style="display: none;"></div>
            
            <!-- Current user location -->
            <div id="current-location" style="top: 85%; left: 15%;"></div>
          </div>
        </div>
        
        <script>
          // Simple JavaScript to show navigation when triggered
          function startNavigation(x, y) {
            const path = document.getElementById('navigation-path');
            const currentLocation = document.getElementById('current-location');
            
            const startX = parseFloat(currentLocation.style.left);
            const startY = parseFloat(currentLocation.style.top);
            
            // Calculate path position and rotation
            const dx = x - startX;
            const dy = y - startY;
            const length = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            // Position the path
            path.style.left = startX + '%';
            path.style.top = startY + '%';
            path.style.width = length + '%';
            path.style.transform = 'rotate(' + angle + 'deg)';
            path.style.display = 'block';
          }
        </script>
      </body>
    </html>
  `;
  
  const webViewRef = useRef(null);
  
  const handleFloorChange = (floor) => {
    setCurrentFloor(floor);
  };
  
  const startNavigation = () => {
    if (!selectedExhibit) return;
    
    setIsNavigating(true);
    setFindExhibitModalVisible(false);
    
    // In a real app, this would send coordinates to the 3D navigation system
    // For our prototype, we'll just show a basic animation in the WebView
    const { coordinates } = selectedExhibit;
    if (webViewRef.current && coordinates) {
      const jsCode = `startNavigation(${coordinates.x}, ${coordinates.y});`;
      webViewRef.current.injectJavaScript(jsCode);
    }
  };
  
  const filteredExhibits = exhibits.filter(exhibit => 
    exhibit.coordinates && exhibit.coordinates.floor === currentFloor
  );

  return (
    <View style={styles.container}>
      <AppHeader 
        title="3D Navigation" 
        rightIcon="search"
        onRightPress={() => setFindExhibitModalVisible(true)}
      />
      
      <View style={styles.navigationContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: navigationHTML }}
          style={styles.webView}
        />
        
        {isNavigating && selectedExhibit && (
          <View style={styles.navigationInfo}>
            <Text style={styles.navigationTitle}>
              Navigating to: {selectedExhibit.name}
            </Text>
            <Text style={styles.navigationLocation}>
              {selectedExhibit.location}
            </Text>
            <TouchableOpacity 
              style={styles.stopButton}
              onPress={() => setIsNavigating(false)}
            >
              <Text style={styles.stopButtonText}>Stop Navigation</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.floorControls}>
        <Text style={styles.floorTitle}>Floor</Text>
        <View style={styles.floorButtons}>
          {[1, 2, 3].map(floor => (
            <TouchableOpacity
              key={floor}
              style={[
                styles.floorButton,
                currentFloor === floor && styles.activeFloorButton
              ]}
              onPress={() => handleFloorChange(floor)}
            >
              <Text 
                style={[
                  styles.floorButtonText,
                  currentFloor === floor && styles.activeFloorButtonText
                ]}
              >
                {floor}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Find Exhibit Modal */}
      <Modal
        visible={findExhibitModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFindExhibitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Find Exhibit</Text>
              <TouchableOpacity onPress={() => setFindExhibitModalVisible(false)}>
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
                    setSelectedExhibit(item);
                    if (item.coordinates) {
                      setCurrentFloor(item.coordinates.floor);
                    }
                  }}
                />
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.exhibitsList}
            />
            
            {selectedExhibit && (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={startNavigation}
              >
                <Text style={styles.startButtonText}>
                  Navigate to {selectedExhibit.name}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navigationContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  navigationInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navigationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  navigationLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  stopButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  floorControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  floorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  floorButtons: {
    flexDirection: 'row',
  },
  floorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  activeFloorButton: {
    backgroundColor: '#8C52FF',
  },
  floorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeFloorButtonText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  exhibitsList: {
    paddingBottom: 20,
  },
  startButton: {
    backgroundColor: '#8C52FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NavigationScreen;