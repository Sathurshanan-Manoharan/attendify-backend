const express = require("express");
const userController = require("../controllers/studentController");
const router = express.Router();

// Define routes for user-related operations
router.route("/")
  .post(userController.createStudent) 
  .get(userController.getAllStudents); 

router.route("/student/:id")
  .get(userController.getStudentByEmail);



module.exports = router;