const express = require("express");
const timeTableController = require("../controllers/timeTableController");
const UploadTimetable = require("../controllers/onlineTimetableController"); // Correct the case here
const router = express.Router();

router.route("../controllers/onlineTimetableController").post(UploadTimetable.uploadTimetable); // Use the correct case for UploadTimetable

router.route("/")
  .post(timeTableController.createTimeTable)
  .get(timeTableController.readTimetable);

router.route("/:id")
  .put(timeTableController.updateTimetable)
  .delete(timeTableController.deleteTimetable);


router.route("../controllers/onlineTimetableController").post(UploadTimetable.uploadTimetable);

router.route("/uploadtimetable").post(UploadTimetable.uploadTimetable);

module.exports = router;
