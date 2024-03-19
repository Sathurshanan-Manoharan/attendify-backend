const mongoose = require("mongoose");
const moment = require("moment-timezone");

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
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
  students_present: {
    type: [
      {
        studentID: { type: String, ref: "Student" },
        check_in_time: String,
      },
    ],
    default: [],
  },
});

attendanceSchema.pre("save", function (next) {
  const colomboTimezone = "Asia/Colombo";

  // Assuming 'startTime' and 'endTime' are properties in your schema
  const startTime = moment.tz(this.start_time, "hh:mm A", colomboTimezone);
  const endTime = moment.tz(this.end_time, "hh:mm A", colomboTimezone);

  this.start_time = startTime.toDate();
  this.end_time = endTime.toDate();
  next();
});
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
