import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getConversations } from '../services/api';
import Colors from '../constants/Colors';
import { formatDate } from '../utils/helpers';

export default function ChatListScreen({ navigation }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchConversations);
    return unsub;
  }, [navigation]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await getConversations();
      const data = res?.data?.data || res?.data || [];
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const otherUser = item.user;
    const isUnread = item.unreadCount > 0;

    return (
      <TouchableOpacity
        style={[styles.item, isUnread && styles.unreadItem]}
        onPress={() =>
          navigation.navigate('Chat', {
            farmerId: otherUser._id,
            farmerName: otherUser.name,
          })
        }
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{otherUser.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{otherUser.name}</Text>
            <Text style={styles.time}>{formatDate(item.lastMessageTime)}</Text>
          </View>
          <View style={styles.footer}>
            <Text style={[styles.message, isUnread && styles.unreadMessage]} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {isUnread && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No conversations yet.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  item: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  unreadItem: {
    backgroundColor: '#F0FDF4', // Light green bg for unread
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  time: {
    fontSize: 12,
    color: Colors.textLight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.textLight,
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: Colors.text,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.textLight,
  },
});
