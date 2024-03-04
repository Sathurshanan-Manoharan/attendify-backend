const express = require('express');
const morgan = require("morgan");
const attendanceRouter = require('./routes/attendanceRoutes');
const timetableRouter = require('./routes/timeTableRoutes');

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: 'http://localhost:5173'
}));


app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/timetable', timetableRouter);

module.exports = app;
