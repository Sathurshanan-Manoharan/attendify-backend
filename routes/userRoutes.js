const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// Define routes for user-related operations
router.route("/")
  .post(userController.createUser) 
  .get(userController.getAllUsers); 

module.exports = router;
