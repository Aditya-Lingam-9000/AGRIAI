// src/pages/Assistant.jsx
import { useState, useRef, useEffect } from 'react';
import Button from '../components/ui/Button';
import './Assistant.css';

const quickQuestions = [
  'Which fertilizer is used for paddy?',
  'How long does cotton take to grow?',
  'What is the water requirement?',
  'How much does maize farming cost?',
];

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! 👋 I'm your AI farming assistant. Ask me anything about crops, fertilizers, water management, or farming practices!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (question = input) => {
    if (!question.trim()) return;

    const userMessage = { type: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      
      const botMessage = { 
        type: 'bot', 
        text: data.answer || "I couldn't understand that. Please try again." 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: "Sorry, I'm having trouble connecting. Please try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="assistant-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">🤖</span>
          AI Assistant
        </h1>
        <p className="page-subtitle">Get instant answers to your farming questions</p>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        {/* Messages */}
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message message-${message.type}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="message-avatar">
                {message.type === 'bot' ? '🤖' : '👤'}
              </div>
              <div className="message-content">
                <span className="message-text">{message.text}</span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message message-bot">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="quick-questions">
          <span className="quick-label">Quick questions:</span>
          <div className="quick-buttons">
            {quickQuestions.map((q, index) => (
              <button 
                key={index}
                className="quick-btn"
                onClick={() => handleSend(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me anything about farming..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button 
              variant="primary" 
              onClick={() => handleSend()}
              loading={loading}
              disabled={!input.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
