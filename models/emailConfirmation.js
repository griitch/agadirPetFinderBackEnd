const mongoose = require("mongoose");

const emailConfirmation = mongoose.Schema({
  confirmationToken: {
    type: Number,
    required: true,
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

module.exports = mongoose.model("EmailConfirmation", emailConfirmation);
