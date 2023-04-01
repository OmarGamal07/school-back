const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;  


app.use(express.json());

app.use("/assets", express.static("assets"));
app.use(cors());