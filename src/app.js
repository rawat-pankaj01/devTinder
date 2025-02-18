const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const cors = require("cors");


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}

));
app.use(express.json());
app.use(cookieParser());


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestsRouter = require('./routes/requests');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);





app.get("/getUser", async (req, res) => {
    try {
        const users = await User.find(req.body);
        if (users.length) {
            res.send(users);
        } else {
            res.status(404).send("User is not found ");
        }
    } catch (err) {
        res.status(400).send("Error getting the user:" + err.message);
    }
});


app.delete("/deleteUser", async (req, res) => {
    const userId = req.body.userId;
    try {
        const users = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length) {
            res.send(users);
        } else {
            res.status(404).send("Users  not found ");
        }
    } catch (err) {
        res.status(400).send("Error getting the users" + err.message);
    }
});

app.patch("/updateUser/:userId", async (req, res) => {
    const userId = req.params.userId;
    const filter = { emailId: req.body.emailId };
    const update = req.body;
    const options = {
        returnDocument: 'after'
    };
    try {
        const updatedUser = await User.findOneAndUpdate(filter, update, options);
        console.log(updatedUser);
        res.send("User updated");

    } catch (err) {
        res.status(400).send("Error updating the details" + err.message);
    }
});


connectDB().then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
        console.log("Server is successfylly listening on port 7777");
    })
}).catch(err => {
    console.error("Database cannot be connected");
});