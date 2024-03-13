const fs = require('fs');
const path = require('path');
const Attendance = require("../models/attendanceModel");

exports.processCSV = (req, res) => {
    const uploadsFolder = './uploads'; // Update with the appropriate uploads folder path

    fs.readdir(uploadsFolder, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Internal Server Error');
        }
        const csvFile = files.find(file => file.endsWith('.csv'));

        if (!csvFile) {
            console.error('No CSV file found in the "uploads" directory');
            return res.status(404).send('CSV file not found');
        }

        const csvFilePath = path.join(uploadsFolder, csvFile);
        const attendees = [];

        fs.readFile(csvFilePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading CSV file:', err);
                return res.status(500).send('Error reading CSV file');
            }

            // Split the CSV data by lines
            const lines = data.trim().split('\n');

            // Skip the first two lines as they contain summary information
            for (let i = 11; i < lines.length; i++) {
                const line = lines[i].trim();

                //Set the delimitter to a semi colon
                const [Name, FirstJoin, LastLeave, InMeetingDuration, Email, ParticipantID, Role] = line.split(';');

                //Create an object representing the participant and push it to attendees array
                attendees.push({ Name, FirstJoin, LastLeave, InMeetingDuration, Email, ParticipantID, Role });
            }

            console.log('CSV file successfully processed');
                // Find the organiser and store their name in lecturerName variable
            const organiserIndex = attendees.findIndex(attendee => attendee.Role === 'Organiser');
            if (organiserIndex !== -1) {
                lecturerName = attendees[organiserIndex].Name;
            } else {
                console.log('No organiser found in the attendees list');
            }

            const filteredAttendees = attendees.filter(attendee => attendee.Role === 'Attendee');

            // Retrieve emails of the filtered attendees
            const attendeeEmails = filteredAttendees.map(attendee => attendee.Email);

            //Filter the Non-Westminster emails out
            const filteredEmails = attendeeEmails.filter(email => email.includes('@westminster.ac.uk'));

            // Extract the first 8 characters from each email
            const truncatedEmails = filteredEmails.map(email => email.substring(0, 8));

            Attendance.findOne({ lecture_title: "Introduction to Programming" })
            .then(attendance => {
                if (attendance) {
                    // Update the students_present array
                    attendance.students_present = truncatedEmails;
                    // Add start_time and end_time to the time_range object
                    attendance.time_range = {
                        start_time: "Fri Mar 08 2024 20:30:00 GMT+0530 (India Standard Time)", // Example: Current time
                        end_time: "Fri Mar 08 2024 22:30:00 GMT+0530 (India Standard Time)", // Example: Current time
                    };
                    // Save the updated document
                    return attendance.save();
                } else {
                    throw new Error('Attendance record not found');
                }
            })
            .then(updatedAttendance => {
                console.log('Attendance record updated successfully');
                res.json({ message: 'Attendance record updated successfully' });
            })
            .catch(error => {
                console.error('Error updating attendance record:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        
         });

    });
};

