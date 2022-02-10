require("dotenv").config();
const express = require("express");
const EmailConfirmation = require("../models/emailConfirmation");
const Router = express.Router();

Router.post("/", async (req, res, next) => {
  const { confirmationToken } = req.body;
  try {
    const emailConfirmation = await EmailConfirmation.findOne({
      confirmationToken,
    }).populate("post");
    if (emailConfirmation === null) {
      return res.status(404).json({ message: "Code invalide ou expiré" });
    }
    emailConfirmation.post.confirmed = true;
    await emailConfirmation.post.save();
    res.json(emailConfirmation);
    await EmailConfirmation.findByIdAndDelete(emailConfirmation._id);
  } catch (error) {
    next(error);
  }
});

module.exports = Router;
