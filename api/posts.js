require("dotenv").config();
const express = require("express");
const Post = require("../models/post");
const EmailConfirmation = require("../models/emailConfirmation");
const { body } = require("express-validator");
const fileupload = require("express-fileupload");
const Router = express.Router();
const uniqid = require("uniqid");
const handleImageUpload = require("../lib/middleware/handleImageUpload");
const deleteImage = require("../lib/deleteImage");

const sendConfirmationMail = require("../lib/sendEmail");

Router.get("/", async (req, res) => {
  const posts = await Post.find({ confirmed: true, ...req.query }).sort({
    createdAt: "asc",
  });
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

Router.delete("/", async (req, res, next) => {
  const { confirmationToken } = req.body;
  try {
    const emailConfirmation = await EmailConfirmation.findOne({
      confirmationToken,
    }).populate("post");
    if (emailConfirmation === null) {
      return res.status(404).json({ message: "Code invalide ou expiré" });
    }

    const emailConfirmationId = emailConfirmation._id;
    const postId = emailConfirmation.post._id;
    Promise.all([
      EmailConfirmation.findByIdAndDelete(emailConfirmationId),
      Post.findByIdAndDelete(postId),
    ]).then((r) =>
      res.status(200).json({
        deleted: true,
        postId,
        emailConfirmationId,
      })
    );

    if (emailConfirmation.post.picFileId) {
      deleteImage(emailConfirmation.post.picFileId);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = Router;
