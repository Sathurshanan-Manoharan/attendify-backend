const mongoose = require("mongoose");
const lecturerSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "A user must have a first name"],
      },
    
    lastName: {
        type: String,
        required: [true, "A user must have a last name"],
    },
    
    uid: {
        type: String,
        required: [true, "A user must have a uid"],
    },

    LecturerID: {
        type: String,
        required: [true, "A lecturer must have an lecturer ID"],
      },

    email: {
        type: String,
        required: [true, "A lecturer must have an email"],
      },

    contractType: {
        type: String,
        enum: ["Full-time Lecturer", "Part-time Lecturer"],
        required: [true, "A lecturer must have a contract type"],
    },

    specialRole: {
        type: String,
        required: [true, "A user must have a special role"],
    }

});

const LecturerModel =mongoose.model("Lecturer", lecturerSchema);
module.exports = LecturerModel;
