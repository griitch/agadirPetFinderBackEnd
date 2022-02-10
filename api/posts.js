require("dotenv").config();
const express = require("express");
const Post = require("../models/post");
const { body } = require("express-validator");
const fileupload = require("express-fileupload");
const Router = express.Router();
const handleImageUpload = require("../lib/middleware/handleImageUpload");

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
      await newpost.save();
    } catch (e) {
      return next(e);
    }
    res.status(201).json(req.body);
  }
);

module.exports = Router;
