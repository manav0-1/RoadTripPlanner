const express = require('express');
const router = express.Router();
const userController = require('../Controllers/User.Controllers.js');
const authMiddleware = require('../Middlewares/auth.Middlewares.js');

router.get('/:id/profile', userController.getUserProfile);

router.put('/:id/follow', authMiddleware, userController.toggleFollow);

router.post('/', userController.createUser);

router.get('/', userController.getAllUsers);

router.put('/:id', authMiddleware, userController.updateUser);

router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
