export default async function handler(req, res) {
  const { transactionId } = req.query;

  const midtransResponse = await fetch(`https://api.sandbox.midtrans.com/v2/${transactionId}/status`, {
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY).toString("base64")}`,
    },
  });

  const data = await midtransResponse.json();
  if (data.payment_type === "qris") {
    res.status(200).json({ qr_url: data.actions.find((a) => a.name === "qr_code").url });
  } else {
    res.status(400).json({ message: "Metode pembayaran bukan QRIS" });
  }
}
