const axios = require('axios');

exports.getNearbyPlaces = async (req, res) => {
    const { location, lat, lng, categories } = req.query;

    if (!location && (!lat || !lng)) {
        return res.status(400).json({ msg: 'Location or coordinates are required' });
    }

    try {
        const orsApiKey = process.env.ORS_API_KEY;
        const requestedCategories = (categories || 'restaurant,hospital,atm').split(',').map((item) => item.trim()).filter(Boolean);
        let lon = lng;
        let latitude = lat;

        if (!orsApiKey) {
            return res.status(500).json({ msg: 'ORS API key is not configured' });
        }

        if ((!location && (Number.isNaN(Number(lat)) || Number.isNaN(Number(lng)))) || requestedCategories.length === 0) {
            return res.status(400).json({ msg: 'Valid coordinates and categories are required' });
        }

        if (location) {
            const geoResponse = await axios.get('https://api.openrouteservice.org/geocode/search', {
                params: {
                    api_key: orsApiKey,
                    text: location,
                    size: 1,
                },
            });

            if (!geoResponse.data.features || geoResponse.data.features.length === 0) {
                return res.status(404).json({ msg: `Could not find location: ${location}` });
            }

            [lon, latitude] = geoResponse.data.features[0].geometry.coordinates;
        }

        try {
            const orsResponse = await axios.post(
                'https://api.openrouteservice.org/pois',
                {
                    request: 'pois',
                    geometry: {
                        geojson: {
                            type: 'Point',
                            coordinates: [Number(lon), Number(latitude)],
                        },
                        buffer: 2000,
                    },
                    filters: {
                        category_ids: requestedCategories,
                    },
                    limit: 10,
                },
                {
                    headers: {
                        Authorization: orsApiKey,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const places = (orsResponse.data.features || []).map((place, index) => ({
                id: place.properties.osm_id || `${place.properties.name}-${index}`,
                name: place.properties.name || 'Unnamed place',
                address: place.properties.street || place.properties.osm_value || 'Address unavailable',
                category: place.properties.category_ids?.[0] || 'point_of_interest',
                coordinates: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
            }));

            return res.json({
                center: [Number(latitude), Number(lon)],
                places,
            });
        } catch (orsError) {
            const geoApiKey = process.env.GEOAPIFY_API_KEY;
            const geoapifyCategories = requestedCategories
                .map((category) => {
                    const lookup = {
                        restaurant: 'catering.restaurant',
                        hospital: 'healthcare.hospital',
                        atm: 'service.financial.atm',
                        pharmacy: 'healthcare.pharmacy',
                    };
                    return lookup[category] || category;
                })
                .join(',');

            const placesResponse = await axios.get(
                `https://api.geoapify.com/v2/places?categories=${geoapifyCategories}&filter=circle:${lon},${latitude},5000&bias=proximity:${lon},${latitude}&limit=10&apiKey=${geoApiKey}`
            );

            const places = (placesResponse.data.features || []).map((place) => ({
                id: place.properties.place_id,
                name: place.properties.name,
                address: place.properties.address_line2,
                category: place.properties.categories?.[0] || 'point_of_interest',
                coordinates: [place.properties.lat, place.properties.lon],
            }));

            return res.json({
                center: [Number(latitude), Number(lon)],
                places,
                source: 'geoapify_fallback',
                warning: orsError.response?.data?.error || 'ORS POI lookup failed, using fallback source.',
            });
        }

    } catch (error) {
        console.error('Nearby Places Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ msg: 'Error fetching nearby places' });
    }
};
