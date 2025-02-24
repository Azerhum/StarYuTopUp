import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method tidak diizinkan (hanya POST)" });
  }

  const { transactionId, paymentStatus } = req.body;

  if (!transactionId || !paymentStatus) {
    console.error("❌ Data tidak lengkap:", req.body); // TAMBAHKAN: Log data yang diterima
    return res
      .status(400)
      .json({ error: "transactionId dan paymentStatus wajib diisi" });
  }

  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!discordWebhookUrl) {
    console.error("❌ DISCORD_WEBHOOK_URL tidak ditemukan di environment!");
    return res.status(500).json({ error: "DISCORD_WEBHOOK_URL belum diatur" });
  }

  try {
    let message = `🔔 Notifikasi Pembayaran: Transaksi ID ${transactionId} - Status: ${paymentStatus}`;

    if (paymentStatus === "settlement") {
      message = `✅ Pembayaran Berhasil! Transaksi ID: ${transactionId}`;
    } else if (paymentStatus === "pending") {
      message = `🟡 Pembayaran Pending! Transaksi ID: ${transactionId}`;
    } else {
      message = `❌ Pembayaran Gagal! Transaksi ID: ${paymentStatus}`; //Fixed TyPo
    }

    console.log(`📢 Mengirim pesan ke Discord: ${message}`);
    const response = await axios.post(discordWebhookUrl, { content: message });

    console.log("✅ Notifikasi Discord berhasil dikirim!", response.data);

    return res
      .status(200)
      .json({ success: true, message: "Notifikasi Discord berhasil dikirim" });
  } catch (error) {
    console.error("❌ Gagal mengirim notifikasi ke Discord:", error);
    console.error(
      "❌ Error details:",
      error.response ? error.response.data : error.message
    ); // Tambahkan ini
    return res
      .status(500)
      .json({ error: "Gagal mengirim notifikasi ke Discord" });
  }
}
