export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { transactionId, userId, price, paymentMethod } = req.body;

  // Pilih metode pembayaran berdasarkan input user
  let paymentUrl = "";

  if (paymentMethod === "bca") {
    paymentUrl = `https://payment-gateway.com/pay?method=bca&amount=${price}&ref=${transactionId}`;
  } else if (paymentMethod === "bri") {
    paymentUrl = `https://payment-gateway.com/pay?method=bri&amount=${price}&ref=${transactionId}`;
  } else if (paymentMethod === "gopay") {
    paymentUrl = `https://payment-gateway.com/pay?method=gopay&amount=${price}&ref=${transactionId}`;
  } else if (paymentMethod === "dana") {
    paymentUrl = `https://payment-gateway.com/pay?method=dana&amount=${price}&ref=${transactionId}`;
  } else {
    return res.status(400).json({ message: "Metode pembayaran tidak valid" });
  }

  return res.status(200).json({ paymentUrl });
}
