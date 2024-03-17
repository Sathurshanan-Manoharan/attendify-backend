const Lecturer = require("../models/lecturerModel");

exports.createLecturer = async (req, res) => {
    try {
      const lecturer = await Lecturer.create(req.body);
      res.status(201).json({
        status: "success",
        data: {
          user: lecturer,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  };
  
  exports.getAllLecturers = async (req, res) => {
    try {
      const lecturers = await Lecturer.find();
      res.status(200).json({
        status: "success",
        results: lecturers.length,
        data: {
          lecturers,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  };