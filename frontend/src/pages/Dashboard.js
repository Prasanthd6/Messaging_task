
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import ChatArea from '../components/ChatArea';
import { FiBell, FiUser } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([
    {
      id: '1',
      participant: {
        _id: '1',
        name: 'Angelie Crison',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        isOnline: true
      },
      lastMessage: {
        content: "Thank you very much. I'm glad you a...",
        createdAt: new Date(Date.now() - 1 * 60 * 1000)
      },
      lastMessageAt: new Date(Date.now() - 1 * 60 * 1000),
      unreadCount: 1
    },
    {
      id: '2',
      participant: {
        _id: '2',
        name: 'Jakob Saris',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isOnline: false
      },
      lastMessage: {
        content: "You: Sure! let me tell you about w...",
        createdAt: new Date(Date.now() - 2 * 60 * 1000)
      },
      lastMessageAt: new Date(Date.now() - 2 * 60 * 1000),
      unreadCount: 0
    },
    {
      id: '3',
      participant: {
        _id: '3',
        name: 'Emery Korsgard',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isOnline: true
      },
      lastMessage: {
        content: "Thank's. You are very helpful...",
        createdAt: new Date(Date.now() - 3 * 60 * 1000)
      },
      lastMessageAt: new Date(Date.now() - 3 * 60 * 1000),
      unreadCount: 1
    },
    {
      id: '4',
      participant: {
        _id: '4',
        name: 'Jeremy Zucker',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isOnline: false
      },
      lastMessage: {
        content: "You: Sure! let me teach you about...",
        createdAt: new Date(Date.now() - 4 * 60 * 1000)
      },
      lastMessageAt: new Date(Date.now() - 4 * 60 * 1000),
      unreadCount: 0
    },
    {
      id: '5',
      participant: {
        _id: '5',
        name: 'Nadia Lauren',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        isOnline: true
      },
      lastMessage: {
        content: "Is there anything I can help? Just...",
        createdAt: new Date(Date.now() - 5 * 60 * 1000)
      },
      lastMessageAt: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 1
    },
    {
      id: '6',
      participant: {
        _id: '6',
        name: 'Jason Statham',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        isOnline: false
      },
      lastMessage: {
        content: "You: Sure! let me share about...",
        createdAt: new Date(Date.now() - 6 * 60 * 1000)
      },
      lastMessageAt: new Date(Date.now() - 6 * 60 * 1000),
      unreadCount: 0
    },
    {
      id: '7',
      participant: {
        _id: '7',
        name: 'Angel Kimberly',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        isOnline: true
      },
      lastMessage: {
        content: "Okay. I know very well about it...",
        createdAt: new Date(Date.now() - 7 * 60 * 1000)
      },
      lastMessageAt: new Date(Date.now() - 7 * 60 * 1000),
      unreadCount: 1
    },
    {
      id: '8',
      participant: {
        _id: '8',
        name: 'Jason Momoa',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        isOnline: false
      },
      lastMessage: {
        content: "You: Sure! let me tell you about...",
        createdAt: new Date(Date.now() - 7 * 60 * 1000)
      },
      lastMessageAt: new Date(Date.now() - 7 * 60 * 1000),
      unreadCount: 0
    }
  ]);
  const [selectedUser, setSelectedUser] = useState({
    _id: '1',
    name: 'Angelie Crison',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isOnline: true
  });
  const [messages, setMessages] = useState([
    {
      _id: '1',
      content: "Morning Angelie, I have question about My Task",
      sender: {
        _id: 'current',
        name: 'You',
        avatar: null
      },
      createdAt: new Date(Date.now() - 25 * 60 * 1000), // 11:38 PM
      type: 'text'
    },
    {
      _id: '2',
      content: "Yes sure, Any problem with your assignment?",
      sender: {
        _id: '1',
        name: 'Angelie Crison',
        avatar: null
      },
      createdAt: new Date(Date.now() - 24 * 60 * 1000), // 11:39 PM
      type: 'text'
    },
    {
      _id: '3',
      content: "How to make a responsive display from the dashboard?",
      sender: {
        _id: 'current',
        name: 'You',
        avatar: null
      },
      createdAt: new Date(Date.now() - 23 * 60 * 1000), // 11:40 PM
      type: 'text',
      attachment: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop'
    },
    {
      _id: '4',
      content: "Is there a plugin to do this task?",
      sender: {
        _id: 'current',
        name: 'You',
        avatar: null
      },
      createdAt: new Date(Date.now() - 22 * 60 * 1000), // 11:41 PM
      type: 'text'
    },
    {
      _id: '5',
      content: "No plugins. You just have to make it smaller according to the size of the phone.",
      sender: {
        _id: '1',
        name: 'Angelie Crison',
        avatar: null
      },
      createdAt: new Date(Date.now() - 19 * 60 * 1000), // 11:44 PM
      type: 'text'
    },
    {
      _id: '6',
      content: "Thank you very much. I'm glad you asked about the assignment",
      sender: {
        _id: '1',
        name: 'Angelie Crison',
        avatar: null
      },
      createdAt: new Date(Date.now() - 1 * 60 * 1000), // Recent
      type: 'text'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Data is already initialized in useState
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setMessages(prev => [...prev, message]);
        // Update conversation list
        fetchConversations();
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket]);



  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/users/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/messages/${conversationId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // Find or create conversation
    const conversation = conversations.find(conv => 
      conv.participant._id === user._id
    );
    
    if (conversation) {
      fetchMessages(conversation.id);
    } else {
      setMessages([]);
    }
  };

  const handleSendMessage = async (content, type = 'text', attachment = '') => {
    if (!selectedUser) return;

    try {
      const response = await axios.post('/api/messages', {
        recipientId: selectedUser._id,
        content,
        type,
        attachment
      });

      const newMessage = response.data.data;
      setMessages(prev => [...prev, newMessage]);
      
      // Update conversations
      fetchConversations();

      // Emit message to socket for real-time
      if (socket) {
        socket.emit('sendMessage', {
          recipientId: selectedUser._id,
          content,
          type,
          attachment
        });
      }

      // Simulate typing indicator from other user
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          // Simulate response message
          const responseMessage = {
            _id: (Date.now() + 1).toString(),
            content: "Thanks for your message! I'll get back to you soon.",
            sender: {
              _id: selectedUser._id,
              name: selectedUser.name,
              avatar: null
            },
            createdAt: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, responseMessage]);
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-layout">
      <Sidebar user={user} onLogout={logout} />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="page-title">Message</h1>
          <div className="header-actions">
            <button className="notification-btn">
              <FiBell />
              <span className="notification-dot"></span>
            </button>
            <div className="profile-picture">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  <FiUser />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* <div className="content-header">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div> */}

        <div className="content-area">
          <MessageList
            users={filteredUsers}
            conversations={filteredConversations}
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <ChatArea
            selectedUser={selectedUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUser={user}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
