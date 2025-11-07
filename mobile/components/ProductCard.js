import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { formatPrice } from '../utils/helpers';

export default function ProductCard({ product, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image
        source={{ uri: product.imageUrl || 'https://via.placeholder.com/120x120.png?text=Crop' }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <View style={styles.metaRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{product?.farmerName || 'Farmer'}</Text></View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: { width: 110, height: 110 },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text },
  price: { fontSize: 16, fontWeight: '800', color: Colors.primary, marginTop: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  badge: { backgroundColor: Colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: Colors.primary, fontWeight: '700' },
});
