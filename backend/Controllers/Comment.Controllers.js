const Comment = require('../Models/Comment.Models.js');
const RoadTrip = require('../Models/RoadTrip.Models.js');

// Get all comments for a trip
exports.getCommentsForTrip = async (req, res) => {
    try {
        const comments = await Comment.find({ roadTrip: req.params.tripId })
            .populate('user', 'username') 
            .sort({ createdAt: -1 }); 
        res.json(comments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Create a new comment
exports.createComment = async (req, res) => {
    try {
        const text = req.body.text?.trim();
        if (!text) {
            return res.status(400).json({ msg: 'Comment text is required' });
        }

        if (text.length > 500) {
            return res.status(400).json({ msg: 'Comment must be 500 characters or fewer' });
        }

        const roadTrip = await RoadTrip.findById(req.params.tripId);
        if (!roadTrip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        const newComment = new Comment({
            text,
            user: req.user.id,
            roadTrip: req.params.tripId,
        });

        const comment = await newComment.save();
        await comment.populate('user', 'username');

        roadTrip.comments.unshift(comment.id);
        await roadTrip.save();

        res.json(comment);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');
    }
};
