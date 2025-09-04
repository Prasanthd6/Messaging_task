const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, type = 'text', attachment } = req.body;

    // Validate recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Create message
    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content,
      type,
      attachment
    });

    await message.save();

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user.id, recipientId]
      });
    }

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    
    // Update unread count for recipient
    const currentUnread = conversation.unreadCount.get(recipientId) || 0;
    conversation.unreadCount.set(recipientId, currentUnread + 1);
    
    await conversation.save();

    // Populate message with sender info
    await message.populate('sender', 'name avatar');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Find conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get messages
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: conversation.participants.find(p => p.toString() !== req.user.id.toString()) },
        { sender: conversation.participants.find(p => p.toString() !== req.user.id.toString()), recipient: req.user.id }
      ]
    })
    .populate('sender', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      { recipient: req.user.id, sender: conversation.participants.find(p => p.toString() !== req.user.id.toString()), isRead: false },
      { isRead: true, readAt: new Date() }
    );

    // Reset unread count
    conversation.unreadCount.set(req.user.id.toString(), 0);
    await conversation.save();

    res.json({
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: messages.length
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.recipient.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead
};
