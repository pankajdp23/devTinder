const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://pankajdp93:2z9zqyvtflWoEwAB@namastedev.yuldfkw.mongodb.net/devTinder');
}

module.exports = connectDB;