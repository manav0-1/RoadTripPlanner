const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdTrips: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoadTrip'
    }],
    savedTrips: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoadTrip'
    }],
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    }
}, { timestamps: true }); 

const User = mongoose.model('User', UserSchema);
module.exports = User;
