const mongoose = require("mongoose");
const UserModel = require("./userModel");

const lecturerSchema = new mongoose.Schema({
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

const LecturerModel = UserModel.discriminator("Lecturer", lecturerSchema);

module.exports = LecturerModel;
