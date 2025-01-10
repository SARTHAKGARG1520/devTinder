const express = require('express');
const userRouter = express.Router();

const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const USER_SAFE_DATA = ['firstName', 'lastName', 'age', 'gender', 'about', 'skills', 'photoUrl'];
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const ConnectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', USER_SAFE_DATA);
        res.json({ message: 'Connection requests fetched successfully', data: ConnectionRequests });
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
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

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit; 
        const ConnectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        ConnectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.toUserId.toString());
            hideUsersFromFeed.add(req.fromUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({ data: users });
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message);
    }
})
module.exports = userRouter;