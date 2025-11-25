import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ProductListScreen from '../screens/ProductListScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BuyerDashboardScreen from '../screens/BuyerDashboardScreen';
import FarmerDashboardScreen from '../screens/FarmerDashboardScreen';
import Colors from '../constants/Colors';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function FeedStack({ role }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { color: Colors.primary, fontWeight: '700' },
      }}
    >
      {role === 'farmer' ? (
        <Stack.Screen name="FarmerDashboard" component={FarmerDashboardScreen} options={{ title: 'My Products' }} />
      ) : (
        <Stack.Screen name="BuyerDashboard" component={BuyerDashboardScreen} options={{ title: 'Marketplace' }} />
      )}
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Marketplace' }} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Add Product' }} />
      <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Messages' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="PublicProfile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();
  const role = user?.role;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#777',
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen
        name="Feed"
        children={() => <FeedStack role={role} />}
        options={{
          tabBarLabel: role === 'farmer' ? 'My Products' : 'Feed',
          tabBarIcon: ({ color }) => <Text style={{ color }}>{role === 'farmer' ? '📦' : '🏪'}</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
