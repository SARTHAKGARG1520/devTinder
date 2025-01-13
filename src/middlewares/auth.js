const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
           return res.status(401).send("Login again");
        }
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: _id });
        if (!user) {
            throw new Error('User does not exist !!!')
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
};

module.exports = {
    userAuth
}