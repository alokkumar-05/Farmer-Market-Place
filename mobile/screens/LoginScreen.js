import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Colors from '../constants/Colors';

/**
 * Login Screen Component
 */
const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle user login
   */
  const handleLogin = async () => {
    // Validate input fields
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      const response = await loginUser({ email, password });
      console.log('Login response received:', response.data?.success);
      
      // Backend returns { success: true, data: { user data with token } }
      const userData = response.data?.data || response.data;
      
      // Validate response data
      if (!userData || !userData.token) {
        throw new Error('Invalid response from server. Missing authentication token.');
      }
      
      console.log('Login successful for user:', userData.name);
      await login(userData);
      // Navigation will happen automatically via AuthContext change
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMsg = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with an error
        errorMsg = error.response.data?.message || 
                   `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        errorMsg = 'Cannot connect to server.\n\nPlease check:\n' +
                   '• Backend server is running\n' +
                   '• Your device is on the same WiFi\n' +
                   '• Check the Expo console for the API URL';
      } else if (error.message) {
        // Something else happened
        errorMsg = error.message;
      }
      
      Alert.alert('Login Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Farmer Marketplace</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <Button
            title="Don't have an account? Register"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: 8,
  },
});

export default LoginScreen;
