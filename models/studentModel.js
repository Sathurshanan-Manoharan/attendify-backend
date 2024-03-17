const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "A student must have a first name"],
      },
    
      lastName: {
        type: String,
        required: [true, "A student must have a last name"],
      },
    
      uid: {
        type: String,
        required: [true, "A student must have a uid"],
      },

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

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;
