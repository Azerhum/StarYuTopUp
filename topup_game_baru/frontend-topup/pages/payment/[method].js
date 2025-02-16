import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const router = useRouter();
  const { method } = router.query;
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("transactionData"));
    if (!data) {
      router.push("/");
    }
    setTransactionData(data);
  }, [router]);

  const handlePaymentComplete = async () => {
    if (!transactionData) return;

    try {
      const response = await fetch("/api/sendDiscord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Transaksi selesai, notifikasi dikirim ke Discord!");
        router.push("/");
      } else {
        alert("Gagal mengirim notifikasi ke Discord.");
      }
    } catch (error) {
      console.error("Error sending to Discord:", error);
      alert("Terjadi kesalahan.");
    }
  };

  if (!transactionData) return <p>Loading...</p>;

  return (
    <div className="text-center">
      <h2>Pembayaran dengan {method.toUpperCase()}</h2>
      <img src={`/qr/${method}.png`} alt="QR Code" className="w-64 mx-auto" />

      <p className="mt-3">Total: Rp {transactionData.price.toLocaleString()}</p>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        onClick={handlePaymentComplete}
      >
        Saya Sudah Bayar
      </button>
    </div>
  );
}
