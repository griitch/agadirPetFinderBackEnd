const mongoose = require("mongoose");
const neighborhoods = require("../lib/neighborhoods");

const postSchema = new mongoose.Schema(
  {
    animal: {
      type: String,
      required: true,
      enum: {
        values: ["chat", "chien"],
        message: "animal {VALUE} is not supported",
      },
    },

    breed: { type: String, default: "non reconnu" },

    gender: {
      type: String,
      required: true,
      enum: {
        values: ["femelle", "male"],
        message: "gendre {VALUE} is not supported",
      },
    },

    neighborhood: {
      type: String,
      enum: {
        values: neighborhoods,
        message: "neighborhood {VALUE} is not supported",
      },
      required: true,
    },

    confirmed: { type: Boolean, default: false },

    email: {
      type: String,
      required: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },

    phoneNumber: {
      type: String,
      required: true,
      match: [/^0[6,7][0-9]{8}/, "Numéro de téléphone invalide"],
    },

    picUrl: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
    },

    picFileId: String,

    description: {
      type: String,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

postSchema.methods.markAsConfirmed = function () {
  return mongoose
    .model("Post", postSchema)
    .findByIdAndUpdate(this._id, { $set: { confirmed: true } });
};

module.exports = mongoose.model("Post", postSchema);
