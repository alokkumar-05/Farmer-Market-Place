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
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser(formData);
      // Backend returns { success: true, data: { user data with token } }
      await login(response.data.data);
      Alert.alert('Success', 'Registration successful!');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'Registration failed');
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
