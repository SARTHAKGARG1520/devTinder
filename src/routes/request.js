const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/user');

requestRouter.post('/sendConnectionRequest/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ['ignored', 'interested'];
        if (!allowedStatus.includes(status)) {
            res.status(400).json({ message: 'Invalid Status Type ' + status });
        }
        const toUserPresent = await User.findById(toUserId);
        if (!toUserPresent) {
            res.status(400).json({ message: 'User not found' });
        }
        const existingConnection = await User.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnection) {
            res.status(400).json({ message: 'Connection request already exists' });
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + ' is ' + status + ' in ' + toUserPresent.firstName,
            data
        });
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message);
    }
});

module.exports = requestRouter;