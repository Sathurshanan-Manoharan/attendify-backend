const{timeTableModel,singleSession}=require('../models/timeTableModel') ;

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
module.exports={createTimeTable};
