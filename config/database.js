const mongoose = require("mongoose");

// async function connectDB() {
// }


const connectDB = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/devTinder');
}

module.exports = connectDB;