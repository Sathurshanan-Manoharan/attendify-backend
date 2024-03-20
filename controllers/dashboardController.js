const Attendance = require("../models/attendanceModel");
const Lecturertimetable = require("../models/timeTableModelLecturer");
const LecturerModel = require("../models/lecturerModel");
const moment = require("moment");

exports.getSessionDetails = async (req, res) => {
  try {
    // Get the lecturer's email from the request parameters
    const lecturerEmail = req.params.lecturerEmail;

    // Find the lecturer using the email to get the lecturer ID
    const lecturer = await LecturerModel.findOne({
      iitEmail: lecturerEmail
    });

    // If no lecturer found, return an error response
    if (!lecturer) {
      return res.status(404).json({
        status: "error",
        message: "Lecturer not found."
      });
    }

    
    const currentTime = new Date().toString();

    // Find a session that matches the requested start and end times and the lecturer ID
    const session = await Attendance.findOne({
      start_time: { $lte: currentTime }, // Session start time should be less than or equal to the current time
      end_time: { $gte: currentTime },   // Session end time should be greater than or equal to the current time
      "instructor.id": lecturer.LecturerID // Use the lecturer's ID
    });

    // If no session found, return empty data
    if (!session) {
      return res.status(200).json({
        status: "success",
        message: "No session found.",
        id : lecturer.LecturerID,
        currentTime : currentTime,
        data: {
          total_students_attended: 0,
          expectedStudents: 0,
          lateArrivals: 0,
          onTime: 0,
          absent: 0
        }
      });
    }

    // Total number of students attended
    const totalStudentsAttended = session.students_present.length;

    // Calculate late arrivals and on time students
    const lateArrivals = session.students_present.filter(student => {
      const checkInTime = moment(student.check_in_time, "hh:mm A").toDate(); // Convert check-in time string to Date object
      const fifteenMinutesAfterStart = new Date(session.start_time);
      fifteenMinutesAfterStart.setMinutes(fifteenMinutesAfterStart.getMinutes() + 15);
      return checkInTime > fifteenMinutesAfterStart; // If check-in time is after 15 minutes past the session start time, it's a late arrival
    }).length;

    const onTime = totalStudentsAttended - lateArrivals;

    // Calculate expected students (total students in the session)
    const expectedStudents = session.students_present.length;

    // Calculate absent students
    const absent = expectedStudents - totalStudentsAttended;

    // Session details found, send them to frontend along with the calculated values
    res.status(200).json({
      status: "success",
      data: {
        ...session.toObject(),
        total_students_attended: totalStudentsAttended,
        expectedStudents: expectedStudents,
        lateArrivals: lateArrivals,
        onTime: onTime,
        absent: absent
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};


exports.getLecturerSessions = async (req, res) => {
  try {
    // Get the lecturer's email from the request parameters
    const lecturerEmail = req.params.lecturerEmail;

    // Get the current day
    const currentDay = moment().format("dddd"); // e.g., "monday"

    // Find the lecturer's timetable using the email
    const lecturerTimetable = await Lecturertimetable.findOne({
      lecturerEmail: lecturerEmail
    });

    // If no timetable found for the lecturer, return an empty response
    if (!lecturerTimetable) {
      return res.status(200).json({
        status: "success",
        message: "No timetable found for the lecturer.",
        data: {
          lecturerSessions: []
        }
      });
    }

    // Find sessions for the current day
    const day = lecturerTimetable.days.find(day => day.day === currentDay);

    // If no sessions found for the current day, return an empty response
    if (!day || !day.sessions || day.sessions.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No sessions found for the current day.",
        data: {
          lecturerSessions: []
        }
      });
    }

    // Sessions found, send them to the frontend
    res.status(200).json({
      status: "success",
      results: day.sessions.length,
      data: {
        lecturerSessions: day.sessions
      }
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
