require("dotenv").config();
const express = require("express");
const Post = require("../models/post");
const EmailConfirmation = require("../models/emailConfirmation");
const { body } = require("express-validator");
const fileupload = require("express-fileupload");
const Router = express.Router();
const uniqid = require("uniqid");
const handleImageUpload = require("../lib/middleware/handleImageUpload");

const sendConfirmationMail = require("../lib/sendEmail");

Router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

Router.post(
  "/",
  body("description").escape().trim(),
  fileupload(),
  handleImageUpload,
  async (req, res, next) => {
    const {
      animal,
      breed,
      gender,
      neighborhood,
      email,
      phoneNumber,
      picUrl,
      picFileId,
      description,
    } = req.body;

    const newpost = new Post({
      animal,
      breed,
      gender,
      neighborhood,
      email,
      phoneNumber,
      picUrl,
      picFileId,
      description,
    });

    try {
      var record = await newpost.save();
    } catch (e) {
      return next(e);
    }
    res.status(201).json(req.body);
    const emailConfirmation = new EmailConfirmation({
      confirmationToken: uniqid(),
      post: record._id,
    });
    emailConfirmation
      .save()
      .then((r) => {
        sendConfirmationMail(email, r.confirmationToken);
      })
      .catch(console.log);
  }
);

module.exports = Router;
