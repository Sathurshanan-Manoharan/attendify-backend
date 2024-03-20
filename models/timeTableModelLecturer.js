const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  lecture_title: { type: String, required: true },
  venue: { type: String, required: true },
  group_name: { type: String, required: true },
  level_name: { type: String, required: true },
  course_type: {type: String,required: true},

});

const daySchema = new mongoose.Schema({
  day: { type: String, required: true },
  sessions: [sessionSchema],
});

const timetableSchema = new mongoose.Schema({
  lecturerEmail: { type: String, required: true },
  days: [daySchema],
});

const Lecturertimetable = mongoose.model('lecturerTimetable', timetableSchema);

module.exports = Lecturertimetable;
