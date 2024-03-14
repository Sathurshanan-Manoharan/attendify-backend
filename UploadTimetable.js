const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const Timetable = require('./models/timeTableModel.js');
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
        let metadata = {}; // Initialize metadata object
    
        const stream = fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on('data', (row, index) => {
                if (index === 1) {
                    // Extract metadata from the first row of the CSV file
                    metadata = {
                        courseType: row[3],
                        tutorialGroup: row[2],
                        level: row[2],
                        // Add more metadata keys as needed
                    };
                    
                    console.log('Metadata:', metadata);
                    console.log('Row:', row); // Log the entire row object
                } else {
                    // Process each row of the CSV file
                    csvData.push(row);
                }
            })
            .on('end', async () => {
               
                // Process the CSV data and save to the database
                try {
                   
                    await processCSVData(csvData, metadata); // Pass metadata to processCSVData
                    res.json({ message: 'CSV data processed and saved successfully' });
                    console.log('CSV file processed successfully'); // Log success message

                    fs.unlink(req.file.path, (err) => {
                        if (err) {
                            console.error('Error deleting CSV file:', err);git
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

async function processCSVData(csvData, metadata) {
    
    const { tutorialGroup, level, courseType } = metadata;

    for (const row of csvData) {
        const {day, startTime, endTime, moduleName, moduleCode, venue, instructor } = row;

        // Create new time table entry
        const newTimeTableEntry = new Timetable({
            timetable_id: moduleName+courseType, // Example ID
            level_name: "level", // Example level name
            tutorial_groups: [{
                group_name: "tutorialGroup", // Example group name
                days: [{
                    day: startTime, // Example day
                    sessions: [{
                        start_time: startTime, // Example start time
                        end_time: endTime, // Example end time
                        lecture_title: moduleName, // Example lecture title
                        instructor: instructor, // Example instructor
                        venue: venue, // Example venue
                    }]
                }]
            }]
        });
        

        try {
            await newTimeTableEntry.validate();
            await newTimeTableEntry.save();
        } catch (error) {
            console.error('Error saving time table entry:', error);
            throw error; // Rethrow the error for proper error handling
        }
    }
}