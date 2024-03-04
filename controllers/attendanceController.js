const Attendance = require("../models/attendanceModel");
const multer = require('multer');

  const upload = multer({ dest: 'uploads/'});

exports.uploadAttendance = async (req, res) => {

    upload.single('csvFile')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: 'Internal Server Error' });
      } else if (err) {
        return res.status(400).json({ error: 'Bad Request'});
      }
  
      if (!req.file) {
        return res.status(400).json({ error: 'No File Uploaded' });
      }
  
      //Test if received
      console.log('File Received', req.file);
  
      res.json({ message: "File uploaded successfully" });
    })
};

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
    const attendance = await Attendance.findById(req.params.id);
    console.log(req.params.id);
    attendance.students_present.push(req.body.studentId);
    res.status(200).json({
      status: "success",
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
