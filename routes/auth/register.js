const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.TOKEN_KEY;
const fs = require("fs");
const path = require("path");

router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      confirmPassword,
    } = req.body;
    if (
      !(
        email &&
        password &&
        firstName &&
        lastName &&
        dateOfBirth &&
        confirmPassword
      )
    ) {
      res.status(400).send("All inputs is required");
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User already exists");
    }
    let encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      confirmPassword: encryptedPassword,
      dateOfBirth,
    });
    const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY);
    user.token = token;
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
