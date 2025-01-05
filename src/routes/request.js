const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');


requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        res.send('Connection Request Sent !!!')
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message);
    }
});

module.exports = requestRouter;