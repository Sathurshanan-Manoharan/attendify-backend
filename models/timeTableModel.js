const mongoose = require("mongoose");
const singleSession = {
    startTime:{
        type:String,
        required:true,
    },
    endTime:{
        type:String,
        required:true,
    },
    lectureTitle:{
        type:String,
        required:true,
    },
    instructor:{
        type:String,
        required:true,
    },
    venue: {
        type:String,
        required:true,
    },
};

const timeTableSchema = new mongoose.Schema({
    tutorialGroup:{
        type:String,
        required:true,
    },
    day: {
        type:String,
        required:true,
    },
    sessions: [singleSession],
});

const timeTableModel=mongoose.model("timetable",timeTableSchema);
module.exports = timeTableModel;
