const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const {validateProfileUpdateData} = require("../utils/validation.js");
const User = require('../models/user.model.js')


profileRouter.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    if(!user) {
      throw new Error("unauthencated user");
    }
    const data = await User.findOne({_id: user._id})
    res.send(data)

  } catch (error) {
    res.status(400).send("something went wrong "+ error.message)
  }
})

profileRouter.patch('/profile/edit', userAuth, async(req, res) => {
  try {
    if (!validateProfileUpdateData(req)) {
      throw new Error("Invalid profile data")
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key])
    await loggedInUser.save();
    res.status(200).json({
      message: "Profile data updated successfully",
      data: loggedInUser
    });

  } catch (error) {
    res.status(400).send("Error "+ error.message);
  }
  
})



module.exports = profileRouter;