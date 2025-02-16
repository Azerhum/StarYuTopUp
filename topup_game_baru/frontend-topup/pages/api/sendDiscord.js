export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

  if (!DISCORD_WEBHOOK_URL) {
    console.error("❌ DISCORD_WEBHOOK_URL tidak ditemukan di .env.local");
    return res.status(500).json({ error: "Webhook URL not set" });
  }

  try {
    console.log(`📢 Mengirim pesan ke Discord: ${message}`);

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });

    const result = await response.json();
    console.log("✅ Respons dari Discord:", result);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Gagal mengirim notifikasi ke Discord:", error);
    return res.status(500).json({ error: "Failed to send message to Discord" });
  }
}
