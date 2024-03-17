const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const onlineAttendanceController = require("../controllers/onlineAttendanceController");
const router = express.Router();

router
  .route("/")
  .get(attendanceController.getAllAttendance)
  .post(attendanceController.createAttendance)
  
//Takes user UID
router.route("/markAttendance/:id").patch(attendanceController.markAttendance);
router.route("/upload").post(attendanceController.uploadAttendance);
//Processes csv and updates database
router.route('/process-csv').get(onlineAttendanceController.processCSV);
// router
//   .route("/:id")
//   .get(attendanceController.getAttendance)
//   .patch(attendanceController.updateAttendance)
//   .delete(attendanceController.deleteAttendance);

module.exports = router;
