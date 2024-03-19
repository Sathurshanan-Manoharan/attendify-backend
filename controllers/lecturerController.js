const axios = require('axios');
const Lecturer = require("../models/lecturerModel");

exports.createLecturer = async (req, res) => {
    try {
        // Create the lecturer in the database
        const lecturer = await Lecturer.create(req.body);

        // Add the lecturer's email to the allowlist using Clerk Backend API
        await axios.post('https://api.clerk.com/v1/allowlist_identifiers', {
            identifier: lecturer.iitEmail,
            redirectUrl: 'https://attendify-frontend-sigma.vercel.app/',
            notify: false, // Set to true if you want Clerk to send an email notification
            metadata: {
              role: 'admin' // Set any additional metadata here
          }
        }, {
            headers: {
                'Authorization': `Bearer sk_test_vD4sxesarzwVq4BRk2v2m0FcKg9TKvn0VkIWiAKWJt`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Request payload:", {
          identifier: lecturer.iitEmail,
          redirectUrl: 'https://attendify-frontend-sigma.vercel.app/',
          notify: true,
          metadata: {
              role: 'admin'
          }
      });
      
        // Respond with success message
        res.status(201).json({
            status: "success",
            data: {
                lecturer,
            },
        });
    } catch (err) {
        // Handle error if creating lecturer or adding to allowlist fails
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.getAllLecturers = async (req, res) => {
    try {
        // Retrieve all lecturers from the database
        const lecturers = await Lecturer.find();

        // Respond with the list of lecturers
        res.status(200).json({
            status: "success",
            results: lecturers.length,
            data: {
                lecturers,
            },
        });
    } catch (err) {
        // Handle error if fetching lecturers fails
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};
