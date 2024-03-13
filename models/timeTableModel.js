//importing the mongoose library
const mongoose = require("mongoose");

//sub models
const timeSlot = {
  

  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  module: {
    type: String,
  },
  lecturer: {
    type: String,
  },
  course: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  level: {
    type: String,
  },
  title: {
    type: String,
    requied: true,
  },
};

const day = {
  dayName: {
    type: String,
    requied: true,
  },
  sessions: [timeSlot],
};

const tuturialGroup = {
  groupName: {
    type: String,
    required: true,
  },
  days: {
    type: [day],
  },
};

// parent model
const timeTableSchema = new mongoose.Schema({
  tuturialGroups: {
    type: [tuturialGroup],
  },

  name: {
    type: String,
  },
});

const timeTableModel = mongoose.model("timetable", timeTableSchema);

module.exports =  timeTableModel ;