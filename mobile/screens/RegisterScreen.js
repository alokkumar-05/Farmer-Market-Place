import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Colors from '../constants/Colors';

const RegisterScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    phone: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Email, Password)');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting registration for:', formData.email);
      const response = await registerUser(formData);
      console.log('Registration response received:', response.data?.success);
      
      // Backend returns { success: true, data: { user data with token } }
      const userData = response.data?.data || response.data;
      
      // Validate response data
      if (!userData || !userData.token) {
        throw new Error('Invalid response from server. Missing authentication token.');
      }
      
      console.log('Registration successful for user:', userData.name);
      await login(userData);
      // Navigation will happen automatically via AuthContext change
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMsg = 'Registration failed. Please try again.';
      
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
      
      Alert.alert('Registration Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>
        
        <InputField label="Name *" value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} placeholder="Enter your name" />
        <InputField label="Email *" value={formData.email} onChangeText={(text) => setFormData({ ...formData, email: text })} placeholder="Enter your email" keyboardType="email-address" />
        <InputField label="Password *" value={formData.password} onChangeText={(text) => setFormData({ ...formData, password: text })} placeholder="Enter password" secureTextEntry />
        <InputField label="Phone" value={formData.phone} onChangeText={(text) => setFormData({ ...formData, phone: text })} placeholder="Enter phone number" keyboardType="phone-pad" />
        <InputField label="Location" value={formData.location} onChangeText={(text) => setFormData({ ...formData, location: text })} placeholder="Enter your location" />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Role *</Text>
          <Picker selectedValue={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })} style={styles.picker}>
            <Picker.Item label="Buyer" value="buyer" />
            <Picker.Item label="Farmer" value="farmer" />
          </Picker>
        </View>

        <Button title="Register" onPress={handleRegister} loading={loading} style={styles.registerButton} />
        <Button title="Already have an account? Login" onPress={() => navigation.navigate('Login')} variant="outline" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.primary, marginBottom: 24, textAlign: 'center' },
  pickerContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  picker: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 8 },
  registerButton: { marginTop: 8 },
});

export default RegisterScreen;
