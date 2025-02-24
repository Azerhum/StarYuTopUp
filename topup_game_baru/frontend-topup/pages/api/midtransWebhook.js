import crypto from "crypto";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const midtransNotification = req.body;
    console.log("🔔 Notifikasi dari Midtrans diterima:", midtransNotification);

    // 1. VERIFIKASI TANDA TANGAN (WAJIB!)
    const signatureKey = midtransNotification.signature_key;
    const orderId = midtransNotification.order_id;
    const statusCode = midtransNotification.status_code;
    const grossAmount = midtransNotification.gross_amount;
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      console.error("❌ MIDTRANS_SERVER_KEY tidak ditemukan di environment!");
      return res
        .status(500)
        .json({ error: "MIDTRANS_SERVER_KEY belum diatur" });
    }

    const generatedSignature = crypto
      .createHash("sha512")
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest("hex");

    console.log("🔑 Signature Key dari Midtrans:", signatureKey);
    console.log("🔑 Generated Signature:", generatedSignature);

    if (signatureKey !== generatedSignature) {
      console.error("❌ Tanda tangan tidak valid!");
      return res.status(400).json({ error: "Tanda tangan tidak valid" });
    }

    // 2. AMBIL STATUS TRANSAKSI
    const transactionStatus = midtransNotification.transaction_status;
    console.log("✅ Status Transaksi:", transactionStatus);

    // 3. PROSES NOTIFIKASI BERDASARKAN STATUS
    if (transactionStatus === "settlement") {
      // PEMBAYARAN BERHASIL
      console.log(`✅ Order ${orderId} berhasil dibayar!`);

      // KIRIM NOTIFIKASI KE DISCORD
      const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

      if (discordWebhookUrl) {
        try {
          const message = {
            content: `✅ Pembayaran sukses untuk Order ID: ${orderId}\nNominal: Rp ${midtransNotification.gross_amount.toLocaleString()}`,
          };

          await axios.post(discordWebhookUrl, message);
          console.log("✅ Notifikasi Discord berhasil dikirim!");
        } catch (error) {
          console.error("❌ Gagal mengirim notifikasi ke Discord:", error);
        }
      } else {
        console.warn(
          "❌ DISCORD_WEBHOOK_URL tidak ditemukan di environment. Notifikasi Discord tidak dikirim."
        );
      }
      // Mengirimkan data ke klent
      return res.status(200).json({
        message: "Transaksi Selesai",
        status: "settled",
        orderId: orderId,
        transactionTime: midtransNotification.transaction_time,
        paymentType: midtransNotification.payment_type,
        grossAmount: midtransNotification.gross_amount,
      });
    } else if (transactionStatus === "pending") {
      // PEMBAYARAN PENDING
      console.log(`🟡 Order ${orderId} sedang menunggu pembayaran.`);
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "expire" ||
      transactionStatus === "deny"
    ) {
      // PEMBAYARAN GAGAL ATAU DIBATALKAN
      console.log(`❌ Order ${orderId} gagal dibayar atau dibatalkan.`);
    } else {
      // STATUS TIDAK DIKENAL
      console.warn(`⚠️ Status transaksi tidak dikenal: ${transactionStatus}`);
    }

    // SELALU KIRIM RESPON 200 KE MIDTRANS
    res.status(200).json({ message: "Notifikasi diterima" });
  } catch (error) {
    console.error("❌ Error di midtransWebhook:", error);
    res.status(500).json({ error: "Gagal memproses notifikasi" });
  }
}
