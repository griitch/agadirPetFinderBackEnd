const ImageKit = require("imagekit");
require("dotenv").config();

const imagekit = new ImageKit({
  publicKey: process.env.imagekitPublic,
  privateKey: process.env.imagekitPrivate,
  urlEndpoint: "https://ik.imagekit.io/griitch",
});

const handleImageUpload = (req, res, next) => {
  let fileField = req.files;
  if (!fileField) {
    return next();
  }
  let picture64 = fileField.picture.data.toString("base64");
  const imagename = fileField.picture.name;

  imagekit
    .upload({
      file: picture64,
      fileName: imagename,
    })
    .then((result) => {
      console.log(result);
      req.body.picFileId = result.fileId;
      req.body.picUrl = result.url;
    })
    .catch(console.log)
    .finally(() => next());
};

module.exports = handleImageUpload;
