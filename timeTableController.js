const{timeTableModel}= require('../models/timeTableModel') ;

const createTimeTable = async(req,res)=>{
    try{
        const{tutorialGroup,day,sessions}=req.body
        const newTimeTable=new timeTableModel({
            tutorialGroup:tutorialGroup,
            day:day,
            sessions:sessions,
        })
        await newTimeTable.save();
        return res.status(201).json({
            data:newTimeTable
        })

    }catch(e){
        return res.status(400).json({
            message:e
        })
    }
};


const readTimetable = async (req, res) => {
    try {
    
        const timetableData = await timeTableModel.find();

        res.status(201).json({
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


module.exports={createTimeTable,readTimetable};
