const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const userAuth = async (req, res, next) => {
  try {
    const {token} = req.cookies;
    if(!token) {
      return res.status(401).send("Please Login !!!")
    }
    const decodedObj = await jwt.verify(token, "Secret@key12#45");
    const {_id} = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("something went wrong "+ error.message)
  }
  
}

module.exports = {
  userAuth
}