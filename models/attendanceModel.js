const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time_range: {
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
  tutorial_group: { type: String, required: true },
  lecture_title: { type: String, required: true },
  venue: { type: String, required: true },
  instructor: {
    name: { type: String, required: true },
    id: { type: String, required: true },
  },
  status: {
    type: String,
    required: true,
    enum: ["held", "canceled", "pending"],
  }, 
  students_present: { type: [String], default: [] }, 
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
