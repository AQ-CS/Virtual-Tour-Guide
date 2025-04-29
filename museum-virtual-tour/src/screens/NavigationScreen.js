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
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.5); // Set to medium as default
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
          .current-location {
            position: absolute;
            width: 15px;
            height: 15px;
            background-color:rgb(54, 101, 244);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .you-are-here {
            position: absolute;
            font-size: 15px;
            font-weight: bold;
            transform: translate(-50%, -150%);
            white-space: nowrap;
            color: #333;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
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
          /* Improved heatmap gradients with smaller, more constricted hotspots (halved size) */
          #heatmap-1 {
            background: 
              radial-gradient(circle at 22% 30%, rgba(244, 133, 54, 0.9) 0%, rgba(244, 152, 54, 0.7) 5%, rgba(255, 152, 0, 0.4) 10%, rgba(76, 175, 80, 0.2) 15%, transparent 20%),
              radial-gradient(circle at 22% 60%, rgba(244, 67, 54, 0.9) 0%, rgba(244, 67, 54, 0.7) 5%, rgba(255, 152, 0, 0.4) 10%, rgba(76, 175, 80, 0.2) 15%, transparent 20%),
              radial-gradient(circle at 55% 27%, rgba(244, 67, 54, 0.8) 0%, rgba(255, 152, 0, 0.6) 0%, rgba(76, 175, 80, 0.3) 12%, transparent 17%),
              radial-gradient(circle at 50% 52%, rgba(244, 67, 54, 0.9) 0%, rgba(255, 152, 0, 0.7) 5%, rgba(76, 175, 80, 0.3) 10%, transparent 15%);
          }
          #heatmap-2 {
            background: 
              radial-gradient(circle at 30% 30%, rgba(244, 67, 54, 0.9) 0%, rgba(255, 152, 0, 0.6) 6%, rgba(76, 175, 80, 0.3) 12%, transparent 18%),
              radial-gradient(circle at 20% 60%, rgba(255, 152, 0, 0.8) 0%, rgba(255, 152, 0, 0.5) 7%, rgba(76, 175, 80, 0.3) 12%, transparent 17%);
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
            <div class="exhibit-marker" id="exhibit-1" style="top: 40%; left: 21.5%;" onclick="window.ReactNativeWebView.postMessage('exhibit_count:1:${visitorCounts['1']}')"></div>
            <div class="exhibit-marker" id="exhibit-3" style="top: 32%; left: 55%;" onclick="window.ReactNativeWebView.postMessage('exhibit_count:3:${visitorCounts['3']}')"></div>
            <div class="exhibit-marker" id="exhibit-4" style="top: 58%; left: 50%;" onclick="window.ReactNativeWebView.postMessage('exhibit_count:4:${visitorCounts['4']}')"></div>
            
            <!-- Current user location - moved up a bit -->
            <div id="current-location-1" class="current-location" style="top: 65%; left: 50%;"></div>
            <div class="you-are-here" style="top: 65%; left: 50%;">You are here</div>
          </div>
          
          <!-- Floor 2 Layout -->
          <div id="floor-2" class="floor-layout" style="display: ${currentFloor === 2 ? 'block' : 'none'};">
            <!-- Floor 2 Heatmap -->
            <div id="heatmap-2" class="heatmap-overlay" style="opacity: ${showHeatmap ? heatmapIntensity : 0};"></div>
            
            <!-- Floor 2 Exhibit Markers -->
            <div class="exhibit-marker" id="exhibit-2" style="top: 30%; left: 30%;" onclick="window.ReactNativeWebView.postMessage('exhibit_count:2:${visitorCounts['2']}')"></div>
            <div class="exhibit-marker" id="exhibit-5" style="top: 60%; left: 20%;" onclick="window.ReactNativeWebView.postMessage('exhibit_count:5:${visitorCounts['5']}')"></div>
          
          </div>
        </div>
        
        <script>
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
  
  // Update heatmap intensity - called but not exposed in UI anymore
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
        
        {/* Heatmap Controls - removed slider */}
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
        </View>
        
        {/* Visitor Popup - removed navigate button */}
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
      
      {/* Find Exhibit Modal - removed navigation functionality */}
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
                      setFindExhibitModalVisible(false);
                    }
                  }}
                />
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.exhibitsList}
            />
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
  },
  heatmapLabel: {
    fontSize: 14,
    marginRight: 8,
    color: '#333',
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
});

export default NavigationScreen;