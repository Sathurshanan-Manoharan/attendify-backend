const moment = require("moment-timezone");
const Attendance = require("../models/attendanceModel");
const User = require("../models/userModel");
const Timetable = require("../models/timeTableModel");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const originalFileName = file.originalname;
    cb(null, originalFileName);
  },
});

//Sends the csv data to the specified location
const upload = multer({ storage: storage });

//Receives CSV file
exports.uploadAttendance = async (req, res) => {
  upload.single("csvFile")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: "Internal Server Error" });
    } else if (err) {
      return res.status(400).json({ error: "Bad Request" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No File Uploaded" });
    }

    //Test if received
    console.log("File Received", req.file);

    res.json({ message: "File uploaded successfully" });
  });
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
    const currentTime = moment().tz("Asia/Colombo");

    const user = await User.findOne({ uid: req.params.id });

    const attendance = await Attendance.findOneAndUpdate(
      {
        venue: req.body.venue,
        start_time: { $lte: currentTime },
        end_time: { $gte: currentTime },
      },
      {
        $addToSet: {
          students_present: { user_id: user.iitId, check_in_time: currentTime },
        },
      },
      { new: true }
    );

    if (!attendance) {
      res.status(404).json({
        status: "fail",
        message: "No attendance found",
      });
      return; // Stop further execution
    }

    res.status(200).json({
      status: "success",
      data: {
        attendance,
      },
    });
  } catch (err) {
    console.error("Error in markAttendance:", err);

    if (err.name === "ValidationError") {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  }
};

exports.createAttendanceFromTimetable = async (req, res) => {
  try {
    // const currentDay = moment().format("dddd");
    const currentDay = "Tuesday";
    const timetables = await Timetable.find({
      "tutorial_groups.days.day": currentDay,
    });

    if (!timetables || timetables.length === 0) {
      return res
        .status(404)
        .json({ message: "No timetables found for the current day" });
    }

    for (const timetable of timetables) {
      const { tutorial_groups } = timetable;

      for (const tutorialGroup of tutorial_groups) {
        const { group_name, days } = tutorialGroup;

        const daySessions = days.find((day) => day.day === currentDay);
        if (daySessions) {
          for (const session of daySessions.sessions) {
            const { start_time, end_time, lecture_title, instructor, venue } =
              session;

            const newAttendance = {
              date: moment().format("YYYY-MM-DD"),
              start_time,
              end_time,
              tutorial_group: group_name,
              lecture_title,
              venue,
              instructor: {
                name: instructor,
                id: session._id.toString(),
              },
              status: "pending",
              students_present: [],
            };

            await Attendance.create(newAttendance);
          }
        }
      }
    }

    res
      .status(201)
      .json({ message: "Attendance sessions created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
