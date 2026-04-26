const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createOrder = async (amount, currency = 'INR') => {
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency,
    receipt: `receipt_${Date.now()}`,
  });
  return order;
};

exports.verifyPayment = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body)
    .digest('hex');
  return expected === signature;
};
