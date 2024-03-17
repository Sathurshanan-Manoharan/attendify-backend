const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: [true, "A user must have an first name"],
  },

  lastName: {
    type: String,
    required: [true, "A user must have an last name"],
  },

  uid: {
    type: String,
    required: [true, "A user must have a uid"],
  },

  role: {
    type: String,
    enum: ['student', 'lecturer'],
    required: true
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;