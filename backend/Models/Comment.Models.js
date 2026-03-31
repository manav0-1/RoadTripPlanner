const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
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

module.exports = mongoose.model('Comment', CommentSchema);