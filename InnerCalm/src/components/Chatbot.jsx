import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, X } from 'lucide-react';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm InnerCalm Bot. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Crisis keywords that will trigger the emergency response
  const crisisKeywords = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 
    'self-harm', 'self harm', 'cutting', 'harm myself',
    'abuse', 'abused', 'abusive', 'domestic violence'
  ];

  // Emergency response message for crisis situations
  const getCrisisResponse = () => {
    const therapistNumber = localStorage.getItem('therapistNumber') || '1234567890';
    return `You are not alone. We are here to support you, and your life is worth everything. 
  
Connect directly with our therapists: [https://wa.me/${therapistNumber}](https://wa.me/${therapistNumber})`;
  };

  // Regular chatbot responses based on keywords
  const botResponses = [
    {
      keywords: ['hello', 'hi', 'hey', 'greetings'],
      responses: ["Hi there! How are you feeling today?", "Hello! What's on your mind?", "Hey there! How can I support you today?"]
    },
    {
      keywords: ['sad', 'unhappy', 'depressed', 'down', 'feeling low'],
      responses: ["I'm sorry to hear you're feeling that way. Would you like to talk about what's bothering you?", 
        "It's okay to feel sad sometimes. Would you like some suggestions to help improve your mood?",
        "I understand feeling down can be difficult. Remember that emotions are temporary and things can get better."]
    },
    {
      keywords: ['anxious', 'anxiety', 'nervous', 'worried', 'stress', 'stressed'],
      responses: ["Anxiety can be challenging. Have you tried any breathing exercises?", 
        "When you're feeling anxious, it might help to focus on what's within your control.",
        "Would you like to learn some grounding techniques that can help with anxiety?"]
    },
    {
      keywords: ['happy', 'good', 'great', 'excellent', 'amazing'],
      responses: ["That's wonderful to hear! What's made your day so positive?", 
        "I'm glad you're feeling good! It's important to acknowledge positive emotions too.",
        "That's great! Would you like to share what's contributing to your happiness?"]
    },
    {
      keywords: ['tired', 'exhausted', 'fatigued', 'no energy'],
      responses: ["Rest is important. Make sure you're getting enough sleep and taking breaks when needed.", 
        "Being tired can affect our mental wellbeing. Would you like some tips for better sleep?",
        "Mental fatigue is just as real as physical fatigue. Be gentle with yourself."]
    },
    {
      keywords: ['meditation', 'meditate', 'mindfulness'],
      responses: ["Meditation can be a powerful tool for mental health. Would you like some beginner tips?", 
        "Mindfulness practices can help bring a sense of calm. Have you tried any specific techniques?",
        "Even just a few minutes of meditation daily can make a difference to your wellbeing."]
    },
    {
      keywords: ['exercise', 'workout', 'physical activity'],
      responses: ["Exercise is great for mental health! Even a short walk can help boost your mood.", 
        "Physical activity releases endorphins which can help improve your mental state.",
        "Finding an exercise you enjoy can make it easier to maintain as a habit."]
    },
    {
      keywords: ['thank', 'thanks', 'helpful'],
      responses: ["You're welcome! I'm here anytime you need to talk.", 
        "I'm glad I could help. Remember, I'm here whenever you need support.",
        "It's my pleasure. Don't hesitate to reach out again if you need to talk."]
    }
  ];

  // Default responses when no keyword matches
  const defaultResponses = [
    "I'm here to listen. Could you tell me more about that?",
    "Thank you for sharing. How does that make you feel?",
    "I'm listening. Would you like to talk more about this?",
    "I appreciate you opening up. Is there anything specific you'd like support with?",
    "I'm here to support you. What would be most helpful for you right now?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Check for crisis keywords
    const messageContainsCrisisKeyword = crisisKeywords.some(keyword => 
      inputValue.toLowerCase().includes(keyword.toLowerCase())
    );

    if (messageContainsCrisisKeyword) {
      // Add crisis response after a short delay
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: getCrisisResponse(),
          sender: 'bot',
          timestamp: new Date(),
          isEmergencyResponse: true
        }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    // Try to match with regular responses
    let matched = false;
    
    // Check each response category
    for (const category of botResponses) {
      if (category.keywords.some(keyword => inputValue.toLowerCase().includes(keyword.toLowerCase()))) {
        // Randomly select a response from matching category
        const randomIndex = Math.floor(Math.random() * category.responses.length);
        const botReply = category.responses[randomIndex];
        matched = true;
        
        // Add bot response
        const botMessage = {
          id: messages.length + 2,
          text: botReply,
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false);
        break;
      }
    }
    
    // Use default response if no match found
    if (!matched) {
      const randomIndex = Math.floor(Math.random() * defaultResponses.length);
      const botReply = defaultResponses[randomIndex];
      
      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        text: botReply,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Function to parse Markdown links in messages
  const parseMessage = (text) => {
    // Regex to match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    // Split the text by markdown links
    const parts = text.split(linkRegex);
    
    if (parts.length === 1) {
      // No links found, return the text with line breaks converted to <br>
      return text.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    }
    
    // Reconstruct the text with actual links
    const result = [];
    let i = 0;
    
    // This regex is used to extract link parts (linkText and URL)
    const extractLinkParts = text.match(linkRegex);
    
    if (extractLinkParts) {
      let currentTextIndex = 0;
      
      extractLinkParts.forEach((linkMatch, index) => {
        // Find the position of the current link in the original text
        const linkIndex = text.indexOf(linkMatch, currentTextIndex);
        
        // Add the text before the link
        if (linkIndex > currentTextIndex) {
          const beforeText = text.substring(currentTextIndex, linkIndex);
          result.push(
            <React.Fragment key={`text-${index}`}>
              {beforeText.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < beforeText.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }
        
        // Extract link text and URL using regex
        const linkParts = /\[([^\]]+)\]\(([^)]+)\)/.exec(linkMatch);
        if (linkParts) {
          const [, linkText, url] = linkParts;
          // Add the link component
          result.push(
            <a 
              key={`link-${index}`} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline font-medium"
            >
              {linkText}
            </a>
          );
        }
        
        // Update the current position in the text
        currentTextIndex = linkIndex + linkMatch.length;
      });
      
      // Add any remaining text after the last link
      if (currentTextIndex < text.length) {
        const afterText = text.substring(currentTextIndex);
        result.push(
          <React.Fragment key="text-last">
            {afterText.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < afterText.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      }
    }
    
    return result;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 bg-gray-50 flex flex-col max-w-4xl mx-auto w-full p-2 sm:p-4">
        <div className="bg-white rounded-2xl shadow-md flex-1 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="bg-emerald-600 text-white p-3 sm:p-4 flex items-center">
            <div className="bg-white p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
              <Bot size={20} className="text-emerald-600 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-base sm:text-lg">InnerCalm Bot</h2>
              <p className="text-xs text-emerald-100">Here to support your mental wellbeing</p>
            </div>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                      message.sender === 'user'
                        ? 'bg-emerald-500 text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <div className="text-sm break-words">
                      {parseMessage(message.text)}
                    </div>
                    <div
                      className={`text-[10px] sm:text-xs mt-1 ${
                        message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }} 
            className="border-t border-gray-200 p-2 sm:p-4"
          >
            <div className="flex rounded-full bg-gray-100 px-3 sm:px-4 py-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                className={`ml-2 rounded-full p-1 ${
                  isTyping || inputValue.trim() === ''
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
                disabled={isTyping || inputValue.trim() === ''}
              >
                <Send size={16} className="m-1 sm:m-1.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
