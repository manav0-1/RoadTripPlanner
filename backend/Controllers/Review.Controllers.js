const Review = require('../Models/Review.Models');
const RoadTrip = require('../Models/RoadTrip.Models');

exports.createReview = async (req, res) => {
    try {
        // Step 1: Create the new review
        const newReview = await Review.create({
            ...req.body,
            roadTrip: req.params.tripId // Get tripId from URL parameter
        });

        // Step 2: Add this review's ID to the corresponding RoadTrip's reviews array
        await RoadTrip.findByIdAndUpdate(req.params.tripId, {
            $push: { reviews: newReview._id }
        });

        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// READ all reviews for a specific road trip
exports.getReviewsForTrip = async (req, res) => {
    try {
        const reviews = await Review.find({ roadTrip: req.params.tripId })
            .populate('user', 'username');
            
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE a review by its ID
exports.updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.reviewId, req.body, { new: true });
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE a review by its ID
exports.deleteReview = async (req, res) => {
    try {
        // Step 1: Find the review to get the tripId before deleting
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        const tripId = review.roadTrip;

        // Step 2: Delete the review
        await Review.findByIdAndDelete(req.params.reviewId);

        // Step 3: Remove the review's ID from the RoadTrip's reviews array
        await RoadTrip.findByIdAndUpdate(tripId, {
            $pull: { reviews: req.params.reviewId }
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};