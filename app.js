const express = require('express');
const morgan = require('morgan');
const attendanceRouter = require('./routes/attendanceRoutes');
const timetableRouter = require('./routes/timeTableRoutes');
const studentRouter = require('./routes/studentRoutes');
const lecturerRouter = require('./routes/lecturerRoutes');
const dashboardRouter = require('./routes/dashboardRoutes'); // Import the dashboard router
const timetableRouterLecturer = require('./routes/timeTableLecturerRoutes')
const cors = require('cors');
const port = 5173;

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: ['https://attendify-frontend-sigma.vercel.app', 'https://www.attendify.online', 'http://localhost:5173'],
}));

// Use the dashboard router
app.use('/api/v1/dashboard', dashboardRouter);

app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/timetable', timetableRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/lecturer', lecturerRouter);
app.use('/api/v1/timetablelecturer', timetableRouterLecturer);


module.exports = app;
