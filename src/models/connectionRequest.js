const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to user collection
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: [
                "ignored",
                "interested",
                "accepted",
                "rejected"
            ],
            message: `{VALUE} is not supported`
        }
    }
},
{
    timestamps: true
});

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    // Check if from and to userID are same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to same user");
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;