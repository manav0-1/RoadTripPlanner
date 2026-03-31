const express = require('express');
const router = express.Router();
const commentController = require('../Controllers/Comment.Controllers.js');
const authMiddleware = require('../Middlewares/auth.Middlewares.js');

// Get all comments for a trip
router.get('/:tripId', commentController.getCommentsForTrip);

// Create a comment on a trip (Protected)
router.post('/:tripId', authMiddleware, commentController.createComment);

module.exports = router;