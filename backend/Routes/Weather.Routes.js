const express = require('express');
const router = express.Router();
const weatherController = require('../Controllers/Weather.Controllers.js'); 

router.get('/', weatherController.getWeatherByLocation);

module.exports = router;