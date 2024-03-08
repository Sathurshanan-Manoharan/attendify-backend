const moment = require("moment-timezone");
const Attendance = require("../models/attendanceModel");

exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.status(200).json({
      status: "success",
      results: attendance.length,
      data: {
        attendance,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const newAttendance = await Attendance.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        attendance: newAttendance,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const currentTime = moment().tz('Asia/Colombo');

    const user = await User.findOne({ uid: req.params.id });

    const attendance = await Attendance.findOneAndUpdate(
      {
        venue: req.body.venue,
        start_time: { $lte: currentTime },
        end_time: { $gte: currentTime },
      },
      { $addToSet: { students_present: user.iitId } },
      { new: true }
    );

    if (!attendance) {
      res.status(404).json({
        status: 'fail',
        message: 'No attendance found',
      });
      return; // Stop further execution
    }

    res.status(200).json({
      status: 'success',
      data: {
        attendance,
      },
    });
  } catch (err) {
    console.error('Error in markAttendance:', err);

    if (err.name === 'ValidationError') {
      res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  }
};