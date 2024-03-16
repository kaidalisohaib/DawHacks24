const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const { isAuthenticated } = require('../controllers/auth-controller.js');

router.get('/goals', isAuthenticated, userController.getGoals);
router.put('/goals', isAuthenticated, userController.updateGoals);
router.get('/daily-food', isAuthenticated, userController.getDailyFood);
router.post('/daily-food', isAuthenticated, userController.addDailyFood);

module.exports = router;