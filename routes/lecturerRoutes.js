const express = require("express");
const userController = require("../controllers/lecturerController");
const router = express.Router();

// Define routes for user-related operations
router.route("/")
  .post(userController.createLecturer) 
  .get(userController.getAllLecturers); 

module.exports = router;