import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { formatPrice } from '../utils/helpers';

/**
 * Crop Card Component for displaying crop information
 */
const CropCard = ({ crop, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: crop.image.url }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{crop.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {crop.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>
            {formatPrice(crop.price)}/{crop.unit}
          </Text>
          <Text style={styles.quantity}>{crop.quantity} available</Text>
        </View>
        {crop.farmer && (
          <Text style={styles.farmer}>By: {crop.farmer.name}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  quantity: {
    fontSize: 12,
    color: Colors.textLight,
  },
  farmer: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
});

export default CropCard;
