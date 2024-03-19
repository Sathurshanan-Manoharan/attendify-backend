const Attendance = require("../models/attendanceModel");
const moment = require("moment");


exports.getSessionDetails = async (req, res) => {
  try {
    const requestedStartTime = new Date("2024-03-19T10:30:00"); // Convert the requested start time to Date object
    const requestedEndTime = new Date("2024-03-19T12:30:00"); // Convert the requested end time to Date object

    // Find a session that matches the requested start and end times and the lecturer ID
    const session = await Attendance.findOne({
      start_time: requestedStartTime,
      end_time: requestedEndTime,
      "instructor.id": req.params.lecturerId // Assuming lecturerId is passed in the request params
    });

    // If no session found, return empty data
    if (!session) {
      return res.status(200).json({
        status: "success",
        message: "No session found for the requested lecturer at the specified time.",
        data: null,
      });
    }

    // Total number of students attended
    const totalStudentsAttended = session.students_present.length;

    // Calculate late arrivals and on time students

    // Calculate late arrivals and on time students
    const lateArrivals = session.students_present.filter(student => {
        const checkInTime = moment(student.check_in_time, "hh:mm A").toDate(); // Convert check-in time string to Date object
        const fifteenMinutesAfterStart = new Date(requestedStartTime);
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
        // ...session.toObject(),
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



// exports.getSessionDetails = async (req, res) => {
//   try {
//     const lecturerId = req.params.lecturerId;

//     // Find all attendance records for sessions associated with the lecturer
//     const sessions = await Attendance.find({ "instructor.id": lecturerId });

//     // If no sessions found, return empty data
//     if (!sessions || sessions.length === 0) {
//       return res.status(200).json({
//         status: "success",
//         data: [],
//       });
//     }

//     // Process the attendance records to extract required details
//     const sessionDetails = sessions.map((session) => {
//       return {
//         date: session.date,
//         start_time: session.start_time,
//         end_time: session.end_time,
//         students_attended: session.students_present.map((student) => {
//           return {
//             user_id: student.user_id,
//             check_in_time: student.check_in_time,
//           };
//         }),
//       };
//     });

//     // Send session details to frontend
//     res.status(200).json({
//       status: "success",
//       data: sessionDetails,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: err.message,
//     });
//   }
// };
