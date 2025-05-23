const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const {validateProfileUpdateData} = require("../utils/validation.js");


profileRouter.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    if(!user) {
      throw new Error("unauthencated user");
    }
    const data = await user.findOne({_id: user._id})
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
    console.log(loggedInUser);
    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key])

    console.log(loggedInUser);
    await loggedInUser.save();
    res.send("Profile Data updated successfully")

  } catch (error) {
    res.status(400).send("Error "+ error.message);
  }
  
})



module.exports = profileRouter;