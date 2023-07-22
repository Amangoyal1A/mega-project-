const cloudinary = require("cloudinary").v2;

async function uploadImageToCloudinary(file, folder, height, quality) {
  const options = {
    folder,
    ...(height && { height }),
    ...(quality && { quality }),
  };

  const result = await cloudinary.uploader.upload(file.tempFilePath, options);
  return result;
}

module.exports = uploadImageToCloudinary;
