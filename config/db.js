const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
    });

    console.log('MongoDB Connected...AYee!!');
  } catch (err) {
    console.log(err.message);
    // Exit processs with failure
    process.exit(1);
  }
};

module.exports = connectDB;
