// File: src/AppContext.js - Context with AsyncStorage persistence

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import initial data - used only first time app runs or when storage is cleared
import usersData from './data/users.json';
import exhibitsData from './data/exhibits.json';
import toursData from './data/tours.json';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // App state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [exhibits, setExhibits] = useState([]);
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage when app starts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get data from AsyncStorage
        const storedUsers = await AsyncStorage.getItem('users');
        const storedExhibits = await AsyncStorage.getItem('exhibits');
        const storedTours = await AsyncStorage.getItem('tours');
        const storedCurrentUser = await AsyncStorage.getItem('currentUser');
        const storedIsLoggedIn = await AsyncStorage.getItem('isLoggedIn');

        // Set state with stored values or fallback to initial data
        setUsers(storedUsers ? JSON.parse(storedUsers) : usersData);
        setExhibits(storedExhibits ? JSON.parse(storedExhibits) : exhibitsData);
        setTours(storedTours ? JSON.parse(storedTours) : toursData);
        
        if (storedIsLoggedIn === 'true' && storedCurrentUser) {
          setIsLoggedIn(true);
          setCurrentUser(JSON.parse(storedCurrentUser));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
        // Fallback to initial data if loading fails
        setUsers(usersData);
        setExhibits(exhibitsData);
        setTours(toursData);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save users to AsyncStorage whenever it changes
  useEffect(() => {
    const saveUsers = async () => {
      try {
        if (users.length > 0) {
          await AsyncStorage.setItem('users', JSON.stringify(users));
        }
      } catch (error) {
        console.error('Error saving users to AsyncStorage:', error);
      }
    };

    if (!isLoading) {
      saveUsers();
    }
  }, [users, isLoading]);

  // Save exhibits to AsyncStorage whenever it changes
  useEffect(() => {
    const saveExhibits = async () => {
      try {
        if (exhibits.length > 0) {
          await AsyncStorage.setItem('exhibits', JSON.stringify(exhibits));
        }
      } catch (error) {
        console.error('Error saving exhibits to AsyncStorage:', error);
      }
    };

    if (!isLoading) {
      saveExhibits();
    }
  }, [exhibits, isLoading]);

  // Save tours to AsyncStorage whenever it changes
  useEffect(() => {
    const saveTours = async () => {
      try {
        if (tours.length > 0) {
          await AsyncStorage.setItem('tours', JSON.stringify(tours));
        }
      } catch (error) {
        console.error('Error saving tours to AsyncStorage:', error);
      }
    };

    if (!isLoading) {
      saveTours();
    }
  }, [tours, isLoading]);

  // Save currentUser whenever it changes
  useEffect(() => {
    const saveCurrentUser = async () => {
      try {
        if (currentUser) {
          await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
          
          // Also update the user in the users array
          const updatedUsers = users.map(user => 
            user.id === currentUser.id ? currentUser : user
          );
          setUsers(updatedUsers);
        }
      } catch (error) {
        console.error('Error saving currentUser to AsyncStorage:', error);
      }
    };

    if (!isLoading && currentUser) {
      saveCurrentUser();
    }
  }, [currentUser, isLoading]);

  // Save isLoggedIn state whenever it changes
  useEffect(() => {
    const saveLoginState = async () => {
      try {
        await AsyncStorage.setItem('isLoggedIn', isLoggedIn.toString());
      } catch (error) {
        console.error('Error saving login state to AsyncStorage:', error);
      }
    };

    if (!isLoading) {
      saveLoginState();
    }
  }, [isLoggedIn, isLoading]);

  // Handle logout properly - sync currentUser with users array before logging out
  const handleLogout = () => {
    if (currentUser) {
      // Update the user in the users array before logging out
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? currentUser : user
      );
      setUsers(updatedUsers);
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        exhibits,
        setExhibits,
        tours,
        setTours,
        isLoading,
        handleLogout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};