const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model.js")
const userRouter = express.Router();

const USER_PUBLIC_DATA = "firstName lastName age gender skills about"

userRouter.get("/user/requests/received", userAuth, async(req, res) => {
  try {
    const loggedInUser = req.user;
    
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", "firstName lastName")

    res.send({message: "Interested Users", data: connectionRequests})


  } catch (error) {
    res.status(400).send("Error: " + error.message)
  }
})

userRouter.get("/user/connections", userAuth, async(req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {fromUserId: loggedInUser._id},
        {toUserId: loggedInUser._id}
      ],
      status: "accepted"
    }).populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName")

    const data = connectionRequests.map(row => {
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId
    })
    res.send({message: "Your Matches", data})

  } catch (error) {
    res.status(400).send("Error: " + error.message)
  }
})

userRouter.get("/user/feed", userAuth, async(req, res) => {
  try {
    
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = limit>50 ? 50 : limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {fromUserId: loggedInUser._id},
        {toUserId: loggedInUser._id}
      ]
    }).select("fromUserId toUserId")

    const hideUserFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString())
      hideUserFromFeed.add(req.toUserId.toString())
    })


    const feedUsers = await User.find({
      $and: [
        {_id: {$nin: Array.from(hideUserFromFeed)}},
        {_id: {$ne: loggedInUser._id}}
      ]
    }).select(USER_PUBLIC_DATA)
      .skip(skip)
      .limit(limit)

    res.send(feedUsers);


  } catch (error) {
    res.status(400).send("Error: " + error.message)
  }
})

module.exports = userRouter;