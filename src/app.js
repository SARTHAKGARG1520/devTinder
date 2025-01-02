const express = require("express");
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const { ValidateSignUp } = require('./utils/validations');
const bcrypt = require('bcrypt');

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

app.delete('/user', async (req, res) => {
    const id = req.body.id;
    try {
        await User.findOneAndDelete({ _id: id });
        res.send('Deleted successfully');
    }
    catch (err) {
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
    try {
        ValidateSignUp(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const data = new User({ firstName, lastName, emailId, password: passwordHash });
        await data.save();
        res.send('Data inserted');
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.send("Login Successful");
        }
        else {
            throw new Error("Invalid Credentials");
        }
    }
    catch (error) {
        res.status(400).send("Error : " + error.message);
    }

});

app.patch('/user', async (req, res) => {
    const data = req.body;
    const id = data.userId;
    if (data?.skills.length > 10) {
        throw new Error('Skills cannot be more than 10');
    }
    try {
        const user = await User.findOneAndUpdate({ _id: id }, data, {
            returnDocument: "after",
            runValidators: true
        });
        console.log(user);
        res.send('Data updated');

    }
    catch (err) {
        res.status(400).send('Update Failed' + err.message);
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

