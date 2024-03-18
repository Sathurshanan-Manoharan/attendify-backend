const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const Timetable = require('../models/timeTableModelLecturer.js');
//const upload = multer({ dest: 'timetableupload/' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'timetableupload/');
    },
    filename: function (req, file, cb) {
      const originalFileName = file.originalname;
      cb(null, originalFileName);
    }
  });
  
  
  //Sends the csv data to the specified location
  const upload = multer({ storage: storage});

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
                    const { lecturerEmail } = req.body;
                    await processCSVData(csvData, { lecturerEmail });
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
    const lecturerEmail = req.lecturerEmail.trim(); 

    // Define an array to store tutorial groups
    let selectedTutorialGroups = [];

    // Create an object to store sessions grouped by day
    const sessionsByDay = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    };

    // Loop through the CSV data to process each row
    for (const row of csvData) {
        const { day, startTime, endTime, moduleName, moduleCode, venue, level, tutorialGroups, courseType } = row;

        // Create session object
        const session = {
            start_time: startTime.trim(),
            end_time: endTime.trim(),
            lecture_title: moduleName.trim(),
            venue: venue.trim(),
        };

        // Push session to the corresponding day
        sessionsByDay[day.trim()].push(session);

        // Extract and add tutorial groups to the selectedTutorialGroups array
        const groupsArray = tutorialGroups.split(',').map(group => group.trim());
        selectedTutorialGroups = selectedTutorialGroups.concat(groupsArray);
    }

    // Deduplicate the tutorial groups array
    selectedTutorialGroups = [...new Set(selectedTutorialGroups)];

    // Create new time table entry
    const newTimeTableEntry = new Timetable({
        timetable_id: lecturerEmail,
        level_name: "level",
        course_type: "courseType",
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
        throw error;
    }
}
