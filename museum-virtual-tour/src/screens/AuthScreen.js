// File: src/screens/AuthScreen.js - Combined login/register

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
  ScrollView
} from 'react-native';
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
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
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Nationality"
                value={nationality}
                onChangeText={setNationality}
              />
            </>
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#8C52FF',
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#8C52FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
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
  },
});

export default AuthScreen;