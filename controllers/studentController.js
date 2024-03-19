const Student = require("../models/studentModel");
const axios = require('axios');

exports.createStudent = async (req, res) => {
  try {
    // Create the student in the database
    const student = await Student.create(req.body);

    // Add the student's email to the allowlist using Clerk Backend API
    await axios.post('https://api.clerk.com/v1/allowlist_identifiers', {
      identifier: student.iitEmail,
      redirectUrl: 'https://attendify-frontend-sigma.vercel.app/',
      notify: false, 
    }, {
      headers: {
        'Authorization': `Bearer sk_test_vD4sxesarzwVq4BRk2v2m0FcKg9TKvn0VkIWiAKWJt`,
        'Content-Type': 'application/json'
      }
    });

    // Respond with success message
    res.status(201).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (err) {
    // Handle error if creating student or adding to allowlist fails
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    // Retrieve all students from the database
    const students = await Student.find();

    // Respond with the list of students
    res.status(200).json({
      status: "success",
      results: students.length,
      data: {
        students,
      },
    });
  } catch (err) {
    // Handle error if fetching students fails
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
