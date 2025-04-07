// File: src/components/SmartAgentChat.js - AI assistant interface

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock AI responses based on keywords
const getAIResponse = (message) => {
  const msgLower = message.toLowerCase();
  
  if (msgLower.includes('hello') || msgLower.includes('hi')) {
    return "Hello! I'm your museum guide assistant. How can I help you today?";
  } else if (msgLower.includes('exhibit') && (msgLower.includes('popular') || msgLower.includes('best'))) {
    return "Our most popular exhibits are 'Islamic Golden Age Innovations' and 'Calligraphy Through Centuries'. Both have ratings above 4.9!";
  } else if (msgLower.includes('pearl') || msgLower.includes('diving')) {
    return "The Pearl Diving Heritage exhibit showcases UAE's rich pearl diving tradition with historical equipment and interactive displays. It's located in the West Wing, Floor 1.";
  } else if (msgLower.includes('opening') || msgLower.includes('hours')) {
    return "The museum is open daily from 9:00 AM to 6:00 PM, with extended hours until 8:00 PM on Thursdays and Fridays.";
  } else if (msgLower.includes('ticket') || msgLower.includes('price') || msgLower.includes('cost')) {
    return "General admission is 50 AED for adults, 25 AED for students, and free for children under 12 and seniors over 65.";
  } else if (msgLower.includes('islamic') || msgLower.includes('art')) {
    return "We have several Islamic art exhibits, including 'Islamic Golden Age Innovations' and 'Calligraphy Through Centuries'. Both are located in the East Wing on Floor 2.";
  } else {
    return "I'm not sure about that, but I'd be happy to help you find what you're looking for. You can ask me about exhibits, locations, opening hours, or tickets.";
  }
};

const SmartAgentChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      text: "Welcome to the UAE Museum Assistant! I can help with information about exhibits, directions, or any questions you might have. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  
  const flatListRef = useRef(null);
  
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);
  
  const handleSend = () => {
    if (message.trim() === '') return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate AI response with a small delay
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(message),
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };
  
  const renderChatItem = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.isUser ? styles.userBubble : styles.aiBubble
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={chatHistory}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask about exhibits, locations..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() ? styles.sendButtonDisabled : null]} 
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons name="send" size={24} color={!message.trim() ? "#ccc" : "#fff"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#8C52FF',
    borderTopRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  messageText: {
    fontSize: 16,
    color: props => props.isUser ? '#fff' : '#333',
  },
  timestamp: {
    fontSize: 10,
    color: props => props.isUser ? 'rgba(255,255,255,0.7)' : '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#8C52FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
});

export default SmartAgentChat;