const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "A user must have an email"],
  },

  uowId: {
    type: String,
    required: [true, "A user must have a UOW ID"],
  },
  iitId:{
    type: String,
    required: [true, "A user must have a IIT ID"],
  },

  tutorialGroup: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: [true, "A user must have a tutorial group"],
  },
  degreeType: {
    type: String,
    enum: ["SE", "CS", "BIS"],
    required: [true, "A user must have a degree type"],
  },
  year: {
    type: String,
    enum: ["L4", "L5", "L6"],
    required: [true, "A user must have a year"],
  },
  uid: {
    type: String,
    required: [true, "A user must have a uid"],
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;