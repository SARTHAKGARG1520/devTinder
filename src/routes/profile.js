const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfile } = require('../utils/validations');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const { user } = req;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        const isEditAllowed = validateEditProfile(req);
        if (!isEditAllowed) {
            throw new Error('Edit not allowed');
        }
        else {
            const user = req.user;
            Object.keys(req.body).forEach((field) => user[field] = req.body[field]);
            await user.save();
            res.json({ message: `${user.firstName}, your profile has been updated successfully` });
        }
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});


module.exports = profileRouter;