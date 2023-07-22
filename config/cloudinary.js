const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your API credentials

 async function connectToCloudinary() {
  try {
  const connect =   cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.SECRET,
    });

    if(connect)
    {
      console.log("cloudinary connected",connect)
    }


  } catch (error) {
    console.log(error)
  }
}

module.exports = {connectToCloudinary}