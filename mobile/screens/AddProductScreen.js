import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import Colors from '../constants/Colors';
import { api } from '../services/api';
import { uploadImageToCloudinary } from '../utils/helpers';

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      let finalImage = imageUrl;
      if (!finalImage) {
        // optionally upload via Cloudinary if you provide creds in helpers
        // finalImage = await uploadImageToCloudinary(localUri)
      }
      await api.post('/products', { name, description, price: Number(price), imageUrl: finalImage });
      Alert.alert('Success', 'Product added');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <InputField placeholder="Name" value={name} onChangeText={setName} />
      <InputField placeholder="Description" value={description} onChangeText={setDescription} />
      <InputField placeholder="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
      <InputField placeholder="Image URL (or integrate upload)" value={imageUrl} onChangeText={setImageUrl} autoCapitalize="none" />

      {submitting ? (
        <ActivityIndicator style={{ marginTop: 8 }} color={Colors.primary} />
      ) : (
        <PrimaryButton title="Submit" onPress={onSubmit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
});
