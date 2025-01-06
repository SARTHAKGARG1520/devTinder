const express = require('express');
const userRouter = express.Router();

const connectionRequest = require('../models/ConnectionRequest');

const { userAuth } = require('../middlewares/auth');
const USER_SAFE_DATA = ['firstName', 'lastName', 'age', 'gender', 'about', 'skills'];
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', USER_SAFE_DATA);
        res.json({ message: 'Connection requests fetched successfully', data: connectionRequests });
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: 'accepted' },
                { fromUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId', USER_SAFE_DATA)
            .populate('toUserId', USER_SAFE_DATA);
        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            else {
                return row.fromUserId;
            }
        });
        res.json({ data });
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message);
    }
});
module.exports = userRouter;