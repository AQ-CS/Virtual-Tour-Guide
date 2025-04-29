// File: src/screens/AuthScreen.js - Updated with initials profile image

import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../AppContext';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('');
  
  const { users, setUsers, setIsLoggedIn, setCurrentUser } = useContext(AppContext);
  
  // Function to generate initials from name
  const getInitials = (fullName) => {
    if (!fullName) return '';
    
    const names = fullName.split(' ');
    
    // If only one name, return first two letters
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    // Get first letter of first name and first letter of last name
    const firstInitial = names[0][0];
    const lastInitial = names[names.length - 1][0];
    
    return (firstInitial + lastInitial).toUpperCase();
  };
  
  // Function to generate a profile image SVG with initials
  const generateInitialsProfileImage = (fullName) => {
    const initials = getInitials(fullName);
    
    // Generate a consistent background color based on the name
    const getColorFromName = (name) => {
      const colors = [
        '#8C52FF', // Purple (primary color)
        '#5271FF', // Blue
        '#52B4FF', // Light Blue
        '#52FF7D', // Green
        '#FFD052', // Gold
        '#FF7D52', // Orange
      ];
      
      // Simple hash function to get a consistent color for the same name
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Use the hash to pick a color
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    };
    
    const bgColor = getColorFromName(fullName);
    
    return {
      initials,
      backgroundColor: bgColor
    };
  };
  
  const handleAuth = () => {
    if (isLogin) {
      // Login logic
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } else {
      // Register logic
      if (!username || !password || !name || !email) {
        alert('Please fill all required fields');
        return;
      }
      
      // Check if username already exists
      if (users.some(u => u.username === username)) {
        alert('Username already exists');
        return;
      }
      
      // Generate profile image data
      const profileImage = generateInitialsProfileImage(name);
      
      // Create new user
      const newUser = {
        id: (users.length + 1).toString(),
        username,
        password,
        name,
        email,
        nationality,
        preferences: {
          favoriteCategories: [],
          favoriteExhibits: []
        },
        profileImage: profileImage, // Save initials and background color
        // This removes the random user API and replaces with our initials approach
      };
      
      // Add new user to users array in AppContext
      // The useEffect in AppContext will handle saving to AsyncStorage
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setIsLoggedIn(true);
    }
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
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/Logo_purple_trans.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>UAE Museum</Text>
            <Text style={styles.subtitle}>Virtual Tour Guide</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
            
            {!isLogin && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#999"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nationality"
                  value={nationality}
                  onChangeText={setNationality}
                  placeholderTextColor="#999"
                />
              </>
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
            
            <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
              <Text style={styles.authButtonText}>
                {isLogin ? 'Login' : 'Register'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.switchModeButton} 
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchModeText}>
                {isLogin ? 'New User? Create an account' : 'Already have an account? Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 8,
    opacity: 0.9,
  },
  formContainer: {
    paddingHorizontal: 24,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f7ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(140, 82, 255, 0.2)',
    color: '#333',
  },
  authButton: {
    backgroundColor: '#8C52FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    elevation: 3,
    shadowColor: '#8C52FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#8C52FF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AuthScreen;