const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateSignUp } = require('../utils/validations');


authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUp(req);
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

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 60 * 60 * 1000)
            });
            res.json({user});
        }
        else {
            throw new Error("Invalid Credentials");
        }
    }
    catch (error) {
        res.status(400).send("Error : " + error.message);
    }

});

authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    });
    res.send('User logged out successfully!!!');
});

module.exports = authRouter;