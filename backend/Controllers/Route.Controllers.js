const axios = require('axios');
const polyline = require('@mapbox/polyline');

const PROFILE_MAP = {
    driving: 'driving-car',
    cycling: 'cycling-regular',
    walking: 'foot-walking',
    running: 'foot-walking',
};

const normalizeProfile = (profile = 'driving') => PROFILE_MAP[profile] || PROFILE_MAP.driving;
const ALLOWED_PROFILES = Object.keys(PROFILE_MAP);
const isValidCoordinatePair = (value) =>
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((item) => typeof item === 'number' && Number.isFinite(item));

const getApiKey = () => process.env.ORS_API_KEY;

const geocodeLocation = async (locationName) => {
    const apiKey = getApiKey();
    const geoResponse = await axios.get('https://api.openrouteservice.org/geocode/search', {
        params: {
            api_key: apiKey,
            text: locationName,
            size: 1,
        },
    });

    if (!geoResponse.data.features || geoResponse.data.features.length === 0) {
        throw new Error(`Could not find coordinates for ${locationName}`);
    }

    return geoResponse.data.features[0].geometry.coordinates;
};

const resolveCoordinates = async ({ locationName, coordinates }) => {
    if (Array.isArray(coordinates) && coordinates.length === 2) {
        return coordinates;
    }

    if (locationName) {
        return geocodeLocation(locationName);
    }

    throw new Error('Location coordinates or location name are required');
};

const fetchDirections = async ({ coordinates, profile, preference = 'fastest', elevation = false }) => {
    const apiKey = getApiKey();
    const orsProfile = normalizeProfile(profile);
    const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/${orsProfile}`,
        {
            coordinates,
            preference,
            instructions: false,
            elevation,
        },
        {
            headers: {
                Authorization: apiKey,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.data.routes || response.data.routes.length === 0) {
        throw new Error('Route could not be calculated between these points.');
    }

    return response.data.routes[0];
};

const formatRoute = (route, metadata = {}) => ({
    ...metadata,
    distanceKm: Number((route.summary.distance / 1000).toFixed(2)),
    durationMinutes: Number((route.summary.duration / 60).toFixed(1)),
    ascent: Number((route.summary.ascent || 0).toFixed(0)),
    descent: Number((route.summary.descent || 0).toFixed(0)),
    polyline: polyline.decode(route.geometry),
});

const convertIsochronePolygon = (coordinates) =>
    coordinates.map((ring) => ring.map(([lng, lat]) => [lat, lng]));

exports.getRoute = async (req, res) => {
    try {
        if (!getApiKey()) {
            return res.status(500).json({ msg: 'ORS API key is not configured' });
        }

        const { startLocationName, endLocationName } = req.body;

        if (!startLocationName || !endLocationName) {
            return res.status(400).json({ msg: 'Start and end location names are required' });
        }

        const startCoords = await geocodeLocation(startLocationName);
        const endCoords = await geocodeLocation(endLocationName);
        const route = await fetchDirections({
            coordinates: [startCoords, endCoords],
            profile: 'driving',
            preference: 'fastest',
        });

        res.json(formatRoute(route));
    } catch (error) {
        console.error('OpenRouteService Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ msg: 'Error fetching route data' });
    }
};

exports.getSmartNavigation = async (req, res) => {
    try {
        const { startLocationName, endLocationName, profile = 'driving' } = req.body;

        if (!startLocationName || !endLocationName) {
            return res.status(400).json({ msg: 'Start and end location names are required' });
        }

        if (!ALLOWED_PROFILES.includes(profile)) {
            return res.status(400).json({ msg: 'Unsupported route profile' });
        }

        const startCoords = await geocodeLocation(startLocationName);
        const endCoords = await geocodeLocation(endLocationName);

        const [fastestRoute, shortestRoute] = await Promise.all([
            fetchDirections({
                coordinates: [startCoords, endCoords],
                profile,
                preference: 'fastest',
            }),
            fetchDirections({
                coordinates: [startCoords, endCoords],
                profile,
                preference: 'shortest',
            }),
        ]);

        res.json({
            startCoords,
            endCoords,
            routes: [
                formatRoute(fastestRoute, { routeType: 'fastest', profile }),
                formatRoute(shortestRoute, { routeType: 'shortest', profile }),
            ],
        });
    } catch (error) {
        console.error('Smart Navigation Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ msg: 'Error fetching smart navigation data' });
    }
};

exports.getFitnessRoute = async (req, res) => {
    try {
        const { activity = 'running', coordinates } = req.body;

        if (!ALLOWED_PROFILES.includes(activity) && activity !== 'running') {
            return res.status(400).json({ msg: 'Unsupported fitness activity' });
        }

        if (!Array.isArray(coordinates) || coordinates.length < 2 || coordinates.some((pair) => !isValidCoordinatePair(pair))) {
            return res.status(400).json({ msg: 'At least two GPS coordinates are required' });
        }

        const route = await fetchDirections({
            coordinates,
            profile: activity,
            preference: 'shortest',
            elevation: true,
        });

        res.json({
            activity,
            checkpoints: coordinates.length,
            ...formatRoute(route),
        });
    } catch (error) {
        console.error('Fitness Route Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ msg: 'Error building fitness route data' });
    }
};

exports.getIsochrones = async (req, res) => {
    try {
        const { locationName, coordinates, profile = 'driving', ranges = [300, 600, 1800] } = req.body;
        const apiKey = getApiKey();

        if (!apiKey) {
            return res.status(500).json({ msg: 'ORS API key is not configured' });
        }

        if (!ALLOWED_PROFILES.includes(profile)) {
            return res.status(400).json({ msg: 'Unsupported route profile' });
        }

        if (!Array.isArray(ranges) || ranges.length === 0 || ranges.some((value) => typeof value !== 'number' || value <= 0)) {
            return res.status(400).json({ msg: 'Ranges must be a list of positive numbers' });
        }

        const center = await resolveCoordinates({ locationName, coordinates });
        const orsProfile = normalizeProfile(profile);

        const response = await axios.post(
            `https://api.openrouteservice.org/v2/isochrones/${orsProfile}`,
            {
                locations: [center],
                range: ranges,
                range_type: 'time',
                units: 'm',
            },
            {
                headers: {
                    Authorization: apiKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        const features = response.data.features || [];
        res.json({
            center,
            profile,
            ranges,
            polygons: features.map((feature) => ({
                value: feature.properties.value,
                minutes: Math.round(feature.properties.value / 60),
                coordinates: convertIsochronePolygon(feature.geometry.coordinates),
            })),
        });
    } catch (error) {
        console.error('Isochrones Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ msg: 'Error fetching isochrone data' });
    }
};
