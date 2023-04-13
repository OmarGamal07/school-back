const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.TOKEN_KEY;

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {

      const token = jwt.sign({ role: user.role, user_id: user._id, email }, TOKEN_KEY);

      user.token = token;
      return res.status(200).json(user);
    }
    return res.status(400).json("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
