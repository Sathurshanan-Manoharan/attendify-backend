const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const timeTableModel = require('../models/timeTableModel');
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
    
        fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on('data', (row, index) => {
                if (index === 0) {
                    // Extract metadata from the first row of the CSV file
                    metadata = {
                        courseType: row[2],
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

async function processCSVData(csvData, metadata) {
    const { tutorialGroup, level,courseType } = metadata;

    for (const row of csvData) {
        const { day, startTime, endTime, moduleName, moduleCode, Venue, instructor } = row;

       // console.log('Row:', row)

        // Create new time table entry
        const newTimeTableEntry = new timeTableModel({
            tuturialGroup: [{
                groupName: tutorialGroup,
                days: [{
                    dayName: day,
                    sessions: [{
                        startTime: startTime,
                        endTime: endTime,
                        module: moduleName + moduleCode ,
                        lecturer: instructor,
                        course: courseType,
                        venue: Venue,
                        level: level,
                        title: moduleName
                    }]
                }]
            }]
        });

        try {
            await newTimeTableEntry.save();
        } catch (error) {
            console.error('Error saving time table entry:', error);
            throw error; // Rethrow the error for proper error handling
        }
    }
}


exports.createTimeTable = async (req, res) => {
    try {
        const { tutorialGroup, day, sessions } = req.body;
        const newTimeTable = new TimeTableModel({
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

exports.readTimetable = async (req, res) => {
    try {
        const timetableData = await TimeTableModel.find();
        res.status(200).json({
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

exports.updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTimetable = await TimeTableModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedTimetable) {
            return res.status(404).json({
                status: "error",
                message: "Timetable not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                timetable: updatedTimetable,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

exports.deleteTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTimetable = await TimeTableModel.findByIdAndDelete(id);
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
