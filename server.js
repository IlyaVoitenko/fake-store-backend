const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.post("/payment", cors(), async (req, res) => {
  let { amount, id } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Spatula company",
      payment_method: id,
    });

    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      { return_url: process.env.RETURN_URL }
    );

    res.json({
      data: confirmedPaymentIntent,
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      message: "Payment failed",
      success: false,
    });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Sever is listening on port 4000");
});
