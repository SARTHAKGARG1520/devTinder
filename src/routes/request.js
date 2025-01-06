const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ['ignored', 'interested'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid Status Type ' + status });
        }
        const toUserPresent = await User.findById(toUserId);
        if (!toUserPresent) {
            return res.status(400).json({ message: 'User not found' });
        }
        const existingConnection = await User.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnection) {
            return res.status(400).json({ message: 'Connection request already exists' });
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

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    const allowedStatus = ['accepted', 'rejected'];
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'Staus not allowed' });
    }
    const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested'
    });
    if (!connectionRequest) {
        return res.status(400).json({ message: 'Connection Request not found' });
    }
    connectionRequest.status = 'accepted';
    const data = await connectionRequest.save();
    console.log(data);
    res.json({ message: 'Connection Request accepted successfully', data });
});

module.exports = requestRouter;