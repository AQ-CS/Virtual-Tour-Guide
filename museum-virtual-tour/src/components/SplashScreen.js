// File: src/components/SplashScreen.js - Centered text with logo above

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  // Animation values
  const fadeIn = new Animated.Value(0);
  const logoFadeIn = new Animated.Value(0);
  const textFadeIn = new Animated.Value(0);

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Fade in background and image
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      
      // Fade in logo
      Animated.timing(logoFadeIn, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      
      // Fade in text
      Animated.timing(textFadeIn, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      
      // Hold for a moment before finishing
      Animated.delay(1000),
    ]).start(() => {
      // Call onFinish callback when animation is complete
      if (onFinish) {
        onFinish();
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Background color */}
      <View style={styles.backgroundFill} />
      
      {/* Splash image taking up full screen */}
      <Animated.View style={[styles.splashImageContainer, { opacity: fadeIn }]}>
        <Image 
          source={require('../../assets/splash.png')} 
          style={styles.splashImage}
          resizeMode="cover"
        />
      </Animated.View>
      
      {/* Centered content container */}
      <View style={styles.contentContainer}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, { opacity: logoFadeIn }]}>
          <Image 
            source={require('../../assets/images/Logo_white_trans.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* Text */}
        <Animated.View style={[styles.textContainer, { opacity: textFadeIn }]}>
          <Text style={styles.welcomeText}>
            Welcome to UAE Museum Explorer
          </Text>
          <Text style={styles.subtitleText}>
            Your Virtual Tour Guide
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#8C52FF',
  },
  splashImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    borderRadius:17,
    width: 140,
    height: 140,
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SplashScreen;