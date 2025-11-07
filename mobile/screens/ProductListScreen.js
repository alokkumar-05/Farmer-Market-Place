import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import Colors from '../constants/Colors';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProductListScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      const data = res?.data ?? res;
      setProducts(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchProducts);
    return unsub;
  }, [navigation]);

  const onCardPress = (item) => {
    navigation.navigate('Chat', {
      farmerId: item.farmerId || item.farmer?._id || item.ownerId,
      farmerName: item.farmerName || item.farmer?.name || 'Farmer',
      cropId: item._id || item.id,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id?.toString() || item._id?.toString() || Math.random().toString()}
          renderItem={({ item }) => <ProductCard product={item} onPress={() => onCardPress(item)} />}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {user?.role === 'farmer' && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddProduct')}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 30, lineHeight: 34, fontWeight: '800' },
});
