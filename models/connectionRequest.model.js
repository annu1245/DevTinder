const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
  fromUserId: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  toUserId: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: {
      values: ["interested", "ignored", "accepted", "rejected"],
      message: '{VALUE} is not supported'
    }
  }
})

connectionRequestSchema.pre("save", function(next) {
  let connRequest = this;
  if(connRequest.fromUserId.equals(connRequest.toUserId)) {
    throw new Error("cannot send connection request to yourself");
  }
  next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = ConnectionRequest;