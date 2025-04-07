// components/navigation/ThreeDScene.js

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

import Button from '../ui/Button';
import Typography from '../ui/Typography';
import { COLORS, SIZES } from '../../constants/theme';

const ThreeDScene = ({
  targetExhibit = null,
  onExhibitReached,
}) => {
  const renderer = useRef(null);
  const scene = useRef(null);
  const camera = useRef(null);
  const animationFrameId = useRef(null);
  
  // Setup the Three.js scene
  const onContextCreate = async (gl) => {
    renderer.current = new Renderer({ gl });
    renderer.current.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.current.setClearColor(0xf0f0f0);
    
    scene.current = new THREE.Scene();
    
    // Add camera
    camera.current = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.current.position.z = 5;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.current.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.current.add(directionalLight);
    
    // Create museum floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xe0e0e0,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -2;
    scene.current.add(floor);
    
    // Create some basic walls
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xf5f5f5 });
    
    // Back wall
    const backWallGeometry = new THREE.BoxGeometry(20, 5, 0.1);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -5;
    scene.current.add(backWall);
    
    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(0.1, 5, 20);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -10;
    scene.current.add(leftWall);
    
    // Right wall
    const rightWallGeometry = new THREE.BoxGeometry(0.1, 5, 20);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.x = 10;
    scene.current.add(rightWall);
    
    // Add some placeholder exhibits
    addExhibits();
    
    // Start the animation loop
    startAnimation();
  };
  
  // Add placeholder exhibits
  const addExhibits = () => {
    const exhibitGeometry = new THREE.BoxGeometry(1, 2, 1);
    const exhibitMaterials = [
      new THREE.MeshBasicMaterial({ color: 0x6200ee }),
      new THREE.MeshBasicMaterial({ color: 0x03dac6 }),
      new THREE.MeshBasicMaterial({ color: 0xff0266 }),
    ];
    
    // First exhibit
    const exhibit1 = new THREE.Mesh(exhibitGeometry, exhibitMaterials[0]);
    exhibit1.position.set(-5, -1, -3);
    exhibit1.userData = { id: 'exhibit1', name: 'Ancient Artifacts' };
    scene.current.add(exhibit1);
    
    // Second exhibit
    const exhibit2 = new THREE.Mesh(exhibitGeometry, exhibitMaterials[1]);
    exhibit2.position.set(0, -1, -3);
    exhibit2.userData = { id: 'exhibit2', name: 'Modern Art' };
    scene.current.add(exhibit2);
    
    // Third exhibit
    const exhibit3 = new THREE.Mesh(exhibitGeometry, exhibitMaterials[2]);
    exhibit3.position.set(5, -1, -3);
    exhibit3.userData = { id: 'exhibit3', name: 'Interactive Displays' };
    scene.current.add(exhibit3);
  };
  
  // Animation loop
  const startAnimation = () => {
    const animate = () => {
      if (scene.current && camera.current && renderer.current) {
        animationFrameId.current = requestAnimationFrame(animate);
        renderer.current.render(scene.current, camera.current);
        gl.endFrameEXP();
      }
    };
    
    animate();
  };
  
  // Clean up resources
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  
  // Navigate to a specific exhibit if targetExhibit is set
  useEffect(() => {
    if (targetExhibit && camera.current && scene.current) {
      // In a real app, you would implement proper navigation logic here
      // For now, just move the camera to simulate navigation
      
      // Find target position based on exhibit ID
      let targetPosition;
      switch (targetExhibit) {
        case 'exhibit1':
          targetPosition = new THREE.Vector3(-5, 0, 0);
          break;
        case 'exhibit2':
          targetPosition = new THREE.Vector3(0, 0, 0);
          break;
        case 'exhibit3':
          targetPosition = new THREE.Vector3(5, 0, 0);
          break;
        default:
          targetPosition = new THREE.Vector3(0, 0, 5);
      }
      
      // Animate camera movement (in a real app, use proper tweening)
      const animateCamera = () => {
        camera.current.position.lerp(targetPosition, 0.05);
        
        if (camera.current.position.distanceTo(targetPosition) > 0.1) {
          requestAnimationFrame(animateCamera);
        } else {
          // We've reached the target
          if (onExhibitReached) {
            onExhibitReached(targetExhibit);
          }
        }
      };
      
      animateCamera();
    }
  }, [targetExhibit]);
  
  return (
    <View style={styles.container}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
      
      <View style={styles.controls}>
        <Typography variant="caption" style={styles.helpText}>
          Pinch to zoom, drag to rotate, two fingers to pan
        </Typography>
        
        <View style={styles.buttonsContainer}>
          <Button
            title="Reset View"
            size="small"
            onPress={() => {
              if (camera.current) {
                camera.current.position.set(0, 0, 5);
                camera.current.lookAt(0, 0, 0);
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.7,
  },
  controls: {
    padding: SIZES.md,
    backgroundColor: COLORS.background,
  },
  helpText: {
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ThreeDScene;