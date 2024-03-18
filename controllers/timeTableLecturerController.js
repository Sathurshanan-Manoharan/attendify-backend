const Lecturertimetable = require('../models/timeTableModelLecturer.js');
const multer = require('multer');

const upload = multer({ dest: 'timetableupload' });

exports.uploadTimetable = async (req, res) => {
    upload.single('csvFile')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Internal Server Error' });
        } else if (err) {
            return res.status(400).json({ error: 'Bad Request' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No File Uploaded' });
        }

        console.log('File Received', req.file);

        res.json({ message: "File uploaded successfully" });
    });
};

exports.createTimeTable = async (req, res) => {
    try {
        const { tutorialGroup, day, sessions } = req.body;
        const newTimeTable = new Lecturertimetable({
            tutorialGroup: tutorialGroup,
            day: day,
            sessions: sessions,
        });
        await newTimeTable.save();
        return res.status(201).json({
            data: newTimeTable
        });
    } catch (e) {
        return res.status(400).json({
            message: e
        });
    }
};

exports.readTimetable = async (req, res) => {
    try {
        const timetableData = await Lecturertimetable.find();
        res.status(200).json({
            status: "success",
            results: timetableData.length,
            data: {
                timetable: timetableData,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

exports.updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTimetable = await Lecturertimetable.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedTimetable) {
            return res.status(404).json({
                status: "error",
                message: "Timetable not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                timetable: updatedTimetable,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

exports.deleteTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTimetable = await Lecturertimetable.findByIdAndDelete(id);
        if (!deletedTimetable) {
            return res.status(404).json({
                status: "error",
                message: "Timetable not found",
            });
        }
        res.status(200).json({
            status: "success",
            message: "Timetable deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};
