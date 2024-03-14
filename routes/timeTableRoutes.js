const express = require("express");
const timeTableController = require("../controllers/timeTableController");
const router = express.Router();

router
  .route("/")
  .post(timeTableController.createTimeTable)
  .get(timeTableController.readTimetable);

router
  .route("/:id")
  .put(timeTableController.updateTimetable)
  .delete(timeTableController.deleteTimetable);


router.route("/uploadtimetable").post(timeTableController.uploadTimetable);

module.exports = router;
