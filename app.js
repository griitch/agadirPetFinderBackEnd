require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT ?? 8080;
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
mongoose
  .connect(process.env.mongodb)
  .then(() => console.log("connected to mongodb"))
  .catch(() => console.log("failed to connect to mongodb"));

app.use("/posts", require("./api/posts"));
app.use("/confirmation", require("./api/emailConfirmations"));

app.use((err, req, res, next) => {
  // right now it only handles mongoose validation errors
  // consider adding support for other errors

  if (err.name == "ValidationError") {
    const errorsArray = err.message
      .substring(err.message.indexOf(": ") + 2)
      .split(", ");
    res.json({ message: err._message, errors: errorsArray });
  } else {
    res.json(err);
  }
});

app.listen(port, () => {
  console.log(`server listenning on port ${port}`);
});
