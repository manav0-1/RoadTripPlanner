const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/Review.Controllers');

router.post('/', reviewController.createReview);
router.get('/trip/:tripId', reviewController.getReviewsForTrip);
router.put('/:reviewId', reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;