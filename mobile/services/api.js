import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - update to your backend. For Android emulator, use http://10.0.2.2:5000/api
// For physical device or Expo Go, use your computer's IP address
const API_BASE_URL = 'http://192.168.0.86:5000/api';

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
  (error) => Promise.reject(error)
);

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

// ===== PRODUCTS (formerly crops) =====
export const getAllProducts = (params) => api.get('/products', { params });
export const createProduct = (data) => api.post('/products', data);

// ===== CHAT API =====
export const getChatHistory = (userId) => api.get(`/chat/${userId}`);
export const sendMessage = (messageData) => api.post('/chat', messageData);
export const getConversations = () => api.get('/chat/conversations');
export const markAsRead = (userId) => api.put(`/chat/mark-read/${userId}`);

export default instance;
