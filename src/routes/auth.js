const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { validateSignUpData } = require('../utils/validaton')


//Sign up
authRouter.post("/signup", async (req, res) => {
    try {
        console.log(req.body);
        // validation of data
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        // Create new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }
});

//Login
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            //Create JWT toke

            const token = await user.getJWT();

            res.cookie("token", token);
            res.send("Login Successfull");
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }
});

authRouter.post("/logout", (req,res)=> {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send("Logout successfull");
})




module.exports = authRouter;
