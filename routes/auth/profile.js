const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.TOKEN_KEY;
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ _id: id });
    res.send(user);
  } catch (e) {
    res.send(e);
  }
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const email = req.body.email;
    const oldUser = await User.findOne({ email });
    const dateOfBirth = new Date(req.body.dateOfBirth);
    if (oldUser && oldUser._id != id) {
      return res.status(409).json("Email Already Exist");
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("User not found");
    } else {
      encryptedPassword = await bcrypt.hash(req.body.password, 10);
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.password = encryptedPassword;
      user.confirmPassword = req.body.confirmPassword;
      user.dateOfBirth = dateOfBirth;
      await user.save();
      return res.json("User updated successfully!");
    }
  } catch (e) {
    return res.status(400).send(e.errors);
  }
});

module.exports = router;
