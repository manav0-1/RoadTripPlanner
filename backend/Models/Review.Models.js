const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    roadTrip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoadTrip',
        required: true,
    }
}, { timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;