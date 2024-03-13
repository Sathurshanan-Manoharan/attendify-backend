const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  lecture_title: { type: String, required: true },
  instructor: { type: String, required: true },
  venue: { type: String, required: true },
});

const daySchema = new mongoose.Schema({
  day: { type: String, required: true },
  sessions: [sessionSchema],
});

const tutorialGroupSchema = new mongoose.Schema({
  group_name: { type: String, required: true },
  days: [daySchema],
});

const timetableSchema = new mongoose.Schema({
  timetable_id: { type: String, required: true },
  level_name: { type: String, required: true },
  tutorial_groups: [tutorialGroupSchema],
});

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
