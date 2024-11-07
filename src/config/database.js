const mongoose = require('mongoose');

const connectDB = (async () =>{
    await mongoose.connect('mongodb+srv://mrtechnogear:Next123@learnnode.ilu0l.mongodb.net/devTinder');
});

module.exports = connectDB;
