const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Room = mongoose.model("Room");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");
const { JWT_SECRET } = require("../config/keys");


router.get("/userdetails/:userid", requireLogin, (req,res)=> {
    User.find({_id : req.params.userid})
    .then(user => res.send(user))
    .catch(err => console.log(err))
  })

module.exports = router;