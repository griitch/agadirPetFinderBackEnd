require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT ?? 8080;
const app = express();

mongoose
  .connect(process.env.mongodb)
  .then(() => console.log("connected to mongodb"))
  .catch(() => console.log("failed to connect to mongodb"));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`server listenning on port ${port}`);
});
