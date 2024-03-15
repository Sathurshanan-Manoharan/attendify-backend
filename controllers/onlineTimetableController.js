const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const Timetable = require('../models/timeTableModel.js');
const upload = multer({ dest: 'timetableupload' });

exports.uploadTimetable = async (req, res) => {
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
                csvData.push(row); // Push each row directly into csvData
            })
            .on('end', async () => {
                // Process the CSV data and save to the database
                try {
                    // Parse courseType, selectedTutorialGroups, and level from the request body
                    const { courseType, selectedTutorialGroups, level } = req.body;
                    await processCSVData(csvData, { courseType, selectedTutorialGroups, level });
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

async function processCSVData(csvData, req) {
    const courseType = req.courseType.trim(); // Corrected line
    const selectedTutorialGroups = req.selectedTutorialGroups.trim().split(',');
    const level = req.level.trim();
    
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
        const { date, day, startTime, endTime, moduleName, moduleCode, venue, instructor } = row;

        // Create session object
        const session = {
            start_time: startTime.trim(), // Example start time
            end_time: endTime.trim(), // Example end time
            lecture_title: moduleName.trim(), // Example lecture title
            instructor: instructor.trim(), // Example instructor
            venue: venue.trim(), // Example venue
        };

        // Push session to the corresponding day
        sessionsByDay[day.trim()].push(session);
    }

    // Create new time table entry
    const newTimeTableEntry = new Timetable({
        timetable_id: (level + selectedTutorialGroups.join('') + courseType).replace(/\s+/g, ''),
        level_name: level,
        tutorial_groups: selectedTutorialGroups.map(group_name => ({
            group_name,
            days: Object.entries(sessionsByDay).map(([day, sessions]) => ({
                day,
                sessions
            }))
        }))
    });

    try {
        await newTimeTableEntry.validate();
        await newTimeTableEntry.save();
    } catch (error) {
        console.error('Error saving time table entry:', error);
        throw error; // Rethrow the error for proper error handling
    }
}
