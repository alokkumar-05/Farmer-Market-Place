import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductCard = ({
  product,
  image,
  name,
  description,
  prices = {},
  farmerName,
  availability,
  userRole, // 'farmer' or 'buyer'
  onConnect, // for buyer
  onEdit,    // for farmer
  onDelete,  // for farmer
  onPress    // general press
}) => {
  // Fallback to product object if individual props are missing
  const item = product || {};
  const img = image || item.imageUrl || item.image?.url || 'https://via.placeholder.com/160';
  const title = name || item.name || 'Unnamed';
  const desc = description || item.description || '';
  const farmer = farmerName || item.farmerName || item.farmer?.name || 'Farmer';
  const p20 = prices.price20 || item.price20kg || item.price20 || item.price;
  const p50 = prices.price50 || item.price50kg || item.price50;
  const p100 = prices.price100 || item.price100kg || item.price100;
  const unit = item.unit || 'kg';
  const avail = availability || `${item.quantity || 0} ${unit} available`;

  // Determine role if not passed explicitly, though it should be passed
  const role = userRole || (onEdit ? 'farmer' : 'buyer');
  const { price20, price50, price100 } = prices;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: img }}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {desc}
        </Text>

        <View style={styles.farmerInfo}>
          <View style={styles.farmerBadge}>
            <Text style={styles.farmerText}>👤 {farmer}</Text>
          </View>
        </View>

        <View style={styles.priceList}>
          {p20 && (
            <Text style={styles.priceItem}>
              20 kg: <Text style={styles.priceValue}>₹{Number(p20).toLocaleString('en-IN')}</Text>
            </Text>
          )}
          {p50 && (
            <Text style={styles.priceItem}>
              50 kg: <Text style={styles.priceValue}>₹{Number(p50).toLocaleString('en-IN')}</Text>
            </Text>
          )}
          {p100 && (
            <Text style={styles.priceItem}>
              100 kg: <Text style={styles.priceValue}>₹{Number(p100).toLocaleString('en-IN')}</Text>
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.availability}>{avail}</Text>

          <View style={styles.actions}>
            {role === 'buyer' && (
              <TouchableOpacity style={styles.iconBtn} onPress={onConnect}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#2e7d32" />
              </TouchableOpacity>
            )}

            {role === 'farmer' && (
              <>
                <TouchableOpacity style={styles.iconBtn} onPress={onEdit}>
                  <Ionicons name="pencil-outline" size={20} color="#2e7d32" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, styles.deleteBtn]} onPress={onDelete}>
                  <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f4f4f4',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  farmerInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  farmerBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  farmerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2e7d32',
  },
  priceList: {
    gap: 2,
  },
  priceItem: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  priceValue: {
    fontWeight: '700',
    color: '#2e7d32',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  availability: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: '#ffebee',
  },
});

export default ProductCard;
