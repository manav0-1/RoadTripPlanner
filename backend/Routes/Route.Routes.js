const express = require('express');
const router = express.Router();
const routeController = require('../Controllers/Route.Controllers.js');
const authMiddleware = require('../Middlewares/auth.Middlewares.js');

// POST request to get route data
router.post('/', authMiddleware, routeController.getRoute);
router.post('/smart', authMiddleware, routeController.getSmartNavigation);
router.post('/fitness', authMiddleware, routeController.getFitnessRoute);
router.post('/isochrones', authMiddleware, routeController.getIsochrones);

module.exports = router;
