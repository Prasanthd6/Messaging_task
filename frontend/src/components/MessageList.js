import React from 'react';
import { FiCheck, FiSearch } from 'react-icons/fi';
import './MessageList.css';

const MessageList = ({ users, conversations, selectedUser, onUserSelect, loading, searchTerm, onSearchChange }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m Ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h Ago`;
    return `${Math.floor(diffInMinutes / 1440)}d Ago`;
  };

  const getMessageStatus = (conversation) => {
    if (conversation.unreadCount > 0) {
      return (
        <div className="message-status status-unread">
          {conversation.unreadCount}
        </div>
      );
    }
    
    if (conversation.lastMessage) {
      return (
        <div className="message-status status-read">
          <FiCheck />
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="message-list">
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Loading conversations...
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      <div className="message-list-header">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search Name"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <FiSearch className="search-icon" />
        </div>
      </div>
      
      <div className="conversations-container">
        {conversations.length > 0 && (
        conversations.map((conversation) => {
          const participant = conversation.participant;
          const isSelected = selectedUser && selectedUser._id === participant._id;
          
          return (
            <div
              key={conversation.id}
              className={`contact-item ${isSelected ? 'active' : ''}`}
              onClick={() => onUserSelect(participant)}
            >
              <div className="contact-avatar">
                {participant.avatar ? (
                  <img 
                    src={participant.avatar} 
                    alt={participant.name}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  getInitials(participant.name)
                )}
                <div className={`status-dot ${participant.isOnline ? 'online' : 'offline'}`}></div>
              </div>
              
              <div className="contact-info">
                <div className="contact-name">{participant.name}</div>
                <div className="contact-last-message">
                  {conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet'}
                </div>
              </div>
              
              <div className="contact-meta">
                <div className="contact-time">
                  {formatTime(conversation.lastMessageAt)}
                </div>
                {getMessageStatus(conversation)}
              </div>
            </div>
          );
        })
      )}

        {users && users.length > 0 && (
          users.map((u) => {
            const isSelected = selectedUser && selectedUser._id === u._id;
            return (
              <div
                key={u._id}
                className={`contact-item ${isSelected ? 'active' : ''}`}
                onClick={() => onUserSelect(u)}
              >
                <div className="contact-avatar">
                  {u.avatar ? (
                    <img 
                      src={u.avatar} 
                      alt={u.name}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    getInitials(u.name)
                  )}
                  <div className={`status-dot ${u.isOnline ? 'online' : 'offline'}`}></div>
                </div>
                <div className="contact-info">
                  <div className="contact-name">{u.name}</div>
                  <div className="contact-last-message">Tap to start conversation</div>
                </div>
                <div className="contact-meta">
                  <div className="contact-time">&nbsp;</div>
                </div>
              </div>
            );
          })
        )}

        {(!users || users.length === 0) && conversations.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>No conversations yet</h3>
            <p>Start a conversation by selecting a user</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
