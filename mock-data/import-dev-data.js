const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const timeTableModel = require("../models/timeTableModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));
// READ JSON FILE
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, "utf-8")
);

const importData = async () => {
  try {
    await User.create(users);
    console.log("Data successfully loaded");
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
};
const createTable = async()=>{

  try{
    
    console.log(time_table)
    await timeTableModel.create(time_table)
    console.log("timetable created")

}catch(e){

  console.log(e.message)
}

}
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
else if(process.argv[2]==="--create-table"){
  createTable();
}
