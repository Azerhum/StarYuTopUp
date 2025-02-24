import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, value, options } = req.body;

  if (!name || !value) {
    return res.status(400).json({ message: "Name and value are required" });
  }

  try {
    const cookie = serialize(name, value, options);
    res.setHeader("Set-Cookie", cookie);
    console.log("✅ Cookie berhasil diatur:", cookie);
    res.status(200).json({ message: "Cookie berhasil diatur" });
  } catch (error) {
    console.error("❌ Gagal mengatur cookie:", error);
    res.status(500).json({ message: "Gagal mengatur cookie" });
  }
}
