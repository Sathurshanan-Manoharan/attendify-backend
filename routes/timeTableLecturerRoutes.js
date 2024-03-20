const express = require("express");
const timeTableLecturerController = require("../controllers/timeTableLecturerController");
const onlineTimetableControllerLecturer = require("../controllers/onlineTimetableControllerLecturer"); 
const router = express.Router();

// Routes for time table lecturer
// router.route("/")
//   .post(timeTableLecturerController.createTimetable)
//   .get(timeTableLecturerController.getAllTimetables);

router.route("/:id")
  .put(timeTableLecturerController.updateTimetable)
  .delete(timeTableLecturerController.deleteTimetable);

// Route for uploading timetable by lecturer
router.route("/") // Correct the route path
  .post(onlineTimetableControllerLecturer.uploadTimetableTwo); 

  router.route("/timetablelecturer/:id")
  .get(timeTableLecturerController.readTimetableById)

module.exports = router;
