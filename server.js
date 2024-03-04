//starting the server
const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE;


//connecting to the database
mongoose.connect(DB).then((conn) => {
  console.log("Database Connection Successful");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port 3000");
});

//TEST
