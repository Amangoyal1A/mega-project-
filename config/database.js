const mongoose = require("mongoose");
require("dotenv").config();

function dbConnection() {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB connnected successfully"))
    .catch((err) => {
      console.log("Error while connecting DB", err);
      process.exit(1);
    });
}
