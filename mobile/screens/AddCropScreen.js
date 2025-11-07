import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createCrop } from '../services/api';
import { imageToBase64 } from '../utils/helpers';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Colors from '../constants/Colors';

const AddCropScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', quantity: '', unit: 'kg' });
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.quantity || !imageUri) {
      Alert.alert('Error', 'Please fill all fields and select an image');
      return;
    }

    setLoading(true);
    try {
      const imageBase64 = await imageToBase64(imageUri);
      await createCrop({ ...formData, price: parseFloat(formData.price), quantity: parseFloat(formData.quantity), imageBase64 });
      Alert.alert('Success', 'Crop added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add crop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add New Crop</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Tap to select crop image</Text>
        )}
      </TouchableOpacity>

      <InputField label="Crop Name *" value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} placeholder="e.g., Tomatoes" />
      <InputField label="Description *" value={formData.description} onChangeText={(text) => setFormData({ ...formData, description: text })} placeholder="Describe your crop" multiline />
      <InputField label="Price per unit *" value={formData.price} onChangeText={(text) => setFormData({ ...formData, price: text })} placeholder="e.g., 50" keyboardType="numeric" />
      <InputField label="Quantity Available *" value={formData.quantity} onChangeText={(text) => setFormData({ ...formData, quantity: text })} placeholder="e.g., 100" keyboardType="numeric" />

      <Button title="Add Crop" onPress={handleSubmit} loading={loading} />
      <Button title="Cancel" onPress={() => navigation.goBack()} variant="outline" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.primary, marginBottom: 20, textAlign: 'center' },
  imagePicker: { width: '100%', height: 200, backgroundColor: Colors.border, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePickerText: { color: Colors.textLight, fontSize: 16 },
});

export default AddCropScreen;
