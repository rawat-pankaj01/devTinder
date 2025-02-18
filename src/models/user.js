const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address")
            }
        }
    },
    password: {
        type: String
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values:["male","female", "others"],
            message:`{VALUE} is not a valid gender type`
        }
        // validate(value) {
        //     if(!["male","female", "others"].includes(value)) {
        //         throw new Error("Gender data is not valid.")
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default: "https://www.geographyandyou.com/images/user-profile.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid photo url")
            }
        }
    },
    about: {
        type: String,
        default: "Default description of user"
    },
    skills: {
        type: [String]
    }
    
},
{
    timestamps: true
});

userSchema.methods.getJWT = async function() {
    const user = this;

    const token = await jwt.sign({
        _id: user._id
    }, "DEV@Tinder$777");
    return token;
}

module.exports = mongoose.model("User", userSchema);