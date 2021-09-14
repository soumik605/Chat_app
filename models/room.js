const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roomkey: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },

    creator: {
      type: ObjectId,
      ref: "User",
    },
    admins: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        postedBy: { type: ObjectId, ref: "User" },
        message: String,
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("Room", roomSchema);
