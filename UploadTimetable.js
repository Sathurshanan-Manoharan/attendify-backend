const { timeTableModel } = require('../models/timeTableModel');
const multer = require('multer');
const upload = multer({ dest: "/upload" }); // Need to enter destination folder for uploaded file
const csvParser = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
/*
// Define routes
app.post('/upload', upload.single('file'), handleFileUpload);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:5173//api/v1/attendance', { useNewUrlParser: true, useUnifiedTopology: true });

// Define mongoose schema for timetable
const timetableSchema = new timeTableModel({
    courseName: String,
    tutorialGroup: String,
    day: String,
    
});

// Define mongoose model
const Timetable = mongoose.model('Timetable', timetableSchema);

// Function to handle file upload
function handleFileUpload(req, res) {
    const csvData = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (row) => {
            csvData.push(row);
        })
        .on('end', async () => {
            try {
                // Process the CSV data and insert into the database
                await handleCSVData(csvData);
                res.json({ message: 'CSV file uploaded and processed successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
}


// Function to process CSV data
async function handleCSVData(csvData, metadata) {
    for (const row of csvData) {
        const { day, startTime, endTime,moduleName,moduleCode,Venue,instructor } = row;
        try {
            // Insert the timetable information into the database
            await insertTimetableData( day, startTime, endTime,moduleName,moduleCode,Venue,instructor);
        } catch (error) {
            console.error('Error saving timetable entry:', error);
        }
    }
}

async function handleCSVData(csvData) {
    for (const row of csvData) {
        const { day, startTime, endTime, moduleName, moduleCode, Venue, instructor } = row;

        // Perform any additional processing or validation here
        
        try {
            // Save the extracted data to your database or perform other operations
            // For example, you can create a new document in your MongoDB collection
            const newTimeSlot = new TimeSlot({
                startTime: startTime,
                endTime: endTime,
                module: moduleName,
                moduleCode: moduleCode,
                venue: Venue,
                lecturer: instructor,
                // You can add more fields as per your schema
            });

            const day = 

            // Save the new time slot to the database
            await newTimeSlot.save();
        } catch (error) {
            console.error('Error saving time slot:', error);
        }
    }
}

// Function to insert timetable data into the database
async function insertTimetableData(courseName, tutorialGroup, level,csvData) {
    const timetableEntry = new Timetable({
        courseName: courseName,
        tutorialGroup: tutorialGroup,
        level: level,
        csvData : csvData
    });

    await timetableEntry.save();
    console.log('Timetable entry saved successfully:', timetableEntry);
}

// Function to create a new timetable entry
const createTimeTable = async (req, res) => {
    try {
        const { tutorialGroup, day, sessions } = req.body;
        const newTimeTable = new timeTableModel({
            tutorialGroup: tutorialGroup,
            day: day,
            sessions: sessions,
        });
        await newTimeTable.save();
        return res.status(201).json({
            data: newTimeTable
        });
    } catch (e) {
        return res.status(400).json({
            message: e
        });
    }
};

// Function to read timetable data
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

// Export functions
module.exports = { createTimeTable, readTimetable };

*/