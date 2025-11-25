import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import ProductCard from '../components/ProductCard';
import { getAllCrops } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BuyerDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchAll);
    navigation.setOptions({
      title: 'Marketplace',
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('ChatList')} style={{ paddingHorizontal: 12 }}>
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

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await getAllCrops();
      const payload = res?.data?.data || res?.data || res;
      const arr = Array.isArray(payload) ? payload : [];
      const normalized = arr.map((it) => ({ ...it, imageUrl: it.imageUrl || it.image?.url, farmerName: it.farmer?.name }));
      setItems(normalized);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const onCardPress = (item) => {
    navigation.navigate('Chat', {
      farmerId: item.farmer?._id,
      farmerName: item.farmer?.name || 'Farmer',
      cropId: item._id,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id?.toString() || item._id?.toString() || Math.random().toString()}
          renderItem={({ item }) => <ProductCard product={item} isFarmer={false} onPress={() => onCardPress(item)} />}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
});
