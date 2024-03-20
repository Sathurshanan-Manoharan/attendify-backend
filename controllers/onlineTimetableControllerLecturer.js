const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const Timetable = require('../models/timeTableModelLecturer.js');
const upload = multer({ dest: 'timetableupload' });

exports.uploadTimetableTwo = async (req, res) => {
    upload.single('csvFile')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Internal Server Error' });
        } else if (err) {
            return res.status(400).json({ error: 'Bad Request' });
        }
    
        if (!req.file) {
            return res.status(400).json({ error: 'No File Uploaded' });
        }
    
        const csvData = [];
    
        fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on('data', (row) => {
                csvData.push(row);
            })
            .on('end', async () => {
                
                try {
                   
                    await processCSVData(csvData, req.body);
                    res.json({ message: 'CSV data processed and saved successfully' });
                    console.log('CSV file processed successfully');

                    fs.unlink(req.file.path, (err) => {
                        if (err) {
                            console.error('Error deleting CSV file:', err);
                        } else {
                            console.log('CSV file deleted successfully');
                        }
                    });
                    
                } catch (error) {
                    console.error('Error processing CSV data:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            });
    });
};
async function processCSVData(csvData, lecturerEmailEntered) {
    const sessionsByDay = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    };

    for (const row of csvData) {
        const { day, startTime, endTime, moduleName, venue, level, tutorialGroups, courseType } = row;

        
        const session = {
            start_time: startTime,
            end_time: endTime,
            lecture_title: moduleName,
            venue: venue,
            group_name: tutorialGroups, 
            level_name: level,
            course_type: courseType,
        };

        sessionsByDay[day.trim()].push(session);
    }

    
    const days = Object.keys(sessionsByDay).map(day => ({
        day,
        sessions: sessionsByDay[day],
    }));

    const newTimeTableEntry = new Timetable({ lecturerEmail: lecturerEmailEntered.lecturerEmail, days });

    try {
        await newTimeTableEntry.validate();
        await newTimeTableEntry.save();
    } catch (error) {
        console.error('Error saving timetable entry:', error);
        throw error;
    }
}
