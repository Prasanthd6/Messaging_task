const express = require('express');
const { body } = require('express-validator');
const {
  getAllUsers,
  getUserById,
  getProfile,
  updateProfile,
  getConversations
} = require('../controllers/userController');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
];

// Routes
router.get('/', getAllUsers);
router.get('/profile', getProfile);
router.get('/conversations', getConversations);
router.get('/:id', getUserById);
router.put('/profile', updateProfileValidation, updateProfile);

module.exports = router;
