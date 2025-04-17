// File: src/components/SmartAgentChat.js - With null check for currentUser

import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../AppContext';
import { useNavigation } from '@react-navigation/native';

const SmartAgentChat = () => {
  const navigation = useNavigation();
  const { exhibits, currentUser, isLoading } = useContext(AppContext);
  
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      text: "Welcome to the UAE Museum Assistant! I can help with information about exhibits, directions, or any questions you might have. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const flatListRef = useRef(null);
  
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);
  
  // Check if user data is available
  if (isLoading || !currentUser || !exhibits) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8C52FF" />
        <Text style={styles.loadingText}>Initializing assistant...</Text>
      </View>
    );
  }
  
  // Enhanced AI response generator that uses exhibit data from context
  const getAIResponse = (query) => {
    const msgLower = query.toLowerCase();
    
    // Check for exhibit-related queries
    if (msgLower.includes('exhibit') || msgLower.includes('display') || msgLower.includes('show')) {
      // If asking about specific exhibits by name
      for (const exhibit of exhibits) {
        if (msgLower.includes(exhibit.name.toLowerCase())) {
          return `"${exhibit.name}" is located in ${exhibit.location}. ${exhibit.description} It has a rating of ${exhibit.rating}/5.`;
        }
      }
      
      // If asking about categories
      const categories = [...new Set(exhibits.map(ex => ex.category))];
      for (const category of categories) {
        if (msgLower.includes(category.toLowerCase())) {
          const categoryExhibits = exhibits.filter(ex => ex.category === category);
          return `We have ${categoryExhibits.length} exhibits in the ${category} category, including ${categoryExhibits.map(ex => ex.name).join(", ")}.`;
        }
      }
      
      // General exhibit information
      return `Our museum features ${exhibits.length} exhibits across categories including ${[...new Set(exhibits.map(ex => ex.category))].join(", ")}. Some popular exhibits include ${exhibits.sort((a, b) => b.rating - a.rating).slice(0, 3).map(ex => ex.name).join(", ")}.`;
    }
    
    // Check for basic queries
    if (msgLower.includes('hello') || msgLower.includes('hi')) {
      return `Hello ${currentUser.name}! How can I help you today?`;
    } else if (msgLower.includes('opening') || msgLower.includes('hours')) {
      return "The museum is open daily from 9:00 AM to 6:00 PM, with extended hours until 8:00 PM on Thursdays and Fridays.";
    } else if (msgLower.includes('ticket') || msgLower.includes('price') || msgLower.includes('cost')) {
      return "General admission is 50 AED for adults, 25 AED for students, and free for children under 12 and seniors over 65.";
    } else if (msgLower.includes('location') || msgLower.includes('address') || msgLower.includes('where')) {
      return "The UAE Museum is located in the Cultural District, Downtown Abu Dhabi. The exact address is 123 Heritage Way, Abu Dhabi, UAE.";
    } else if (msgLower.includes('navigate') || msgLower.includes('find') || msgLower.includes('map')) {
      return "You can use our 3D Navigation feature to find your way around the museum. Would you like me to open the navigation screen for you?";
    } else if (msgLower.includes('crowd') || msgLower.includes('busy')) {
      return "You can check current crowd levels in our Crowd Monitoring section. Would you like me to open that for you?";
    } else if (msgLower.includes('tour') || msgLower.includes('plan')) {
      return "You can create or modify tours in our Tours section. Would you like me to help you create a new tour?";
    } else if (msgLower.includes('thank')) {
      return "You're welcome! Enjoy your visit to the UAE Museum. Let me know if you need anything else.";
    }
    
    // Default response
    return "I'm not sure I understand your question. You can ask me about exhibits, museum hours, ticket prices, or navigation help. How else can I assist you?";
  };
  
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
    setIsTyping(true);
    
    // Simulate AI response with a small delay
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(message),
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Handle navigation requests based on the last message
      if (message.toLowerCase().includes('navigate') || message.toLowerCase().includes('map')) {
        setTimeout(() => {
          navigation.navigate('Navigate');
        }, 1000);
      } else if (message.toLowerCase().includes('crowd') || message.toLowerCase().includes('busy')) {
        setTimeout(() => {
          navigation.navigate('Crowd');
        }, 1000);
      } else if (message.toLowerCase().includes('tour') && message.toLowerCase().includes('create')) {
        setTimeout(() => {
          navigation.navigate('Tours', { newTour: true });
        }, 1000);
      }
    }, 1500);
  };
  
  const renderChatItem = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.isUser ? styles.userBubble : styles.aiBubble
    ]}>
      {!item.isUser && (
        <View style={styles.agentAvatarContainer}>
          <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
        </View>
      )}
      <View style={[
        styles.messageContent,
        item.isUser ? styles.userMessageContent : styles.aiMessageContent
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          item.isUser ? styles.userTimestamp : styles.aiTimestamp
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
  
  // Quick reply suggestions
  const suggestions = [
    "What exhibits do you have?",
    "Where is the Pearl Diving exhibit?",
    "Show me Islamic Art exhibits",
    "Museum opening hours?",
    "How much are tickets?"
  ];
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={chatHistory}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {isTyping && (
        <View style={styles.typingIndicator}>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color="#8C52FF" />
            <Text style={styles.typingText}>Assistant is typing...</Text>
          </View>
        </View>
      )}
      
      {/* Quick suggestion chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsContainer}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.suggestionChip}
            onPress={() => setMessage(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
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
    backgroundColor: '#f7f7ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7ff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8C52FF',
    fontWeight: '500',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  agentAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8C52FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  messageContent: {
    padding: 12,
    borderRadius: 18,
  },
  userMessageContent: {
    backgroundColor: '#8C52FF',
    borderTopRightRadius: 4,
    marginLeft: 'auto',
  },
  aiMessageContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  userMessageText: {
    color: '#fff',
    fontSize: 16,
  },
  aiMessageText: {
    color: '#333',
    fontSize: 16,
  },
  messageText: {
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  aiTimestamp: {
    color: '#888',
  },
  typingIndicator: {
    padding: 8,
    marginLeft: 16,
    marginBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  typingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 12,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestionChip: {
    backgroundColor: 'rgba(140, 82, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(140, 82, 255, 0.2)',
  },
  suggestionText: {
    color: '#8C52FF',
    fontSize: 14,
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