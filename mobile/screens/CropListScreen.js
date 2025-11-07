import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getAllCrops } from '../services/api';
import CropCard from '../components/CropCard';
import Button from '../components/Button';
import Colors from '../constants/Colors';

const CropListScreen = ({ navigation }) => {
  const { user, logout, isFarmer } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const response = await getAllCrops({});
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCrops();
  };

  const handleCropPress = (crop) => {
    navigation.navigate('Chat', { farmerId: crop.farmer._id, farmerName: crop.farmer.name, cropId: crop._id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome, {user?.name}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {isFarmer && (
        <Button title="Add New Crop" onPress={() => navigation.navigate('AddCrop')} style={styles.addButton} />
      )}

      <FlatList
        data={crops}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CropCard crop={item} onPress={() => handleCropPress(item)} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        ListEmptyComponent={<Text style={styles.emptyText}>{loading ? 'Loading...' : 'No crops available'}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: Colors.white },
  headerTitle: { fontSize: 20, fontWeight: '600', color: Colors.text },
  logoutText: { color: Colors.error, fontWeight: '600' },
  addButton: { margin: 16, marginBottom: 8 },
  list: { padding: 16 },
  emptyText: { textAlign: 'center', color: Colors.textLight, marginTop: 50, fontSize: 16 },
});

export default CropListScreen;
