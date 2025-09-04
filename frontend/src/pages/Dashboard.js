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
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDemoThread, setIsDemoThread] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const API_BASE_URL = (import.meta.env && import.meta.env.VITE_BACKEND_URL) || 'http://localhost:5000';

  const DEFAULT_USERS = [
    { _id: 'demo-1',  name: 'Angelie Crison',    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', isOnline: true },
    { _id: 'demo-2',  name: 'Jakob Saris',       avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', isOnline: false },
    { _id: 'demo-3',  name: 'Emery Korsgard',    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', isOnline: true },
    { _id: 'demo-4',  name: 'Jeremy Zucker',     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', isOnline: false },
    { _id: 'demo-5',  name: 'Nadia Lauren',      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', isOnline: true },
    { _id: 'demo-6',  name: 'Jason Statham',     avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', isOnline: false },
    { _id: 'demo-7',  name: 'Angel Kimberly',    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', isOnline: true },
    { _id: 'demo-8',  name: 'Jason Momoa',       avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', isOnline: false },
    { _id: 'demo-9',  name: 'Ava Collins',       avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face', isOnline: true },
    { _id: 'demo-10', name: 'Liam Turner',       avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face', isOnline: true }
  ];

  const getDefaultMessagesFor = (contact) => {
    const now = Date.now();
    const me = { _id: user?.id || 'current', name: user?.name || 'You', avatar: user?.avatar || null };
    const them = { _id: contact._id, name: contact.name, avatar: contact.avatar };

    const topicByUser = {
      'demo-1': {
        intro: 'Morning, can you review the homepage spacing?',
        reply: 'Sure, add 24px between header and date chips.',
        extra: 'Also keep the header sticky so the name stays visible.'
      },
      'demo-2': {
        intro: 'The login API returns 401 sometimes.',
        reply: 'Check token expiry and refresh interceptor.',
        extra: 'Add retries with exponential backoff.'
      },
      'demo-3': {
        intro: 'How do I design the conversation list like the mock?',
        reply: 'Use flex with fixed avatar and grow content.',
        extra: 'Clamp preview text to a single line.'
      },
      'demo-4': {
        intro: 'Deployment failed on Vercel build step.',
        reply: 'Cache node_modules and pin Node 18.x.',
        extra: 'Ensure env vars are set in project settings.'
      },
      'demo-5': {
        intro: 'Database index suggestions for messages?',
        reply: 'Index sender, recipient and createdAt desc.',
        extra: 'Add compound index for recipient and isRead.'
      },
      'demo-6': {
        intro: 'Auth: best way to store tokens?',
        reply: 'Use httpOnly cookies; avoid localStorage.',
        extra: 'Rotate refresh tokens on every use.'
      },
      'demo-7': {
        intro: 'Notifications look delayed on mobile.',
        reply: 'Compress payload and debounce socket emits.',
        extra: 'Show local toast while server confirms.'
      },
      'demo-8': {
        intro: 'How to optimize image uploads?',
        reply: 'Resize client-side and use WebP on Cloudinary.',
        extra: 'Lazy-load media inside the chat thread.'
      },
      'demo-9': {
        intro: 'Any tips for accessibility in chat?',
        reply: 'Add ARIA roles and focus management.',
        extra: 'Provide high-contrast theme and keyboard nav.'
      },
      'demo-10': {
        intro: 'I want to add unit tests for reducers.',
        reply: 'Use Jest with react-testing-library.',
        extra: 'Mock axios and socket events where needed.'
      }
    };

    const t = topicByUser[contact._id] || topicByUser['demo-1'];
    const dayShift = ['demo-5', 'demo-8'].includes(contact._id) ? 3 : 1; // some users get older threads
    const mins = [dayShift * 24 * 60 + 60, dayShift * 24 * 60 + 50, 120, 90, 60, 45, 30, 20, 12, 5];
    const contents = [
      { text: t.intro, from: me },
      { text: t.reply, from: them },
      { text: 'Got it. Should I also add a date separator?', from: me },
      { text: 'Yes, show Today/Yesterday based on createdAt.', from: them },
      { text: t.extra, from: them },
      { text: 'Great, I will implement and share screenshots.', from: me },
      { text: 'Remember to keep long lines wrapped.', from: them },
      { text: 'Done. The UI feels smoother now.', from: me },
      { text: 'Nice work! I will merge after a quick pass.', from: them },
      { text: 'Thanks! Moving to the next task.', from: me }
    ];

    return contents.map((c, i) => ({
      _id: `${contact._id}-m${i+1}`,
      content: c.text,
      sender: c.from,
      createdAt: new Date(now - mins[i] * 60 * 1000),
      type: 'text'
    }));
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchConversations()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setMessages(prev => [...prev, message]);
        fetchConversations();
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket]);



  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      const apiUsers = response.data || [];
      // Merge API users with defaults (ensure uniqueness by _id)
      const merged = [...apiUsers, ...DEFAULT_USERS.filter(d => !apiUsers.some(u => String(u._id) === String(d._id)) )];
      setUsers(merged);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers(DEFAULT_USERS);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/${conversationId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsMobileChatOpen(true);
    // Find or create conversation
    const conversation = conversations.find(conv => 
      conv.participant._id === user._id
    );
    
    if (conversation && user._id && !String(user._id).startsWith('demo-')) {
      setIsDemoThread(false);
      fetchMessages(conversation.id);
    } else {
      // Prefill some default messages (for demo users or for real users with no conversation yet)
      const sample = getDefaultMessagesFor(user);
      setMessages(sample);
      setIsDemoThread(true);
    }
  };

  const handleSendMessage = async (content, type = 'text', attachment = '') => {
    if (!selectedUser) return;

    try {
      // If demo thread (either demo user or real user with no prior messages), show instantly
      if (isDemoThread) {
        const newMessage = {
          _id: `local-${Date.now()}`,
          content,
          type,
          attachment,
          sender: { _id: user?.id || 'current', name: user?.name || 'You', avatar: user?.avatar || null },
          createdAt: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        // If it's a real user (not demo id), still send to server to create conversation
        if (!String(selectedUser._id).startsWith('demo-')) {
          try {
            const response = await axios.post(`${API_BASE_URL}/messages`, {
              recipientId: selectedUser._id,
              content,
              type,
              attachment
            });
            const saved = response.data.data;
            // Replace local temp with saved (optional)
            setMessages(prev => prev.map(m => m._id === newMessage._id ? saved : m));
            fetchConversations();
            if (socket) {
              socket.emit('sendMessage', { recipientId: selectedUser._id, message: saved });
            }
            setIsDemoThread(false);
          } catch (err) {
            console.error('Error creating conversation:', err);
          }
        }
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/messages`, {
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
          message: newMessage
        });
      }
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
      <div className="mobile-topbar" style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}>
        <button className="hamburger" onClick={() => setIsSidebarOpen(prev => !prev)}>☰</button>
        <div style={{width:36}} />
      </div>
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
      {/* Always show sidebar in desktop width */}
      <Sidebar user={user} onLogout={logout} open={window.innerWidth > 768 || isSidebarOpen} />
      
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="page-title desktop-only">Message</h1>
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

        <div className="content-area" style={{ '--mobile-list-display': isMobileChatOpen ? 'none' : 'flex', '--mobile-chat-display': isMobileChatOpen ? 'flex' : 'none' }}>
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
            onBack={() => setIsMobileChatOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
