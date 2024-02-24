const express = require('express');
const morgan = require("morgan");
const attendanceRouter = require('./routes/attendanceRoutes');

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use('/api/v1/attendance', attendanceRouter);

module.exports = app;
