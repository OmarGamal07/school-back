const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

const app = express();

app.use(express.json());

app.use("/assets", express.static("assets"));
app.use(cors());

// auth routes
const registerRouter = require("./routes/auth/register");
app.use("/register", registerRouter);
const loginRouter = require("./routes/auth/login");
app.use("/login", loginRouter);

// course program routes
const courseProgramRoute = require("./routes/admin/courseProgram");
app.use("/courseprogram", courseProgramRoute);

mongoose.connect(DB_URL);
// server connection
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
