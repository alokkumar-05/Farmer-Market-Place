import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeSocket, disconnectSocket } from '../services/socket';

/**
 * Authentication Context
 * Manages user authentication state across the app
 */
const AuthContext = createContext();

/**
 * Auth Provider Component
 * Wraps the app to provide authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load user data from AsyncStorage on app start
   */
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  /**
   * Load stored user data and token
   */
  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('userToken');

      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Initialize socket connection
        initializeSocket(parsedUser._id);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user and save to AsyncStorage
   * @param {Object} userData - User data from API
   */
  const login = async (userData) => {
    try {
      if (!userData || !userData.token) {
        throw new Error('Invalid user data: token is missing');
      }
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('userToken', userData.token);
      setUser(userData);
      // Initialize socket connection
      initializeSocket(userData._id);
    } catch (error) {
      console.error('Error saving user to storage:', error);
      throw error;
    }
  };

  /**
   * Logout user and clear AsyncStorage
   */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userToken');
      setUser(null);
      // Disconnect socket
      disconnectSocket();
    } catch (error) {
      console.error('Error clearing user from storage:', error);
      throw error;
    }
  };

  /**
   * Update user data in state and storage
   * @param {Object} updatedData - Updated user data
   */
  const updateUser = async (updatedData) => {
    try {
      if (!updatedData || !updatedData.token) {
        throw new Error('Invalid user data: token is missing');
      }
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      await AsyncStorage.setItem('userToken', updatedData.token);
      setUser(updatedData);
    } catch (error) {
      console.error('Error updating user in storage:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isFarmer: user?.role === 'farmer',
    isBuyer: user?.role === 'buyer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 * @returns {Object} - Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
