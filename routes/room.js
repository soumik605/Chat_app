const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Room = mongoose.model("Room");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");
const { JWT_SECRET } = require("../config/keys");

router.post("/createroom", requireLogin, (req, res) => {
  const { name, roomkey, password } = req.body;

  if (!name || !roomkey) {
    return res.status(422).json({ error: "Please add all fields" });
  } else {
    Room.findOne({ roomkey })
      .then((result) => {
        if (result) {
          return res
            .status(422)
            .json({ error: "Already a room with this key !! Try another.." });
        } else {
          const room = new Room({
            name,
            roomkey,
            password,
            creator: req.user._id,
            members: req.user._id,
          });
          room
            .save()
            .then((result) => {
              User.findByIdAndUpdate(
                req.user._id,
                {
                  $push: { rooms: room._id },
                },
                {
                  new: true,
                }
              )
                .populate("rooms", "_id name roomkey")
                .exec((err, user) => {
                  if (err) {
                    res.status(422).json({ error: err });
                  } else {
                    res.json({ user, result });
                  }
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => console.log(err));
  }
});

router.get("/userrooms/:userid", requireLogin, (req, res) => {
  Room.find({ members: req.params.userid })
    .populate("creator", "_id name")
    .then((rooms) => {
      res.send(rooms);
    })
    .catch((err) => console.log(err));
});

router.get("/allrooms", requireLogin, (req, res) => {
  Room.find()
    .populate("creator", "_id name email rooms")
    .sort("-createdAt")
    .then((rooms) => res.json({ rooms }))
    .catch((err) => console.log(err));
});

router.post("/joinroom", requireLogin, (req, res) => {
  const { roomkey, password } = req.body;

  Room.findOne({ roomkey })
    .then((room) => {
      if (room) {
        if (room.password === password) {
          Room.findByIdAndUpdate(
            room._id,
            {
              $push: { members: req.user._id },
            },
            {
              new: true,
            }
          )
            .populate("members", "_id name email rooms")
            .exec((err, result) => {
              if (err) {
                res.status(422).json({ error: err });
              } else {
                User.findByIdAndUpdate(
                  req.user._id,
                  {
                    $push: { rooms: result._id },
                  },
                  {
                    new: true,
                  }
                )
                  .populate("rooms", "_id name roomkey")
                  .exec((err, user) => {
                    if (err) {
                      return res.status(422).json({ error: err });
                    } else {
                      res.json({ user, result });
                    }
                  });
              }
            });
        } else {
          return res.status(422).json({ error: "Incorrect Password !!" });
        }
      } else {
        return res.status(422).json({ error: "No Room Found !!" });
      }
    })
    .catch((err) => console.log(err));
});

router.post("/leaveroom", requireLogin, (req, res) => {
  const { roomkey, password } = req.body;

  Room.findOneAndUpdate(
    { roomkey },
    {
      $pull: { members: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("members", "_id name email rooms")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: { rooms: result._id },
          },
          {
            new: true,
          }
        )
          .populate("rooms", "_id name roomkey")
          .exec((err, user) => {
            if (err) {
              res.status(422).json({ error: err });
            } else {
              res.json({ user, result });
            }
          });
      }
    });
});

router.get("/room/:roomid", requireLogin, (req, res) => {
  Room.findOne({ _id: req.params.roomid })
    .populate("creator", "_id name email")
    .then((room) => {
      res.send(room);
    })
    .catch((err) => console.log(err));
});

router.post("/sendmessage", requireLogin, (req, res) => {
  const { roomid, message } = req.body;

  const messages = {
    message,
    postedBy: req.user._id,
  };
  Room.findByIdAndUpdate(
    roomid,
    {
      $push: { messages },
    },
    { new: true }
  )
    .then((result) => console.log("message send"))
    .catch((err) => console.log(err));
});

router.get("/getmessages/:roomid", requireLogin, (req, res) => {
  Room.findById(req.params.roomid)
    .populate("messages.postedBy", "_id name")
    .then((room) => res.send(room.messages))
    .catch((err) => console.log(err));
});

router.delete("/deleteroom/:roomid", requireLogin, (req, res) => {
  Room.findOne({ _id: req.params.roomid })
    .populate("creator", "_id name")
    .exec((err, room) => {
      if (err || !room) {
        return res.status(422).json({ error: err });
      }

      if (room.creator._id.toString() === req.user._id.toString()) {
        room
          .remove()
          .then((result) => res.send(result))
          .catch((err) => {
            return res.status(422).send(err);
          });
      } else {
        return res.status(422).send("Only Room Creator can delete Room !!");
      }
    });
});

router.put("/clearchat", requireLogin, (req, res) => {
  Room.findOneAndUpdate(
    { _id: req.body.roomid },
    { $set: { messages: [] } },
    { new: true }
  )
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

module.exports = router;
