const express = require('express');
const router = express.Router();
const placesController = require('../Controllers/Places.Controllers.js');
const authMiddleware = require('../Middlewares/auth.Middlewares.js');

// GET nearby places for a location (Protected)
router.get('/', authMiddleware, placesController.getNearbyPlaces);
router.get('/nearby', authMiddleware, placesController.getNearbyPlaces);

module.exports = router;
