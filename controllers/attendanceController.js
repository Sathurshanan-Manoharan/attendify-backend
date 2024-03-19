const moment = require("moment-timezone");
const Attendance = require("../models/attendanceModel");
const multer = require('multer');
//Refers to Student Model
const UserStudent = require("../models/studentModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const originalFileName = file.originalname;
    cb(null, originalFileName);
  }
});


//Sends the csv data to the specified location
const upload = multer({ storage: storage});

//Receives CSV file
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
    //Used to compare with session times
    const currentTime = moment().tz('Asia/Colombo');
    //Used to store the time of user 'Check-in'
    const currentTimeString = moment().tz('Asia/Colombo').format('hh:mm A');

    const user = await UserStudent.findOne({ uid: req.params.id });

    const attendance = await Attendance.findOneAndUpdate(
      {
        venue: req.body.venue,
        start_time: { $lte: currentTime },
        end_time: { $gte: currentTime },
        //Check if element with user_is is already present in the array
        students_present: { $not: { $elemMatch: { user_id: user.studentID } } }
      },
      //Appends an object comprised of StudentID and Check-in Time to Array
      { $addToSet: { students_present: { user_id: user.studentID, check_in_time: currentTimeString} } },
      { new: true }
    );

    

    if (!attendance) {
      //Is also displayed if the same user tries to check-in twice
      res.status(404).json({
        status: 'fail',
        message: 'No attendance found',
      });
      return; //Stop further execution
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

exports.getAttendance = async (req, res) => {
  try {
    // find attendance by id and populate the students_present array

    const attendance = await Attendance.findById(req.params.id).populate('students_present.studentID');

    //i want to get the students present array
    const studentsPresent = attendance.students_present;
    // now send the students present array to the client
    res.status(200).json({
      status: "success",
      data: {
        studentsPresent,
      },
    });

    
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};