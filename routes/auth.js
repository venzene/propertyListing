const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middlewares/isAuth');


router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Logout route
router.get('/logout',isAuth, authController.logout);

module.exports = router;