const express = require("express");
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');

app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send('Not found');
        }
        else {
            res.send(users);
        }
    }
    catch (err) {
        res.status(500).send('Server error');
    }
});

app.delete('/user',async (req,res) =>{
    const id = req.body.id;
    try{
        await User.findOneAndDelete({_id: id}) ;
        res.send('Deleted successfully');
    }
    catch(err){
        res.status(500).send('unable to delete');
    }

});

app.get('/userByEmail', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: userEmail });
        if (!user) {
            res.status(404).send('Not found');
        }
        else {
            res.send(user);
        }
    }
    catch (err) {
        res.status(500).send('server error');
    }

});

app.post('/signup', async (req, res) => {
    const data = new User(req.body);
    try {
        await data.save();
        res.send('Data inserted');
    }
    catch (err) {
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

