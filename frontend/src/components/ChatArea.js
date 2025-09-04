import React, { useState, useEffect, useRef } from 'react';
import { FiPaperclip, FiSend, FiPhone, FiVideo, FiBell, FiUser, FiSmile } from 'react-icons/fi';
import './ChatArea.css';

const ChatArea = ({ selectedUser, messages, onSendMessage, currentUser, isTyping: externalIsTyping }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatMessageTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true);
      // Here you would emit typing event to socket
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Here you would emit stop typing event to socket
    }, 1000);
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  if (!selectedUser) {
    return (
      <div className="chat-area">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666',
          fontSize: '18px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-avatar">
            {selectedUser.avatar ? (
              <img 
                src={selectedUser.avatar} 
                alt={selectedUser.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              getInitials(selectedUser.name)
            )}
          </div>
          <div className="chat-user-details">
            <h3>{selectedUser.name}</h3>
            <div className="chat-status">
              <span className={`status-indicator ${selectedUser.isOnline ? 'online' : 'offline'}`}></span>
              {selectedUser.isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
        
        <div className="chat-actions">
          <button className="chat-action-btn">
            <FiBell />
            <span className="notification-dot"></span>
          </button>
          <button className="chat-action-btn">
            <FiUser />
          </button>
          <button className="chat-action-btn">
            <FiVideo />
          </button>
          <button className="chat-action-btn primary">
            <FiPhone />
          </button>
        </div>
      </div>

      <div className="messages-container">
        {Object.keys(messageGroups).length > 0 ? (
          Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="date-separator">
                <span>{date}</span>
              </div>
              {dateMessages.map((message) => {
                const isSent = message.sender._id === 'current' || (currentUser && message.sender._id === currentUser.id);
                return (
                  <div key={message._id} className={`message ${isSent ? 'sent' : 'received'}`}>
                    {!isSent && (
                      <div className="message-avatar">
                        {message.sender.avatar ? (
                          <img 
                            src={message.sender.avatar} 
                            alt={message.sender.name}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          getInitials(message.sender.name)
                        )}
                      </div>
                    )}
                    
                    <div className="message-content">
                      <div className="message-bubble">
                        {message.attachment && message.type === 'image' && (
                          <img 
                            src={message.attachment} 
                            alt="Attachment" 
                            className="message-image"
                          />
                        )}
                        {message.content}
                      </div>
                      <div className="message-time">
                        {formatMessageTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
            fontSize: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>💬</div>
              <p>No messages yet</p>
              <p style={{ fontSize: '14px', marginTop: '5px' }}>
                Start the conversation!
              </p>
            </div>
          </div>
        )}
        {externalIsTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">Angelie is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <form onSubmit={handleSendMessage} className="message-input-form">
          <button type="button" className="attachment-btn">
            <FiPaperclip />
          </button>
          <input
            type="text"
            className="message-input"
            placeholder="Send your message..."
            value={newMessage}
            onChange={handleInputChange}
          />
          <button type="button" className="mention-btn">
            @
          </button>
          <button 
            type="submit" 
            className="send-btn"
            disabled={!newMessage.trim()}
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
