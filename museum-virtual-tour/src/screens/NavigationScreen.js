// File: src/screens/NavigationScreen.js - 3D navigation with enhanced heatmap

import React, { useState, useRef, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  FlatList,
  Switch,
  Image
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../AppContext';
import AppHeader from '../components/AppHeader';
import ExhibitCard from '../components/ExhibitCard';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const NavigationScreen = () => {
  const { exhibits } = useContext(AppContext);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [findExhibitModalVisible, setFindExhibitModalVisible] = useState(false);
  const [selectedExhibit, setSelectedExhibit] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.7); // Default intensity
  const [floor1Image, setFloor1Image] = useState('');
  const [floor2Image, setFloor2Image] = useState('');
  const [visitorCounts, setVisitorCounts] = useState({
    '1': 45, // Pearl Diving Heritage
    '2': 48, // Islamic Golden Age Innovations
    '3': 25, // Desert Life Adaptation
    '4': 32, // Modern UAE Architecture
    '5': 34  // Calligraphy Through Centuries
  });
  const [showVisitorPopup, setShowVisitorPopup] = useState(false);
  const [popupExhibit, setPopupExhibit] = useState(null);
  
  // Load floor plan images
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Use static require for images
        const floor1 = require('../../assets/models/Floor1.png');
        const floor2 = require('../../assets/models/Floor2.png');
        
        // Set image URIs
        setFloor1Image(Image.resolveAssetSource(floor1).uri);
        setFloor2Image(Image.resolveAssetSource(floor2).uri);
      } catch (error) {
        console.error('Error loading floor plans:', error);
      }
    };
    
    loadImages();
  }, []);

  // Simulate real-time visitor count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCounts(prev => {
        const updated = {...prev};
        Object.keys(prev).forEach(id => {
          const variation = Math.floor(Math.random() * 6) - 3;
          updated[id] = Math.max(10, prev[id] + variation);
        });
        return updated;
      });
    }, 15000); // Update every 15 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Create dynamic HTML with the floor plans
  const getNavigationHTML = () => {
    return `
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
            background-color: #f9f7ff;
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
            display: none;
          }
          .exhibit-marker {
            position: absolute;
            width: 18px;
            height: 18px;
            background-color: #8C52FF;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s, background-color 0.2s;
          }
          .exhibit-marker:hover {
            transform: translate(-50%, -50%) scale(1.2);
          }
          .navigation-path {
            position: absolute;
            height: 5px;
            background-color: #8C52FF;
            transform-origin: 0 0;
            z-index: 5;
          }
          .current-location {
            position: absolute;
            width: 15px;
            height: 15px;
            background-color: #f44336;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .heatmap-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0;
            transition: opacity 0.5s;
            pointer-events: none;
            z-index: 2;
          }
          /* Floor-specific settings */
          #floor-1 {
            background-image: url('${floor1Image}');
          }
          #floor-2 {
            background-image: url('${floor2Image}');
          }
          /* Improved heatmap gradients with smaller, more constricted hotspots */
          #heatmap-1 {
            background: 
              radial-gradient(circle at 22% 26%, rgba(244, 67, 54, 0.9) 0%, rgba(244, 67, 54, 0.7) 10%, rgba(255, 152, 0, 0.4) 20%, rgba(76, 175, 80, 0.2) 30%, transparent 40%),
              radial-gradient(circle at 65% 35%, rgba(244, 67, 54, 0.8) 0%, rgba(255, 152, 0, 0.6) 15%, rgba(76, 175, 80, 0.3) 25%, transparent 35%),
              radial-gradient(circle at 50% 58%, rgba(244, 67, 54, 0.9) 0%, rgba(255, 152, 0, 0.7) 10%, rgba(76, 175, 80, 0.3) 20%, transparent 30%);
          }
          #heatmap-2 {
            background: 
              radial-gradient(circle at 30% 30%, rgba(244, 67, 54, 0.9) 0%, rgba(255, 152, 0, 0.6) 12%, rgba(76, 175, 80, 0.3) 24%, transparent 36%),
              radial-gradient(circle at 20% 60%, rgba(255, 152, 0, 0.8) 0%, rgba(255, 152, 0, 0.5) 15%, rgba(76, 175, 80, 0.3) 25%, transparent 35%);
          }
        </style>
      </head>
      <body>
        <div id="museum-map">
          <!-- Floor 1 Layout -->
          <div id="floor-1" class="floor-layout" style="display: ${currentFloor === 1 ? 'block' : 'none'};">
            <!-- Floor 1 Heatmap -->
            <div id="heatmap-1" class="heatmap-overlay" style="opacity: ${showHeatmap ? heatmapIntensity : 0};"></div>
            
            <!-- Floor 1 Exhibit Markers -->
            <div class="exhibit-marker" id="exhibit-1" style="top: 26%; left: 22%;" onclick="window.ReactNativeWebView.postMessage('exhibit_count:1:${visitorCounts['1']}')"></div>
            <div class="exhibit-marker" id="exhibit-3" style="top: 30%; left: 65%;" onclick="window.ReactNativeWebView.postMessage('exhibit_count:3:${visitorCounts['3']}')"></div>
            <div class="exhibit-marker" id="exhibit-4" style="top: 58%; left: 50%;" onclick="window.ReactNativeWebView.postMessage('exhibit_count:4:${visitorCounts['4']}')"></div>
            
            <!-- Navigation path shown when navigating -->
            <div id="navigation-path-1" class="navigation-path" style="display: none;"></div>
            
            <!-- Current user location -->
            <div id="current-location-1" class="current-location" style="top: 85%; left: 50%;"></div>
          </div>
          
          <!-- Floor 2 Layout -->
          <div id="floor-2" class="floor-layout" style="display: ${currentFloor === 2 ? 'block' : 'none'};">
            <!-- Floor 2 Heatmap -->
            <div id="heatmap-2" class="heatmap-overlay" style="opacity: ${showHeatmap ? heatmapIntensity : 0};"></div>
            
            <!-- Floor 2 Exhibit Markers -->
            <div class="exhibit-marker" id="exhibit-2" style="top: 30%; left: 30%;" onclick="window.ReactNativeWebView.postMessage('exhibit_count:2:${visitorCounts['2']}')"></div>
            <div class="exhibit-marker" id="exhibit-5" style="top: 60%; left: 20%;" onclick="window.ReactNativeWebView.postMessage('exhibit_count:5:${visitorCounts['5']}')"></div>
            
            <!-- Navigation path shown when navigating -->
            <div id="navigation-path-2" class="navigation-path" style="display: none;"></div>
            
            <!-- Current user location -->
            <div id="current-location-2" class="current-location" style="top: 80%; left: 60%;"></div>
          </div>
        </div>
        
        <script>
          // Simple JavaScript to show navigation when triggered
          function startNavigation(floor, x, y) {
            const path = document.getElementById('navigation-path-' + floor);
            const currentLocation = document.getElementById('current-location-' + floor);
            
            if (!path || !currentLocation) return;
            
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
          
          // Show the current floor
          function showFloor(floorNumber) {
            const floors = document.querySelectorAll('.floor-layout');
            floors.forEach(floor => {
              floor.style.display = 'none';
            });
            
            const currentFloor = document.getElementById('floor-' + floorNumber);
            if (currentFloor) {
              currentFloor.style.display = 'block';
            }
          }
          
          // Toggle heatmap visibility
          function toggleHeatmap(show, intensity) {
            const heatmaps = document.querySelectorAll('.heatmap-overlay');
            heatmaps.forEach(heatmap => {
              heatmap.style.opacity = show ? intensity : 0;
            });
          }
          
          // Update heatmap intensity
          function updateHeatmapIntensity(intensity) {
            const heatmaps = document.querySelectorAll('.heatmap-overlay');
            heatmaps.forEach(heatmap => {
              heatmap.style.opacity = intensity;
            });
          }
          
          // Update marker colors based on visitor counts
          function updateMarkerColors(counts) {
            Object.keys(counts).forEach(id => {
              const marker = document.getElementById('exhibit-' + id);
              if (!marker) return;
              
              const count = counts[id];
              let color;
              
              if (count > 35) {
                color = '#f44336'; // Red for busy
              } else if (count > 25) {
                color = '#ff9800'; // Orange for moderate
              } else {
                color = '#4caf50'; // Green for light
              }
              
              marker.style.backgroundColor = color;
            });
          }
          
          // Initial color update
          updateMarkerColors(${JSON.stringify(visitorCounts)});
        </script>
      </body>
    </html>
  `;
  };
  
  const webViewRef = useRef(null);
  
  // Handle floor change
  const handleFloorChange = (floor) => {
    setCurrentFloor(floor);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`showFloor(${floor}); true;`);
    }
  };
  
  // Handle heatmap toggle
  const toggleHeatmap = () => {
    const newState = !showHeatmap;
    setShowHeatmap(newState);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`toggleHeatmap(${newState}, ${heatmapIntensity}); true;`);
    }
  };
  
  // Update heatmap intensity
  const updateHeatmapIntensity = (intensity) => {
    setHeatmapIntensity(intensity);
    if (webViewRef.current && showHeatmap) {
      webViewRef.current.injectJavaScript(`updateHeatmapIntensity(${intensity}); true;`);
    }
  };
  
  // Update exhibit marker colors
  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`updateMarkerColors(${JSON.stringify(visitorCounts)}); true;`);
    }
  }, [visitorCounts]);
  
  // Start navigation
  const startNavigation = () => {
    if (!selectedExhibit) return;
    
    setIsNavigating(true);
    setFindExhibitModalVisible(false);
    
    // Get coordinates from the selected exhibit
    const { coordinates } = selectedExhibit;
    if (webViewRef.current && coordinates) {
      const jsCode = `startNavigation(${coordinates.floor}, ${coordinates.x}, ${coordinates.y}); true;`;
      webViewRef.current.injectJavaScript(jsCode);
    }
  };
  
  // Handle messages from WebView
  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    
    if (message.startsWith('exhibit_count:')) {
      const parts = message.split(':');
      const exhibitId = parts[1];
      const visitorCount = parts[2];
      
      // Find the exhibit by ID
      const exhibit = exhibits.find(ex => ex.id === exhibitId);
      
      if (exhibit) {
        setPopupExhibit({
          ...exhibit,
          currentVisitors: visitorCount
        });
        setShowVisitorPopup(true);
      }
    } else if (message.startsWith('exhibit:')) {
      const exhibitId = message.split(':')[1];
      const exhibit = exhibits.find(ex => ex.id === exhibitId);
      
      if (exhibit) {
        setSelectedExhibit(exhibit);
        // Optionally, you could also show details or start navigation here
      }
    }
  };
  
  // Filter exhibits by current floor
  const filteredExhibits = exhibits.filter(exhibit => 
    exhibit.coordinates && exhibit.coordinates.floor === currentFloor
  );
  
  // Get status color
  const getStatusColor = (count) => {
    if (count > 35) return '#f44336'; // Red for busy
    if (count > 25) return '#ff9800'; // Orange for moderate
    return '#4caf50'; // Green for light
  };
  
  // Get status text
  const getStatusText = (count) => {
    if (count > 35) return 'Busy';
    if (count > 25) return 'Moderate';
    return 'Light';
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
      
      <AppHeader 
        title="3D Navigation" 
        rightIcon="search"
        onRightPress={() => setFindExhibitModalVisible(true)}
      />
      
      <View style={styles.navigationContainer}>
        <View style={styles.webViewContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: getNavigationHTML() }}
            style={styles.webView}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
          />
        </View>
        
        {/* Heatmap Controls */}
        <View style={styles.heatmapControls}>
          <View style={styles.heatmapToggle}>
            <Text style={styles.heatmapLabel}>Show Crowd Heatmap</Text>
            <Switch
              value={showHeatmap}
              onValueChange={toggleHeatmap}
              trackColor={{ false: '#d0d0d0', true: '#A67FFB' }}
              thumbColor={showHeatmap ? '#8C52FF' : '#f4f3f4'}
            />
          </View>
          
          {showHeatmap && (
            <View style={styles.intensityControl}>
              <Text style={styles.intensityLabel}>Low</Text>
              <Slider
                style={styles.slider}
                minimumValue={0.3}
                maximumValue={0.9}
                value={heatmapIntensity}
                onValueChange={updateHeatmapIntensity}
                minimumTrackTintColor="#8C52FF"
                maximumTrackTintColor="#d0d0d0"
                thumbTintColor="#8C52FF"
              />
              <Text style={styles.intensityLabel}>High</Text>
            </View>
          )}
        </View>
        
        {/* Visitor Popup */}
        {showVisitorPopup && popupExhibit && (
          <View style={styles.visitorPopup}>
            <View style={styles.visitorPopupHeader}>
              <Text style={styles.visitorPopupTitle}>{popupExhibit.name}</Text>
              <TouchableOpacity onPress={() => setShowVisitorPopup(false)}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.visitorInfoRow}>
              <View style={[styles.visitorCountBadge, { backgroundColor: getStatusColor(popupExhibit.currentVisitors) }]}>
                <Text style={styles.visitorCountText}>{popupExhibit.currentVisitors}</Text>
              </View>
              <View style={styles.visitorInfoContent}>
                <Text style={styles.visitorInfoLabel}>Current Visitors</Text>
                <Text style={styles.visitorStatusText}>
                  Status: <Text style={{color: getStatusColor(popupExhibit.currentVisitors), fontWeight: 'bold'}}>
                    {getStatusText(popupExhibit.currentVisitors)}
                  </Text>
                </Text>
              </View>
            </View>
            
            <View style={styles.visitorLocationRow}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.visitorLocationText}>{popupExhibit.location}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={() => {
                setSelectedExhibit(popupExhibit);
                setShowVisitorPopup(false);
                startNavigation();
              }}
            >
              <Text style={styles.navigateButtonText}>Navigate to Exhibit</Text>
            </TouchableOpacity>
          </View>
        )}
        
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
          {[1, 2].map(floor => (
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
                      handleFloorChange(item.coordinates.floor);
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
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  navigationContainer: {
    flex: 1,
    position: 'relative',
    padding: 8,
  },
  webViewContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  webView: {
    flex: 1,
  },
  heatmapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 12,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  heatmapToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  heatmapLabel: {
    fontSize: 14,
    marginRight: 8,
    color: '#333',
  },
  intensityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  intensityLabel: {
    fontSize: 12,
    color: '#666',
    width: 30,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  visitorPopup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    transform: [{ translateX: -125 }, { translateY: -100 }],
    zIndex: 20,
  },
  visitorPopupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitorPopupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  visitorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  visitorCountBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  visitorCountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  visitorInfoContent: {
    flex: 1,
  },
  visitorInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  visitorStatusText: {
    fontSize: 14,
    color: '#333',
  },
  visitorLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  visitorLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  navigateButton: {
    backgroundColor: '#8C52FF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  navigationInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
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
    borderTopColor: 'rgba(140, 82, 255, 0.3)',
    backgroundColor: 'rgba(140, 82, 255, 0.15)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    color: '#fff',
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