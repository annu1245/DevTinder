const express = require("express");
const requestRouter =  express.Router();
const User = require("../models/user.model.js");
const ConnectionRequest = require("../models/connectionRequest.model.js");
const {userAuth} = require("../middlewares/auth.js");



requestRouter.post('/request/:status/:userId', userAuth, async(req, res) => {
  try {
    const status = req.params.status;
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    let allowedStatus = ["interested", "ignored"];

    console.log("fromUserId :", fromUserId);
    if(!allowedStatus.includes(status)) {
      throw new Error("request status not allowed")
    }

    const isToUserExists = User.findById({"_id": toUserId})
    if(!isToUserExists) {
      throw new Error("Invalid user");
    }

    const isDuplicateRequest = await ConnectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId}
      ]
    })

    console.log(isDuplicateRequest)
    if(isDuplicateRequest) {
      throw new Error("Connection already exist")
    }

    const connectionRequestData = {
      fromUserId,
      toUserId,
      status
    }

    const connection = new ConnectionRequest(connectionRequestData);
    await connection.save();

    res.json({
      message: "Connection made Successfully"
    })


  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }

})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
  try {
    const loggedInUser = req.user._id;
    const {status, requestId} = req.params;

    let allowedStatus = ["accepted", "rejected"];

    if(!allowedStatus.includes(status)) {
      throw new Error("Invalid request status")
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser,
      status: "interested"
    })

    if (!connectionRequest) {
      throw new Error("Invalid Request")
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    res.json({message: "Request has accepted", data: connectionRequest})

  } catch (error) {
    res.status(400).send("Error: " + error.message)
  }
})


module.exports = requestRouter;
