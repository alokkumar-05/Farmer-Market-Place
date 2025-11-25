import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import Colors from '../constants/Colors';
import { createCrop, updateCrop } from '../services/api';

export default function AddProductScreen({ navigation, route }) {
  const productToEdit = route.params?.product;
  const isEdit = !!productToEdit;

  const [name, setName] = useState(productToEdit?.name || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [price20, setPrice20] = useState(productToEdit?.price20kg?.toString() || productToEdit?.price20?.toString() || productToEdit?.price?.toString() || '');
  const [price50, setPrice50] = useState(productToEdit?.price50kg?.toString() || productToEdit?.price50?.toString() || '');
  const [price100, setPrice100] = useState(productToEdit?.price100kg?.toString() || productToEdit?.price100?.toString() || '');
  const [quantity, setQuantity] = useState(productToEdit?.quantity?.toString() || '');

  // New fields
  const [unit, setUnit] = useState(productToEdit?.unit || 'kg');
  const [category, setCategory] = useState(productToEdit?.category || 'vegetables');
  const [imageUri, setImageUri] = useState(productToEdit?.imageUrl || productToEdit?.image?.url || null);
  const [imageBase64, setImageBase64] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Edit Product' : 'Add Product',
    });
  }, [navigation, isEdit]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const onSubmit = async () => {
    if (!name || !description || !price20 || !quantity) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!isEdit && !imageBase64) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    setSubmitting(true);
    try {
      const p20 = Number(price20);
      const p50 = price50 ? Number(price50) : null;
      const p100 = price100 ? Number(price100) : null;

      const payload = {
        name,
        description,
        price: p20,
        price20kg: p20,
        price50kg: p50,
        price100kg: p100,
        quantity: Number(quantity),
        unit,
        category,
      };

      if (imageBase64) {
        payload.imageBase64 = imageBase64;
      }

      if (isEdit) {
        await updateCrop(productToEdit._id, payload);
        Alert.alert('Success', 'Product updated');
      } else {
        await createCrop(payload);
        Alert.alert('Success', 'Product added');
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name *</Text>
      <InputField placeholder="e.g. Fresh Tomatoes" value={name} onChangeText={setName} />

      <Text style={styles.label}>Description *</Text>
      <InputField placeholder="Short description" value={description} onChangeText={setDescription} multiline numberOfLines={3} textAlignVertical="top" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Vegetables" value="vegetables" />
          <Picker.Item label="Fruits" value="fruits" />
          <Picker.Item label="Grains" value="grains" />
          <Picker.Item label="Pulses" value="pulses" />
          <Picker.Item label="Spices" value="spices" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <Text style={styles.label}>Unit</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={unit}
          onValueChange={(itemValue) => setUnit(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="kg" value="kg" />
          <Picker.Item label="litre" value="litre" />
          <Picker.Item label="dozen" value="dozen" />
        </Picker>
      </View>

      <Text style={styles.label}>Price for 20 {unit} *</Text>
      <InputField placeholder={`Price for 20 ${unit}`} value={price20} onChangeText={setPrice20} keyboardType="decimal-pad" />

      <Text style={styles.label}>Price for 50 {unit}</Text>
      <InputField placeholder={`Price for 50 ${unit}`} value={price50} onChangeText={setPrice50} keyboardType="decimal-pad" />

      <Text style={styles.label}>Price for 100 {unit}</Text>
      <InputField placeholder={`Price for 100 ${unit}`} value={price100} onChangeText={setPrice100} keyboardType="decimal-pad" />

      <Text style={styles.label}>Quantity Available ({unit}) *</Text>
      <InputField placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="number-pad" />

      <Text style={styles.label}>Product Image *</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Tap to select image</Text>
          </View>
        )}
      </TouchableOpacity>

      {submitting ? (
        <ActivityIndicator style={{ marginTop: 20 }} color={Colors.primary} size="large" />
      ) : (
        <PrimaryButton title={isEdit ? 'Update Product' : 'Add Product'} onPress={onSubmit} style={{ marginTop: 20 }} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: Colors.background },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  imagePicker: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: '#888',
    fontSize: 16,
  },
});
