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
    // i will persist the email verification uuid and make it like a private key
    // that will be used to delete the post
    // for each post there is a public document id used for reading, and the private
    // email verification token used for verifying the identity and for deleting
  } catch (error) {
    next(error);
  }
});

module.exports = Router;
