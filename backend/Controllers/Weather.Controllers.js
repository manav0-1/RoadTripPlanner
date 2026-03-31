const axios = require('axios');

exports.getWeatherByLocation = async (req, res) => {
    try {
        const location = req.query.location;
        if (!location) {
            return res.status(400).json({ message: 'Location query parameter is required' });
        }

        const apiKey = process.env.WEATHER_API_KEY;
        const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

        const response = await axios.get(apiUrl);
        
        const weatherData = {
            location: response.data.location.name,
            temp_c: response.data.current.temp_c,
            condition: response.data.current.condition.text,
            icon: response.data.current.condition.icon
        };

        res.status(200).json(weatherData);

    } catch (error) {
        console.error("Weather API error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to fetch weather data' });
    }
};