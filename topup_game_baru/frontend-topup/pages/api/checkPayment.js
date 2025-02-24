import axios from "axios";

export default async function handler(req, res) {
  const { transactionId } = req.query;

  // Validasi lebih ketat
  if (
    !transactionId ||
    transactionId === "undefined" ||
    transactionId.trim() === ""
  ) {
    console.error("❌ Invalid Transaction ID:", transactionId);
    return res.status(400).json({
      error: "Invalid Transaction ID",
      message: "Transaction ID tidak valid atau kosong",
    });
  }

  try {
    console.log(`🔎 Checking payment status for: ${transactionId}`);

    const midtransUrl = `https://api.sandbox.midtrans.com/v2/${encodeURIComponent(
      transactionId
    )}/status`;

    const response = await fetch(midtransUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.MIDTRANS_SERVER_KEY}:`
        ).toString("base64")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Midtrans API error: ${response.status}`);
    }

    const data = await response.json();

    // Handle khusus status code dari Midtrans
    if (data.status_code === "404") {
      console.error("❌ Transaksi tidak ditemukan:", transactionId);
      return res.status(404).json({
        error: "Transaction not found",
        transactionId: transactionId,
      });
    }

    console.log("✅ Status pembayaran:", data.transaction_status);

    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error checking payment:", error);
    return res.status(500).json({
      error: "Payment check failed",
      details: error.message,
    });
  }
}
