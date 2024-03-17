const mongoose = require("mongoose");
const UserModel = require("./userModel");

const studentSchema = new mongoose.Schema({

    studentID: {
        type: String,
        required: [true, "A student must have a student ID"],
      },

    iitEmail: {
        type: String,
        required: [true, "A student must have an  IIT email"],
      },

    course: {
        type: String,
        enum: ["SE", "CS", "BIS" , "BM" , "BDA"],
        required: [true, "A student must follow a course"],
    },

    level: {
        type: String,
        enum: ["L4", "L5", "L6"],
        required: [true, "A student must have a level"],
    },

    tutorialGroup: {
        type: String,
        required: [true, "A student must have a tutorial group"],
    },
  
});

const StudentModel = UserModel.discriminator("Student", studentSchema);

module.exports = StudentModel;
