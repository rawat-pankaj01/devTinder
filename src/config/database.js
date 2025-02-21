const mongoose = require('mongoose');
const connectDB = async() => {
    await mongoose.connect("mongodb+srv://rawpan:UWl7ca8xlEvgKnwd@cluster0.kydkml9.mongodb.net/devTinder");
}

module.exports = connectDB;
