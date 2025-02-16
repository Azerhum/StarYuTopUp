export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    console.log("📥 Request body diterima:", req.body);

    const { currency, price } = req.body;

    console.log("📌 Type of currency:", typeof currency);
    console.log("📌 Type of price:", typeof price);

    if (!currency || price === undefined || price === null) {
      console.error("❌ Currency atau harga tidak valid!", req.body);
      return res.status(400).json({ message: "Currency atau harga tidak valid!" });
    }

    const numericPrice = parseInt(price, 10);
    if (isNaN(numericPrice)) {
      console.error("❌ Harga bukan angka yang valid!", price);
      return res.status(400).json({ message: "Harga bukan angka yang valid!" });
    }

    const serverKey = "SB-Mid-server-5e3oqR_Wv_kaItQXnrqvsOCD";
    const orderId = "TX-" + Date.now();

    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(serverKey + ":").toString("base64"),
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: numericPrice,
        },
      }),
    });

    const data = await response.json();
    console.log("📌 Response dari Midtrans:", data);

    if (!response.ok) {
      return res.status(response.status).json({ message: data });
    }

    if (!data.redirect_url) {
      return res.status(400).json({ message: "Payment URL tidak ditemukan dalam response Midtrans!" });
    }

    res.status(200).json({ order_id: orderId, paymentUrl: data.redirect_url });
  } catch (error) {
    console.error("❌ Error di createTransaction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
