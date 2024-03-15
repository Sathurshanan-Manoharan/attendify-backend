const timeTableModel = require("../models/timeTableModel");

exports.createTimeTable = async (req, res) => {
  try {
    const newTimeTable = await timeTableModel.create(req.body);

    return res.status(201).json({
      data: newTimeTable,
    });
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};
exports.readTimetable = async (req, res) => {
  try {
    const timetableData = await timeTableModel.find();

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
    console.log(id);
    const updatedTimetable = await timeTableModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true } //Return updated version
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
    const deletedTimetable = await timeTableModel.findByIdAndDelete(id);
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
