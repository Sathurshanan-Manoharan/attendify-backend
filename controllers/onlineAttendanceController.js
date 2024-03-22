const fs = require('fs');
const path = require('path');
const Attendance = require("../models/attendanceModel");
let objectId;

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const originalFileName = file.originalname;
    cb(null, originalFileName);
  },
});

//Sends the csv data to the specified location
const upload = multer({ storage: storage });

//Receives CSV file
exports.uploadAttendance = async (req, res) => {

  //Extracts the query parameter passed
  objectId = req.query.objectId;

  upload.single("csvFile")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: "Internal Server Error" });
    } else if (err) {
      return res.status(400).json({ error: "Bad Request" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No File Uploaded" });
    }

    //Test if received
    console.log("File Received", req.file);
    console.log("Object ID Received", objectId);

    //res.json({ message: "File uploaded successfully" });

    processCSV(req, res);

  });
};


function processCSV(req, res) {
    const uploadsFolder = './uploads'; 
    console.log(objectId);

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

            //Split the CSV data by lines
            const lines = data.trim().split('\n');

            //Skip the first 11 lines
            for (let i = 11; i < lines.length; i++) {
                const line = lines[i].trim();

                //Set the delimitter to a comma
                const [Name, FirstJoinDate, FirstJoinTime, LastLeaveDate, LastLeaveTime, InMeetingDuration, Email, ParticipantID, Role] = line.split(',');

                //Create an object representing the participant and push it to attendees array
                attendees.push({ Name, FirstJoinDate, FirstJoinTime, LastLeaveDate, LastLeaveTime, InMeetingDuration, Email, ParticipantID, Role });
            }

            console.log('CSV file successfully processed');
                //Find the organiser and store their name in lecturerName variable
            const organiserIndex = attendees.findIndex(attendee => attendee.Role === 'Organiser');
            if (organiserIndex !== -1) {
                lecturerName = attendees[organiserIndex].Name;
            } else {
                console.log('No organiser found in the attendees list');
            }

            const filteredAttendees = attendees.filter(attendee => attendee.Role === 'Attendee');

            //Retrieve emails of the filtered attendees
            const attendeeEmails = filteredAttendees.map(attendee => attendee.Email);

            //Filter the Non-Westminster emails out
            const filteredEmails = attendeeEmails.filter(email => email.includes('@westminster.ac.uk'));

            const emailPattern = /^.*w\d{7}@westminster\.ac\.uk.*$/;

            //Filters out emails that do not fit the pattern
            const validEmails = filteredEmails.filter(email => emailPattern.test(email));
            
            const studentsPresent = validEmails.map(email => {
                
                const attendee = filteredAttendees.find(attendee => attendee.Email === email);
                if (attendee) {
                    //Extract only the user ID from the email
                    const userId = email.substring(0, 8);
            
                    //Format the check-in time
                    let formattedCheckInTime = attendee.FirstJoinTime.replace(/ (\d{1,2}:\d{2}):\d{2} (AM|PM)/, '$1 $2');

                    //Remove trailing double quotation mark
                    formattedCheckInTime = formattedCheckInTime.slice(0, -1);
            
                    return {
                        studentID: userId,
                        check_in_time: formattedCheckInTime
                    };
                } else {
                    console.warn(`No attendee found with email: ${email}`);
                    return null;
                }
            }).filter(Boolean);


            Attendance.findOneAndUpdate(
                { _id: objectId },
                { $set: { students_present: studentsPresent } },
                { new: true } // This option ensures that the updated document is returned
            )
            .then(updatedAttendance => {
                console.log('Attendance record updated successfully');
                //Delete the CSV file after processing 
                fs.unlink(csvFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting CSV file:', err);
                    } else {
                        console.log('CSV file deleted successfully')
                    }
                })
                res.json({ message: 'Attendance record updated successfully' });
            })
            .catch(error => {
                console.error('Error updating attendance record:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        
         });

    });
};

