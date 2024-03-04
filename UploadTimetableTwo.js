const { timeTableModel } = require('../models/timeTableModel');
const multer = require('multer');
const upload = multer({ dest: "/upload" }); // Need to enter destination folder for uploaded file
const csvParser = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Define routes
app.post('/upload', upload.single('file'), handleFileUpload);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:5173//api/v1/attendance', { useNewUrlParser: true, useUnifiedTopology: true });

// Define mongoose schema for timetable
const timetableSchema = new mongoose.Schema({
    time: String,
    day: String,
    course: String,
    tutorialGroup: String
});

// Define mongoose model
const Timetable = mongoose.model('Timetable', timetableSchema);

// Function to handle file upload
function handleFileUpload(req, res) {
    const csvData = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', async (row) => {
            try {
                // Process the CSV data and insert into the database
                await handleCSVData(row);
            } catch (error) {
                console.error('Error processing CSV row:', error);
            }
        })
        .on('end', () => {
            res.json({ message: 'CSV file uploaded and processed successfully' });
        });
}

// Function to process CSV data
async function handleCSVData(row) {
    const { Time, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = row;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const times = Time.split(' - ');

    for (let i = 0; i < 7; i++) {
        const day = days[i];
        const course = row[day];
        if (course) {
            const timetableEntry = new Timetable({
                time: times[i],
                day: day,
                course: course,
                tutorialGroup: row['Tutorial Groups']
            });
            await timetableEntry.save();
            console.log('Timetable entry saved successfully:', timetableEntry);
        }
    }
}

// Export functions
module.exports = { handleFileUpload };

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
