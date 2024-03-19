const Attendance = require("../models/attendanceModel");
const moment = require("moment");


exports.getSessionDetails = async (req, res) => {
  try {
    // For testing purposes
    // const requestedStartTime = new Date("2024-03-19T10:30:00"); 
    // const requestedEndTime = new Date("2024-03-19T12:30:00"); 

    const currentTime = new Date();

    // Find a session that matches the requested start and end times and the lecturer ID
    const session = await Attendance.findOne({
        start_time: { $lte: currentTime }, // Session start time should be less than or equal to the current time
        end_time: { $gte: currentTime },   // Session end time should be greater than or equal to the current time
        "instructor.id": req.params.lecturerId // Assuming lecturerId is passed in the request params
    });

    // If no session found, return empty data
    if (!session) {
        return res.status(200).json({
          status: "success",
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
    // Handle any errors
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
