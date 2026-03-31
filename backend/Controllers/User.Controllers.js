const User = require('../Models/User.Models');

// CREATE a new user (Signup)
exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// READ all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE a user by ID
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE a user by ID
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name username followers following createdAt');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleFollow = async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ msg: 'You cannot follow yourself' });
        }

        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        currentUser.following = currentUser.following || [];
        targetUser.followers = targetUser.followers || [];

        const isFollowing = currentUser.following.some(
            (followedUserId) => followedUserId.toString() === req.params.id
        );

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(
                (followedUserId) => followedUserId.toString() !== req.params.id
            );
            targetUser.followers = targetUser.followers.filter(
                (followerId) => followerId.toString() !== req.user.id
            );
        } else {
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);
        }

        await Promise.all([currentUser.save(), targetUser.save()]);

        res.status(200).json({
            isFollowing: !isFollowing,
            followerCount: targetUser.followers.length,
            followingCount: currentUser.following.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
