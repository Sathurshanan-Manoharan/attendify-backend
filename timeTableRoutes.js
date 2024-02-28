const express = require('express');
const { createTimeTable } = require("../controllers/timeTableController");
const { updateTimetable } = require('./timeTableController');
 
const timeTableRouter=express.Router();
timeTableRouter.post("/add-time",createTimeTable);
timeTableRouter.put("/:id", updateTimetable)
module.exports={timeTableRouter};
