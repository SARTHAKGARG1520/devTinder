const express = require("express");
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const { ValidateSignUp } = require('./utils/validations');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');
app.use(express.json());
app.use(cookieParser());


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
        console.log(user);
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 60 * 60 * 1000)
            });
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

app.get('/profile', userAuth, async (req, res) => {
    try {
        const { user } = req;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        res.send('Connection Request Sent !!!')
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message);
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

