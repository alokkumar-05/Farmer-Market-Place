import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Text, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import ProductCard from '../components/ProductCard';
import { getMyCrops } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FarmerDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchMine);
    // Header: chat button and profile chip
    navigation.setOptions({
      title: 'My Products',
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('Chat')} style={{ paddingHorizontal: 12 }}>
          <Text style={{ fontSize: 18 }}>💬</Text>
        </Pressable>
      ),
      headerTitle: () => (
        <Pressable onPress={() => navigation.navigate('Profile')} style={{ alignItems: 'flex-start' }}>
          <Text style={{ color: Colors.primary, fontWeight: '800' }}>{user?.name || 'User'}</Text>
          <Text style={{ color: Colors.textLight, fontSize: 12 }}>{(user?.role || '').toUpperCase()}</Text>
        </Pressable>
      ),
    });
    return unsub;
  }, [navigation, user]);

  const fetchMine = async () => {
    setLoading(true);
    try {
      const res = await getMyCrops();
      const payload = res?.data?.data || res?.data || res;
      const arr = Array.isArray(payload) ? payload : [];
      const normalized = arr.map((it) => ({ ...it, imageUrl: it.imageUrl || it.image?.url, farmerName: user?.name }));
      setItems(normalized);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id?.toString() || item._id?.toString() || Math.random().toString()}
          renderItem={({ item }) => <ProductCard product={item} onPress={() => {}} />}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddProduct')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
