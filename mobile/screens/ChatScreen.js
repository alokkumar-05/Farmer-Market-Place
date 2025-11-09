import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getChatHistory } from '../services/api';
import { sendSocketMessage, onReceiveMessage, emitTyping, emitStopTyping, onUserTyping, onUserStoppedTyping } from '../services/socket';
import ChatBubble from '../components/ChatBubble';
import Colors from '../constants/Colors';

const ChatScreen = ({ route, navigation }) => {
  const { farmerId, farmerName, cropId } = route?.params || {};
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (farmerId) fetchMessages();
    setupSocketListener();
    navigation.setOptions({ title: farmerName ? `Chat with ${farmerName}` : 'Chat' });
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await getChatHistory(farmerId);
      // Handle backend response format { success: true, data: [...] }
      const messages = response.data?.data || response.data || [];
      setMessages(Array.isArray(messages) ? messages : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const setupSocketListener = () => {
    onReceiveMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });
    onUserTyping(({ senderId, receiverId }) => {
      if (farmerId && senderId === farmerId) setIsTyping(true);
    });
    onUserStoppedTyping(({ senderId, receiverId }) => {
      if (farmerId && senderId === farmerId) setIsTyping(false);
    });
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    if (!farmerId) return; // require a receiver to send

    const messageData = {
      senderId: user._id,
      receiverId: farmerId,
      message: inputText.trim(),
      cropId: cropId || null,
    };

    sendSocketMessage(messageData);

    // Optimistically add message to list
    const tempMessage = {
      _id: Date.now().toString(),
      sender: { _id: user._id },
      message: inputText.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setInputText('');
    emitStopTyping(user._id, farmerId);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <ChatBubble message={item} isCurrentUser={item.sender._id === user._id || item.sender === user._id} />
        )}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {isTyping ? <Text style={styles.typing}>Typing...</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={(t) => {
            setInputText(t);
            if (t && t.trim().length > 0) emitTyping(user._id, farmerId);
            else emitStopTyping(user._id, farmerId);
          }}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textLight}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  messageList: { padding: 8, paddingBottom: 16 },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  input: { flex: 1, backgroundColor: Colors.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, maxHeight: 100, color: Colors.text },
  sendButton: { backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'center' },
  sendButtonText: { color: Colors.white, fontWeight: '600' },
  typing: { color: Colors.textLight, marginLeft: 12, marginBottom: 4 },
});

export default ChatScreen;
