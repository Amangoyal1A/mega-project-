const express = require("express");
const app = express();

const { userRouter } = require("./routes/User");
const { paymentRouter } = require("./routes/Payment");
 const {profileRouter} = require("./routes/Profile");
// const {courseRouter} = require("./routes/Course");

const { dbConnection } = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const { connectToCloudinary } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

connectToCloudinary();

app.use("/api/v1/auth", userRouter);
// app.use("/api/v1/course", courseRouter);
 app.use("/api/v1/payment", paymentRouter);
 app.use("/api/v1/profile", profileRouter);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running!",
  });
});

dbConnection();

app.listen(port, () => {
  console.log(`App is running at port number ${port}`);
});
