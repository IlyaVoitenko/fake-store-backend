const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.post("/payment-intents", async (req, res) => {
  const { amount, currency, id } = req.body;
  try {
    const { client_secret } = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      metadata: { order_id: id },
    });
    res.send({ client_secret });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

app.post("/payment", cors(), async (req, res) => {
  try {
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
    res.status(500).json({
      message: "Payment failed",
      success: false,
    });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Sever is listening on port 4000");
});
