// components/smart-agent/ChatInterface.js

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

import Typography from '../ui/Typography';

const ChatInterface = ({
  messages = [],
  onSendMessage,
  isLoading = false,
}) => {
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  const handleSend = () => {
    if (input.trim() && onSendMessage) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View 
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.agentMessageContainer
        ]}
      >
        <View 
          style={[
            styles.messageBubble,
            isUser ? styles.userMessageBubble : styles.agentMessageBubble,
          ]}
        >
          <Typography 
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.agentMessageText
            ]}
          >
            {item.text}
          </Typography>
          
          <Typography 
            variant="caption" 
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.agentTimestamp
            ]}
          >
            {item.timestamp}
          </Typography>
        </View>
      </View>
    );
  };
  
  const renderSuggestions = () => {
    // Predefined suggestions for quick interactions
    const suggestions = [
      "Where is the Ancient Egypt exhibit?",
      "Tell me about Islamic Art",
      "What are the museum hours?",
      "Recommend popular exhibits"
    ];
    
    return (
      <View style={styles.suggestionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionBubble}
              onPress={() => {
                if (onSendMessage) {
                  onSendMessage(suggestion);
                }
              }}
            >
              <Typography variant="caption">{suggestion}</Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `msg-${index}`}
        contentContainerStyle={styles.messagesContainer}
      />
      
      {messages.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <Typography variant="h3" align="center">
            Museum Smart Guide
          </Typography>
          <Typography variant="body" align="center" style={styles.emptyStateText}>
            Ask me anything about exhibits, navigation, or museum information!
          </Typography>
          {renderSuggestions()}
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about exhibits or navigation..."
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (!input.trim() || isLoading) && styles.disabledButton
          ]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.background} size="small" />
          ) : (
            <Typography variant="body" color="white">
              Send
            </Typography>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesContainer: {
    padding: SIZES.md,
    paddingBottom: SIZES.xl,
  },
  messageContainer: {
    marginBottom: SIZES.md,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  agentMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: SIZES.md,
    borderRadius: SIZES.borderRadius,
    ...SHADOWS.small,
  },
  userMessageBubble: {
    backgroundColor: COLORS.primary,
  },
  agentMessageBubble: {
    backgroundColor: COLORS.card,
  },
  messageText: {
    fontSize: SIZES.md,
  },
  userMessageText: {
    color: COLORS.background,
  },
  agentMessageText: {
    color: COLORS.text,
  },
  timestamp: {
    marginTop: SIZES.xs,
    textAlign: 'right',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  agentTimestamp: {
    color: COLORS.textLight,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  emptyStateText: {
    marginTop: SIZES.md,
    marginBottom: SIZES.xl,
    textAlign: 'center',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SIZES.md,
  },
  suggestionBubble: {
    backgroundColor: COLORS.card,
    padding: SIZES.sm,
    borderRadius: SIZES.borderRadius,
    margin: SIZES.xs,
    ...SHADOWS.small,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: SIZES.sm,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.textLight,
  },
});

export default ChatInterface;