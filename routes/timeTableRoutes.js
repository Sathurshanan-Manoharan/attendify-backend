const express = require('express');
const { createTimeTable } = require("../controllers/timeTableController")
 
const timeTableRouter=express.Router();
timeTableRouter.post("/add-time",createTimeTable);
module.exports={timeTableRouter};
