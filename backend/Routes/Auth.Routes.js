const express = require('express');
const router = express.Router();
const authController = require('../Controllers/Auth.Controllers.js'); // Apne controller ka path daalein


router.post('/register', authController.register);


router.post('/login', authController.login);

module.exports = router;