const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/lecturer/:lecturerEmail/sessionDetails', dashboardController.getSessionDetails);
router.get('/lecturer/sessions/:lecturerEmail', dashboardController.getLecturerSessions);
router.get('/student/:studentEmail/timetable', dashboardController.getStudentTimetable);

module.exports = router;
