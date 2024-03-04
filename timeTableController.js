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
        const timetableData = await timeTableModel.find()
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

const multer = require('multer');
const upload = multer({dest: "/upload"}); //need to enter destination folder for uploaded file
const csvParser = require('csv-parser');
const csvParser = require('csv-parser');
const fs = require('fs');

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/timetableDB', { useNewUrlParser: true, useUnifiedTopology: true });




app.post('/upload', upload.single('file'), (req, res) => {
    // Handle file upload logic here
  });

  app.post('/upload', upload.single('file'), (req, res) => {
    // Process the uploaded CSV file
    const csvData = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (row) => {
        csvData.push(row);
      })
      .on('end', () => {
        // Process the CSV data and insert into the database
        // Call a function to handle database operations
        handleCSVData(csvData);
        res.json({ message: 'CSV file uploaded and processed successfully' });
      });
  });

  app.post('/upload', upload.single('file'), (req, res) => {
    const csvData = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (row) => {
        csvData.push(row);
      })
      .on('end', () => {
        // Process the CSV data and insert into the database
        handleCSVData(csvData);
        res.json({ message: 'CSV file uploaded and processed successfully' });
      });
  });

  // server.js
function handleCSVData(csvData) {
    // Process the CSV data to extract timetable information
    csvData.forEach((row) => {
      // Extract timetable information from each row
      const courseName = row.CourseName;
      const tutorialGroup = row.TutorialGroup;
      const level = row.Level;
  
      // Perform any additional processing or validation
      // Insert the timetable information into the database
      insertTimetableData(courseName, tutorialGroup, level);
    });
  }

  const timetableSchema = new mongoose.Schema({
    courseName: String,
    tutorialGroup: String,
    level: String
  });
  
  const Timetable = mongoose.model('Timetable', timetableSchema);
  
  function insertTimetableData(courseName, tutorialGroup, level) {
    const timetableEntry = new Timetable({
      courseName: courseName,
      tutorialGroup: tutorialGroup,
      level: level
    });
  
    timetableEntry.save((err, timetable) => {
      if (err) {
        console.error('Error saving timetable entry:', err);
      } else {
        console.log('Timetable entry saved successfully:', timetable);
      }
    });
  }
  
