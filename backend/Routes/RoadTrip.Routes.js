const express = require('express');
const router = express.Router();
const roadTripController = require('../Controllers/RoadTrip.Controllers.js');
const authMiddleware = require('../Middlewares/auth.Middlewares.js');
const upload = require('../config/multer.js'); // Multer config ko import karein


// GET all trips
router.get('/', roadTripController.getAllRoadTrips);

// GET all trips for a user (Protected Route)
router.get('/mytrips', authMiddleware, roadTripController.getMyTrips);

// GET a single trip by ID
router.get('/:id', roadTripController.getTripById);

// CREATE a new trip (Protected, with image and video uploads)
router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 },
  ]),
  roadTripController.createRoadTrip
);

// UPDATE a trip (Protected, with image and video uploads)
router.put(
  '/:id',
  authMiddleware,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 },
  ]),
  roadTripController.updateRoadTrip
);

// Like/Unlike a trip (Protected Route)
router.put('/:id/like', authMiddleware, roadTripController.likeTrip);

// DELETE a trip (Protected)
router.delete('/:id', authMiddleware, roadTripController.deleteRoadTrip);


module.exports = router;
