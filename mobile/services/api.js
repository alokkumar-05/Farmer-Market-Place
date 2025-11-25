import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Resolve Base API URL dynamically in development so it works on emulator and devices
const getDevApiBaseURL = () => {
  // When running with Expo Go on a physical device, hostUri contains the IP address
  // Format: "192.168.x.x:8081" or "192.168.x.x:19000"
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri;

  if (hostUri) {
    const host = hostUri.split(':').shift();
    const apiUrl = `http://${host}:5000/api`;
    console.log('📍 Using Expo hostUri for API:', apiUrl);
    return apiUrl;
  }

  // Fallbacks for emulators/simulators
  if (Platform.OS === 'android') {
    console.log('📍 Using Android emulator localhost (10.0.2.2)');
    return 'http://10.0.2.2:5000/api';
  } else if (Platform.OS === 'ios') {
    console.log('📍 Using iOS simulator localhost');
    return 'http://localhost:5000/api';
  }

  // Default fallback
  console.log('📍 Using default localhost');
  return 'http://localhost:5000/api';
};

// In production, set API_BASE_URL via env or keep the dev resolver as a safe default
const API_BASE_URL = __DEV__
  ? getDevApiBaseURL()
  : (process.env.API_BASE_URL || getDevApiBaseURL());

// Axios instance
const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach token from AsyncStorage
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Keep full response so callers can use res.data consistently
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    if (error.response) {
      // Server responded with error
      console.error('❌ API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('❌ API No Response - Check if backend is running at:', API_BASE_URL);
      console.error('❌ Network Error:', error.message);
      console.error('💡 Make sure:');
      console.error('   1. Backend server is running (npm start in backend folder)');
      console.error('   2. Your phone/device is on the same WiFi network');
      console.error('   3. Firewall is not blocking port 5000');
      // Enhance error message for better user feedback
      error.message = 'Cannot connect to server. Make sure backend is running and your device is on the same network.';
    } else {
      console.error('❌ API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Log API base URL on app start
console.log('📡 API Base URL:', API_BASE_URL);

export const api = instance;
export const setAuthToken = (token) => {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete instance.defaults.headers.common['Authorization'];
};

// ===== AUTH API =====
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const getUserProfile = () => api.get('/auth/profile');
export const updateUserProfile = (userData) => api.put('/auth/profile', userData);

// ===== CROPS =====
export const getAllCrops = (params) => api.get('/crops', { params });
export const getMyCrops = () => api.get('/crops/my-crops');
export const createCrop = (data) => api.post('/crops', data);
export const updateCrop = (id, data) => api.put(`/crops/${id}`, data);
export const deleteCrop = (id) => api.delete(`/crops/${id}`);

// ===== CHAT API =====
export const getChatHistory = (userId) => api.get(`/chat/${userId}`);
export const sendMessage = (messageData) => api.post('/chat', messageData);
export const getConversations = () => api.get('/chat/conversations');
export const markAsRead = (userId) => api.put(`/chat/mark-read/${userId}`);

export default instance;
