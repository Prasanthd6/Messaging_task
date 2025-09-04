const express = require('express');
const { body } = require('express-validator');
const {
  sendMessage,
  getMessages,
  markAsRead
} = require('../controllers/messageController');

const router = express.Router();

// Validation rules
const sendMessageValidation = [
  body('recipientId')
    .isMongoId()
    .withMessage('Invalid recipient ID'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['text', 'image', 'file'])
    .withMessage('Invalid message type')
];

// Routes
router.post('/', sendMessageValidation, sendMessage);
router.get('/:conversationId', getMessages);
router.put('/:messageId/read', markAsRead);

module.exports = router;
