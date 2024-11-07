const express = require("express");
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user')

app.use(express.json());
app.post('/signup', async (req, res) => {
    const data = new User(req.body);
    try{
        await data.save();
        res.send('Data inserted');
    }
    catch(err){
        res.status(400).send('Error saving the user ' + err.message);
    }
});

connectDB().then((res) => {
    console.log('DB Connected');
    app.listen((3000), () => {
        console.log('Server started');
    });
})
    .catch((err) => {
        console.log('db not connected');
    });

