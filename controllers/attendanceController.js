const moment = require("moment-timezone");
const Attendance = require("../models/attendanceModel");
const Timetable = require("../models/timeTableModel");
const UserStudent = require("../models/studentModel");

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
    const currentTimeString = moment().tz("Asia/Colombo").format("hh:mm A");

    const user = await UserStudent.findOne({ uid: req.params.id });

    const attendance = await Attendance.findOneAndUpdate(
      {
        venue: req.body.venue,
        start_time: { $lte: currentTime },
        end_time: { $gte: currentTime },
        //Check if element with user_is is already present in the array
        students_present: {
          $not: { $elemMatch: { studentID: user.studentID } },
        },
      },
      //Appends an object comprised of StudentID and Check-in Time to Array
      {
        $addToSet: {
          students_present: {
            studentID: user.studentID,
            check_in_time: currentTimeString,
          },
        },
      },
      { new: true }
    );

    if (!attendance) {
      //Is also displayed if the same user tries to check-in twice
      res.status(404).json({
        status: "fail",
        message: "No attendance found",
      });
      return; //Stop further execution
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

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    const studentIDs = attendance.students_present.map(
      (student) => student.studentID
    );

    const studentsInfoPromises = studentIDs.map((studentID) =>
      UserStudent.findOne({ studentID })
    );

    const studentsInfo = await Promise.all(studentsInfoPromises);
    
    const studentsPresent = attendance.students_present.map(
      (student, index) => ({
        studentID: student.studentID,
        studentInfo: studentsInfo[index],
        check_in_time: student.check_in_time,
        date: attendance.date,
      })
    );
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
