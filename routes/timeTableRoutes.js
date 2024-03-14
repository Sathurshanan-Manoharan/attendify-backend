const express = require("express");
const timeTableController = require("../controllers/timeTableController");
const UploadTimetable = require("../UploadTimetable"); // Correct the case here
const router = express.Router();

router.route("/uploadtimetable").post(UploadTimetable.uploadTimetable); // Use the correct case for UploadTimetable

router.route("/")
  .post(timeTableController.createTimeTable)
  .get(timeTableController.readTimetable);

router.route("/:id")
  .put(timeTableController.updateTimetable)
  .delete(timeTableController.deleteTimetable);


router.route("/uploadtimetable").post(timeTableController.uploadTimetable);

module.exports = router;
