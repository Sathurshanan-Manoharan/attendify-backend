const express = require('express');
const timeTableController = require('../controllers/timeTableController');
const timeTableRouter=express.Router();

timeTableRouter
    .route("/")
    .post(timeTableController.createTimeTable)
    .get(timeTableController.readTimetable)
    .put(timeTableController.updateTimetable)
    .delete(timeTableController.deleteTimetable);

module.exports= timeTableRouter;
