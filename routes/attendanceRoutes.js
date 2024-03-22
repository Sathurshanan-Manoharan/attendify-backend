const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const onlineAttendanceController = require("../controllers/onlineAttendanceController");
const router = express.Router();

router
  .route("/")
  .get(attendanceController.getAllAttendance)
  .post(attendanceController.createAttendance);

router.route("/createAttendance").post(attendanceController.createAttendanceFromTimetable);
//Takes user UID
router.route("/markAttendance/:id").patch(attendanceController.markAttendance);
router.route("/upload").post(onlineAttendanceController.uploadAttendance);
//Processes csv and updates database
//router.route("/process-csv").get(onlineAttendanceController.processCSV);

router.route("/:id").get(attendanceController.getAttendance);

module.exports = router;
