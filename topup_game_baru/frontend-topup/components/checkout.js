async function createTransaction() {
  const order_id = `ORDER-${Date.now()}`;
  const gross_amount = 60000;

  console.log("🔹 Sending transaction:", { order_id, gross_amount });

  const response = await fetch("/api/createTransaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id, gross_amount }),
  });

  const result = await response.json();
  console.log("🔹 Response from API:", result);

  if (response.ok) {
    // 🔥 Ubah ke redirect ke halaman QR
    window.location.href = `/qr?transactionId=${order_id}&qrValue=${encodeURIComponent(
      result.paymentUrl
    )}`;
  } else {
    alert("❌ Gagal membuat transaksi: " + result.message);
  }
}
