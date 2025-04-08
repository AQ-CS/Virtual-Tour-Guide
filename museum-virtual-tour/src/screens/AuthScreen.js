// File: src/screens/AuthScreen.js - Combined login/register with updated color scheme

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
  ImageBackground,
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
        image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
      };
      
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
                source={require('../../assets/images/logo.png')} 
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
    width: 80,
    height: 80,
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