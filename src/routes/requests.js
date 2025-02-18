const express = require('express');
const requestsRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');


requestsRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res)=> {
    try {
        
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({message: "Invalid status type :" + status })
    }

    // Check if to user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
        return res.status(400).json({message: "User not found!!"});
    }

    // Check if the request is already sent
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]
    })

    if (existingConnectionRequest) {
        return res.status(400).send({message: "Connection request already exists!!"})
    }

    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    });

    const data = await connectionRequest.save();


    res.json ({
        message: "Connection request sent successfully!",
        data
    })
        
    } catch(err) {
        res.sendStatus(400).send("Error :" + err.message);
    }
});


requestsRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res)=> {
    try {
    const {status, requestId} = req.params;
        
    const loggedInUser = req.user;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({message: "Status not allowed :" + status })
    }

    // Check if the request is already sent
    const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
    })

    if (!connectionRequest) {
        return res.status(400).send({message: "Connection request not found"})
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json ({
        message: "Connection request " + status,
        data
    })
        
    } catch(err) {
        res.sendStatus(400).send("Error :" + err.message);
    }
});

module.exports = requestsRouter;