const RoadTrip = require('../Models/RoadTrip.Models.js');
const cloudinary = require('../config/cloudinary.js');

const parseJsonField = (value, fallback, errorMessage) => {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    if (typeof value !== 'string') {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch (error) {
        throw new Error(errorMessage);
    }
};

const getUploadedFiles = (req, fieldName) => {
    if (!req.files) {
        return [];
    }

    if (Array.isArray(req.files)) {
        return fieldName === 'images' ? req.files : [];
    }

    return req.files[fieldName] || [];
};

const uploadCloudinaryFiles = async (files, resourceType, folder) => {
    if (!files.length) {
        return [];
    }

    const uploadPromises = files.map((file) => {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        return cloudinary.uploader.upload(dataURI, {
            folder,
            resource_type: resourceType,
        });
    });

    const results = await Promise.all(uploadPromises);
    return results.map((result) => result.secure_url);
};

const validateTripPayload = ({ title, description, route }) => {
    if (!title?.trim() || !description?.trim()) {
        return 'Title and description are required';
    }

    if (!Array.isArray(route) || route.length < 2) {
        return 'A trip must include at least a start and destination';
    }

    const hasInvalidStop = route.some(
        (stop) => !stop || !stop.locationName || typeof stop.locationName !== 'string'
    );

    if (hasInvalidStop) {
        return 'Each route stop must include a location name';
    }

    return null;
};

const ensureTripOwner = async (tripId, userId) => {
    const trip = await RoadTrip.findById(tripId);

    if (!trip) {
        return { error: { status: 404, body: { msg: 'Trip not found' } } };
    }

    if (trip.createdBy.toString() !== userId) {
        return { error: { status: 403, body: { msg: 'Not authorized to modify this trip' } } };
    }

    return { trip };
};

exports.createRoadTrip = async (req, res) => {
    try {
        const { title, description, createdBy, route, stickers } = req.body;
        const parsedRoute = parseJsonField(route, [], 'Invalid route format');
        const parsedStickers = parseJsonField(stickers, [], 'Invalid stickers format');
        const normalizedTitle = title?.trim();
        const normalizedDescription = description?.trim();
        const validationError = validateTripPayload({ title: normalizedTitle, description: normalizedDescription, route: parsedRoute });

        if (validationError) {
            return res.status(400).json({ msg: validationError });
        }

        if (createdBy !== req.user.id) {
            return res.status(403).json({ msg: 'Token user does not match trip owner' });
        }

        const imageFiles = getUploadedFiles(req, 'images');
        const videoFiles = getUploadedFiles(req, 'videos');

        const [imageUrls, videoUrls] = await Promise.all([
            uploadCloudinaryFiles(imageFiles, 'image', 'roadtrips/images'),
            uploadCloudinaryFiles(videoFiles, 'video', 'roadtrips/videos'),
        ]);

        const newTrip = new RoadTrip({
            title: normalizedTitle,
            description: normalizedDescription,
            createdBy,
            route: parsedRoute,
            stickers: Array.isArray(parsedStickers) ? parsedStickers : [],
            coverImage: imageUrls[0] || '/default_cover_image.jpg',
            images: imageUrls,
            videos: videoUrls,
        });

        const trip = await newTrip.save();
        res.status(201).json(trip);
    } catch (err) {
        if (err.message === 'Invalid route format' || err.message === 'Invalid stickers format') {
            return res.status(400).json({ msg: err.message });
        }

        console.error('CreateTrip ERROR:', err);
        res.status(500).send('Server Error');
    }
};

exports.updateRoadTrip = async (req, res) => {
    try {
        const { title, description, route, stickers } = req.body;
        const parsedRoute = parseJsonField(route, undefined, 'Invalid route data format.');
        const parsedStickers = parseJsonField(stickers, undefined, 'Invalid stickers format.');
        const ownership = await ensureTripOwner(req.params.id, req.user.id);

        if (ownership.error) {
            return res.status(ownership.error.status).json(ownership.error.body);
        }

        const nextRoute = parsedRoute !== undefined ? parsedRoute : ownership.trip.route;
        const normalizedTitle = title?.trim();
        const normalizedDescription = description?.trim();
        const nextTitle = normalizedTitle || ownership.trip.title;
        const nextDescription = normalizedDescription || ownership.trip.description;
        const validationError = validateTripPayload({
            title: nextTitle,
            description: nextDescription,
            route: nextRoute,
        });

        if (validationError) {
            return res.status(400).json({ msg: validationError });
        }

        const imageFiles = getUploadedFiles(req, 'images');
        const videoFiles = getUploadedFiles(req, 'videos');

        const updateData = {};

        if (normalizedTitle) {
            updateData.title = normalizedTitle;
        }

        if (normalizedDescription) {
            updateData.description = normalizedDescription;
        }

        if (parsedRoute !== undefined) {
            updateData.route = parsedRoute;
        }

        if (parsedStickers !== undefined) {
            updateData.stickers = Array.isArray(parsedStickers) ? parsedStickers : [];
        }

        const [imageUrls, videoUrls] = await Promise.all([
            uploadCloudinaryFiles(imageFiles, 'image', 'roadtrips/images'),
            uploadCloudinaryFiles(videoFiles, 'video', 'roadtrips/videos'),
        ]);

        if (imageUrls.length > 0) {
            updateData.images = imageUrls;
            updateData.coverImage = imageUrls[0];
        }

        if (videoUrls.length > 0) {
            updateData.videos = videoUrls;
        }

        const trip = await RoadTrip.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        res.json(trip);
    } catch (err) {
        if (err.message === 'Invalid route data format.' || err.message === 'Invalid stickers format.') {
            return res.status(400).json({ msg: err.message });
        }

        console.error('UpdateTrip ERROR:', err);
        res.status(500).send('Server Error');
    }
};

exports.getAllRoadTrips = async (req, res) => {
    try {
        const trips = await RoadTrip.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username name followers');
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRoadTrip = async (req, res) => {
    try {
        const ownership = await ensureTripOwner(req.params.id, req.user.id);
        if (ownership.error) {
            return res.status(ownership.error.status).json(ownership.error.body);
        }

        await RoadTrip.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTripById = async (req, res) => {
    try {
        const trip = await RoadTrip.findById(req.params.id)
            .populate('createdBy', 'username name followers following');
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.likeTrip = async (req, res) => {
    try {
        const trip = await RoadTrip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        if (trip.likes.some((like) => like.toString() === req.user.id)) {
            trip.likes = trip.likes.filter((like) => like.toString() !== req.user.id);
        } else {
            trip.likes.push(req.user.id);
        }

        await trip.save();
        res.json(trip.likes);
    } catch (err) {
        console.error('LikeTrip ERROR:', err);
        res.status(500).send('Server Error');
    }
};

exports.getMyTrips = async (req, res) => {
    try {
        const trips = await RoadTrip.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username name followers');

        res.json(trips);
    } catch (err) {
        console.error('GetMyTrips ERROR:', err);
        res.status(500).send('Server Error');
    }
};
