export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const midtransNotification = req.body;

  console.log("Notifikasi dari Midtrans:", midtransNotification);

  if (midtransNotification.transaction_status === "settlement") {
    const discordWebhookUrl = "https://discord.com/api/webhooks/1338131203760459807/ZokGyP3RGggd-A268TEz46Knwm2ucTYJADli5wh3Q_6dtBWfb1CWhGYM5eEliLsXsjrU"; // Ganti dengan webhook Discord

    const message = {
      content: `✅ Pembayaran sukses untuk Order ID: ${midtransNotification.order_id}\nNominal: Rp ${midtransNotification.gross_amount.toLocaleString()}`,
    };

    try {
      await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      console.log("Notifikasi Discord berhasil dikirim!");
    } catch (error) {
      console.error("Gagal mengirim notifikasi ke Discord:", error);
    }
  }

  res.status(200).json({ message: "Notifikasi diterima" });
}
