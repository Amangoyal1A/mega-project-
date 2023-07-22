const cloudinary = require("cloudinary").v2;

// cloudinary.config({

// })

async function uploadImageToCloudinary(file, folder, height, quality) {
  const options = {
    folder,
    ...(height && { height }),
    ...(quality && { quality }),
  };

  const result = await cloudinary.uploader.upload(file.tempFilePath, options);
  console.log("cloudinary result::",result)
  return result;
}

module.exports = uploadImageToCloudinary;
