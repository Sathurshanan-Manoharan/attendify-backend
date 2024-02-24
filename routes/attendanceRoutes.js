const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const router = express.Router();

router
  .route("/")
  .get(attendanceController.getAllAttendance)
  .post(attendanceController.createAttendance);

// router
//   .route("/:id")
//   .get(attendanceController.getAttendance)
//   .patch(attendanceController.updateAttendance)
//   .delete(attendanceController.deleteAttendance);

module.exports = router;
