const express = require('express');
const router = express.Router();
const {
  isAuthenticated, login, logout, protect, session
} = require('../controllers/auth-controller.js');

router.post('/login', login);
router.post('/logout', isAuthenticated, logout);
router.get('/protected', isAuthenticated, protect);
router.get('/session', session);

module.exports = router;