const express = require("express");
const User = require("../models/user.model.js");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const savedUser = await user.save();
        let token = await user.getJwt();
        res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
        res.status(200).json({ message: "signup successfully", data: savedUser });
    } catch (error) {
        res.status(400).send("Something went wrong " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credetial");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            let token = await user.getJwt();
            res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
            res.send(user);
        } else {
            throw new Error("Invalid credetial");
        }
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged out successfully");
});

module.exports = authRouter;
