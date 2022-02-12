require("dotenv").config();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.imagekitPublic,
  privateKey: process.env.imagekitPrivate,
  urlEndpoint: "https://ik.imagekit.io/griitch",
});

function deleteImage(fileId) {
  imagekit.deleteFile(fileId, function (error, result) {
    if (error) console.log(error);
    else console.log(result);
  });
}

module.exports = deleteImage;
