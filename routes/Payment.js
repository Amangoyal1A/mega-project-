const express = require("express");
const paymentRouter = express.Router();
const { capturePayment, verifySignature } = require("../controller/Payment");
const { isStudent, auth } = require("../middleware/authMiddleware");

paymentRouter.post("/capturepayment", auth, isStudent, capturePayment);
paymentRouter.post("/verifysignature", verifySignature);

module.exports = { paymentRouter };
