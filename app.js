const express = require('express');
const morgan = require("morgan");
const moment = require('moment-timezone');
const cors = require('cors');
const attendanceRouter = require('./routes/attendanceRoutes');
const timetableRouter = require('./routes/timeTableRoutes');


moment.tz.setDefault('Asia/Colombo');
const app = express();
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: true }));

app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/timetable', timetableRouter);

module.exports = app;
