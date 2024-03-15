const timeTableModel = require('../models/timeTableModel') ;

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
const createATutorialGroup = (groupName) => {
    const enum_days = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
    ];

    let groupObj = {};
    groupObj.groupName = groupName || "no name";
    groupObj.days = [];

    enum_days.forEach((element) => {
        let currentDayObj = {};
        currentDayObj.dayName = element;
        currentDayObj.sessions = [];
        groupObj.days.push(currentDayObj);
    });

    return groupObj;
};

  
  


exports.updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTimetable = await timeTableModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedTimetable) {
            return res.status(404).json({
                status: "error",
                message: "Timetable not found"
            });
        }

        const {
            day,
            start_time,
            end_time,
            lecture_title,            
            instructor,
            venue,
            level_name,
        } = req.body;

        const group_name = req.body.group_name || "Group A";
        let tempArr = [];

        updatedTimetable.tutorial_groups.forEach((tutorialGroupSchema) => {
            if (tutorialGroupSchema.group_name === group_name) {
                let foundDay = false;

                tutorialGroupSchema.days.forEach((daySchema) => {
                    if (daySchema.day === day) {
                        tempArr = daySchema.sessions;
                        foundDay = true;

                        let foundTimeSlot = false;

                        for (let i = 0; i < daySchema.sessions.length; i++) {
                            let session = daySchema.sessions[i];

                            if (session.start_time === start_time && session.end_time === end_time) {
                                session.instructor = instructor;
                                session.level_name = level_name;
                                session.lecture_title = lecture_title;
                                session.end_time = end_time;
                                session.start_time = start_time;
                                session.venue = venue;
                                foundTimeSlot = true;

                                break;
                            }
                        }

                        if (!foundTimeSlot) {
                            let obj = {
                                start_time: start_time,
                                end_time: end_time,
                                instructor: instructor || null,
                                level_name: level_name || null,
                                lecture_title: lecture_title || null,
                                venue: venue
                            };

                            daySchema.sessions.push(obj);
                        }
                    }
                });

                if (!foundDay) {
                    let obj = {
                        start_time: start_time,
                        end_time: end_time,
                        instructor: instructor || null,
                        level_name: level_name || null,
                        lecture_title: lecture_title || null,
                        venue: venue
                    };

                    let temp = [obj];

                    tutorialGroupSchema.days.push({
                        day: day,
                        sessions: temp
                    });
                }
            } else {
                let obj = {
                    start_time: start_time,
                    end_time: end_time,
                    instructor: instructor || null,
                    level_name: level_name || null,
                    lecture_title: lecture_title || null,
                    venue: venue
                };

                let newTutorialGroup = createATutorialGroup(tutorialGroupSchema);
                newTutorialGroup.days.forEach(day => {
                    if (daySchema.day === day) {
                        daySchema.sessions.push(obj);
                    }
                });
                updatedTimetable.tutorialGroupSchema.push(newTutorialGroup);
            }
        });

        res.status(200).json({
            status: "success",
            data: {
                timetable: updatedTimetable
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};
exports.deleteTimetable = async (req, res) => {
    try{
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
const deleteTimeSlot = async (req, res) => {
    const { day, end_time, start_time } = req.query;
    console.log(start_time);
    try {
        const { id } = req.params;
        const foundTable = await timeTableModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
      if (foundTable) {
        const group_name = req.query.tutorialGroupSchema|| "Group A";
        foundTable.tutorial_groups.forEach((tutorialGroupSchema) => {
          if (tutorialGroupSchema.group_name === group_name) {
            tutorialGroupSchema.days.forEach((daySchema) => {
              if (daySchema.day === day) {
                daySchema.sessions.forEach((session) => {
                  if (
                    session.start_time === start_time &&
                    session.end_time === end_time
                  ) {
                    session.instructor = null;
                  }
                });
              }
            });
          }
        });
  
        await foundTable.save();
  
        return res.status(200).json({ msg: "table slot deleted" });
      }
    } catch (e) {
      return res.status(400).json({ msg: e.message });
    }
  };
  const getTimeSlot = async (req, res) => {
    const { day, start_time, end_time } = req.query;
    try {
        const { id } = req.params;
        const foundTable = await timeTableModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
      if (foundTable) {
        var foundSession = null;
        const group_name = req.query.tutorialGroupSchema || "Group A";
        //iterating tutorial groups
        foundTable.tutorial_groups.forEach((tutorialGroupSchema) => {
          if (tutorialGroupSchema.group_name === group_name) {
            //iterating days in the matched tutorial group
            tutorialGroupSchema.days.forEach((daySchema) => {
              if (day.day === day) {
                daySchema.sessions.forEach((session) => {
                  if (
                    session.start_time === start_time &&
                    session.end_time === end_time
                  ) {
                    foundSession = session;
                  }
                });
              }
            });
          }
        });
        return res.status(200).json({ session: foundSession });
      }
    } catch (e) {
      return res.status(400).json({ msg: e.message });
    }
  };
  const getGroup = async(req,res)=>{
    const { day, group_name } = req.query;
    try {
        const { id } = req.params;
        const foundTable = await timeTableModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
      if (foundTable) {
        var foundSession = null;
        const group_name = req.query.tutorialGroupSchema || "Group A";
        //iterating tutorial groups
        foundTable.tutorial_groups.forEach((tutorialGroupSchema) => {
          if (tutorialGroupSchema.group_name === group_name) {
            //iterating days in the matched tutorial group
            tutorialGroupSchema.days.forEach((daySchema) => {
              if (daySchema.day === day) {
                daySchema.sessions.forEach((session) => {
                  if (
                    session.start_time === start_time &&
                    session.end_time === end_time
                  ) {
                    foundSession = session;
                  }
                });
              }
            });
          }
        });
  
        return res.status(200).json({ session: foundSession });
      }
    } catch (e) {
      return res.status(400).json({ msg: e.message });
    }
  }
  const getAllTimeSlotsForADay = async (req, res) => {
    const { day } = req.query;
  
    try {
        const { id } = req.params;
        const foundTable = await timeTableModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
  
      if (foundTable) {
        let foundSessions = [];
  
        const group_name = req.query.tutorialGroupSchema || "Group A";
  
        //iterating tutorial groups
        foundTable.tutorial_groups.forEach((tutorialGroupSchema) => {
          if (tutorialGroupSchema.group_name === group_name) {
            //iterating days in the matched tutorial group
            tutorialGroupSchema.days.forEach((daySchema) => {
              if (daySchema.day === day) {
                foundSessions = daySchema.sessions;
              }
            });
          }
        });
  
        return res.status(200).json({ timeslots: foundSessions });
      }
  
      return res.status(404).json({ timeslots: [] });
    } catch (e) {
      return res.status(400).json({ msg: e.message });
    }
  };
  
  
  module.exports = {
    getTimeSlot,
    deleteTimeSlot,
    createATutorialGroup,
    getGroup,
   
  };
    
  
