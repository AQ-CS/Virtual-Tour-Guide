// app/smart-agent/index.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

import ChatInterface from '../../components/smart-agent/ChatInterface';

export default function SmartAgent() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Welcome message when the screen loads
  useEffect(() => {
    // Add a welcome message from the bot
    setMessages([
      {
        id: 'welcome',
        text: "Hello! I'm your UAE Museum Smart Guide. I can help you find exhibits, navigate the museum, or provide information about our collections. What would you like to know?",
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, []);

  const handleSendMessage = (text) => {
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      generateResponse(text);
      setLoading(false);
    }, 1000);
  };

  // Mock response generation - in a real app this would call an AI service
  const generateResponse = (userInput) => {
    let responseText = '';
    const userInputLower = userInput.toLowerCase();
    
    // Simple keyword matching for demo purposes
    if (userInputLower.includes('islamic art') || userInputLower.includes('calligraphy')) {
      responseText = "Our Islamic Art collection is located in the east wing, Gallery 3. It features beautiful calligraphy, geometric patterns, and artifacts from the 9th to 19th centuries. Would you like directions to this gallery?";
    } 
    else if (userInputLower.includes('hours') || userInputLower.includes('open')) {
      responseText = "The UAE Museum is open Sunday through Thursday from 9:00 AM to 8:00 PM, and Friday to Saturday from 10:00 AM to 10:00 PM. Last entry is one hour before closing.";
    }
    else if (userInputLower.includes('ticket') || userInputLower.includes('price') || userInputLower.includes('cost')) {
      responseText = "General admission tickets are 60 AED for adults, 30 AED for students, and free for children under 12 and UAE residents with ID. Special exhibitions may have additional fees.";
    }
    else if (userInputLower.includes('popular') || userInputLower.includes('recommend')) {
      responseText = "Our most popular exhibits include the Pearl Diving Heritage display, the Sheikh Zayed Memorial Gallery, and our rotating Contemporary Emirati Artists exhibition. The Desert Life diorama is especially popular with families.";
    }
    else if (userInputLower.includes('navigation') || userInputLower.includes('lost') || userInputLower.includes('where')) {
      responseText = "You can use our 3D navigation feature to find your way around the museum. Would you like me to open the interactive map for you?";
    }
    else {
      responseText = "That's an interesting question. While I'm still learning about all the museum's collections, I can help you find information about exhibits, opening hours, ticket prices, or help you navigate the museum. Could you clarify what you'd like to know?";
    }
    
    // Add bot response to chat
    const botMessage = {
      id: `response-${Date.now().toString()}`,
      text: responseText,
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prevMessages => [...prevMessages, botMessage]);
  };

  return (
    <View style={styles.container}>
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});