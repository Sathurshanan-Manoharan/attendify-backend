const{timeTableModel}=require('../models/timeTableModel') ;

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

const updateTimetable = async(req, res) => {
    try {
        const { id } = req.params;
        const { tutorialGroup, day, sessions } = req.body; //Get updated data

        const updatedTimetable  = await timeTableModel.findAndUpdate(
            id,
            { tutorialGroup, day, sessions },
            { new: true}
        );

        if (!updateTimetable) {
            return res.status(404).json({
                status: "error",
                message: "Timetable not found",
            });
        }

        
    }
}
module.exports={createTimeTable};
