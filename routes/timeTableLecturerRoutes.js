const express = require("express");
const timeTableLecturerController = require("../controllers/timeTableLecturerController");
const onlineTimetableControllerLecturer = require("../controllers/onlineTimetableControllerLecturer"); // Correct the case here
const router = express.Router();

router.route("/")
  .post(timeTableLecturerController.createTimeTable)
  .get(timeTableLecturerController.readTimetable);

router.route("/:id")
  .put(timeTableLecturerController.updateTimetable)
  .delete(timeTableLecturerController.deleteTimetable);

router.route("/uploadtimetablelecturer") // Correct the route path
  .post(onlineTimetableControllerLecturer.uploadTimetable); // Use the correct case for the controller method

module.exports = router;
