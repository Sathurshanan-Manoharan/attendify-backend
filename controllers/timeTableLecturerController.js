const Lecturertimetable = require('../models/timeTableModelLecturer.js');
const multer = require('multer');

const upload = multer({ dest: 'timetableupload' });

exports.uploadTimetableTwo = async (req, res) => {
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

exports.createTimetable = async (req, res) => {
    try {
        const { days } = req.body; 
        const newTimetable = new Lecturertimetable({ days });
        const savedTimetable = await newTimetable.save();
        res.status(201).json({ message: 'Timetable created successfully(CRUD)', data: savedTimetable });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllTimetables = async (req, res) => {
    try {
        const timetables = await Lecturertimetable.find();
        res.status(200).json({ data: timetables });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const { days } = req.body; 
        const updatedTimetable = await Lecturertimetable.findByIdAndUpdate(id, { days }, { new: true });
        if (!updatedTimetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }
        res.status(200).json({ message: 'Timetable updated successfully', data: updatedTimetable });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTimetable = await Lecturertimetable.findByIdAndDelete(id);
        if (!deletedTimetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }
        res.status(200).json({ message: 'Timetable deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.readTimetableById = async (req, res) => {
    try {
        const { id } = req.params;
        const timetableData = await Lecturertimetable.findOne({ lecturerEmail : id });
        if (!timetableData) {
            return res.status(404).json({
                status: "error",
                message: "Timetable not found",
            });
        }
        res.status(200).json({
            status: "success",
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
