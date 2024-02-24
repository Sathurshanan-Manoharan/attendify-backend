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
}

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
}