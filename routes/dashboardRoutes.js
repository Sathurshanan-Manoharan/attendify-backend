const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Define the route for fetching expected student count
router.get('/lecturer/:lecturerId/sessionDetails', dashboardController.getSessionDetails);

module.exports = router;
