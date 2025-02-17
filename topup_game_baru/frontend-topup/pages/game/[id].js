import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link"; // ADDED: Import Link

export default function GameDetail() {
  const router = useRouter();
  const { id } = router.query;
  const game = gameCurrencies[id];

  // State variables
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [userId, setUserId] = useState("");
  const [server, setServer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderId, setOrderId] = useState(""); // ADDED: State for order ID
  const [snapToken, setSnapToken] = useState(""); // ADDED: State for snapToken

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false); // ADDED : Processing state

  useEffect(() => {
    // Reset states when component mounts or changes
    setSnapToken("");
    setOrderId("");
  }, [id]); // id is the router query parameter so whenever it changes, this effect runs.

  // Handlers for input changes
  const handleCurrencyClick = (currency) => {
    setSelectedCurrency(currency);
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleServerChange = (e) => {
    setServer(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCheckPayment = async () => {
    if (!orderId) {
      // MODIFIED: Use orderId
      alert("Transaction ID tidak ditemukan!");
      return;
    }

    try {
      const response = await fetch(
        `/api/checkPayment?transactionId=${orderId}` // MODIFIED: Use orderId
      );
      const data = await response.json();

      if (data.transaction_status === "settlement") {
        setIsPaid(true);
        alert("Pembayaran sukses!");
      } else {
        alert("Pembayaran belum selesai!");
      }
    } catch (error) {
      console.error("Error checking payment:", error);
      alert("Gagal mengecek pembayaran.");
    }
  };

  const handleBuyNow = async () => {
    if (!selectedCurrency || !selectedCurrency.price) {
      alert("Pilih currency terlebih dahulu!");
      return;
    }

    const payload = {
      currency: selectedCurrency.name,
      price: selectedCurrency.price,
    };

    console.log("Data dikirim ke API:", payload);
    setIsPaymentProcessing(true); // ADDED : Set processing to true

    try {
      const response = await fetch("/api/createTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response dari API:", data);

      if (response.ok) {
        alert("Transaksi berhasil dibuat!");
        setOrderId(data.order_id); // ADDED: Store the order ID
        setSnapToken(data.snapToken); // ADDED: Store the snapToken
        setIsPaymentProcessing(false); // ADDED : Set processing to false
        //router.push(`/qr?transactionId=${data.order_id}&qrValue=${encodeURIComponent(data.snapToken)}`); // ADDED: Redirect to QR page

        // MODIFIED: Redirect to QR page
        router.push(
          `/qr?transactionId=${data.order_id}&qrValue=${encodeURIComponent(
            data.snapToken
          )}`
        );
      } else {
        alert(`Gagal: ${data.message}`);
        setIsPaymentProcessing(false); // ADDED : Set processing to false
      }
    } catch (error) {
      console.error("Gagal membuat transaksi:", error);
      setIsPaymentProcessing(false); // ADDED : Set processing to false
    }
  };

  if (!game) return <p className="text-center mt-5">Game tidak ditemukan!</p>;

  return (
    <div className="container mx-auto px-4">
      {/* Game Image */}
      <div className="text-center mt-5">
        <img
          src={game.image}
          alt={game.name}
          className="w-48 mx-auto rounded-lg shadow-md"
        />
      </div>

      {/* Game Name */}
      <h2 className="text-center text-2xl font-bold mt-3">{game.name}</h2>

      {/* Currencies and Prices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {game.currencies.map((currency, index) => (
          <div
            key={index}
            className={`bg-white shadow-lg p-4 rounded-lg text-center border border-gray-300 cursor-pointer ${
              selectedCurrency === currency ? "border-blue-500" : ""
            }`}
            onClick={() => handleCurrencyClick(currency)}
          >
            <h3 className="text-lg font-semibold">{currency.name}</h3>
            <p className="text-gray-600 mt-1">
              Harga: Rp {currency.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Selected Currency Information */}
      {selectedCurrency && (
        <div className="mt-5 p-4 bg-green-100 rounded-lg shadow-md max-w-md mx-auto">
          <p className="text-lg font-semibold">
            Anda memilih: {selectedCurrency.name}
          </p>
          <p className="text-gray-700">
            Harga: Rp {selectedCurrency.price.toLocaleString()}
          </p>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="mt-5 p-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
        <label className="block text-lg font-semibold mb-2">
          Pilih Metode Pembayaran:
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <option value="">Pilih Metode Pembayaran</option>
          <option value="bca">BCA Transfer</option>
          <option value="bri">BRI Transfer</option>
          <option value="gopay">GoPay</option>
          <option value="dana">DANA</option>
        </select>
      </div>

      {/* Input Form for ID and Server */}
      <div className="mt-5 p-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
        <label className="block text-lg font-semibold mb-2">
          Masukkan ID Pengguna:
        </label>
        <input
          type="text"
          placeholder="Masukkan ID Game"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          value={userId}
          onChange={handleUserIdChange}
        />

        {/* Server Dropdown (If Required) */}
        {game.requiresServer && (
          <>
            <label className="block text-lg font-semibold mt-3 mb-2">
              Pilih Server:
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={server}
              onChange={handleServerChange}
            >
              <option value="">Pilih Server</option>
              {game.servers.map((serverOption, index) => (
                <option key={index} value={serverOption}>
                  {serverOption}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Buy Now Button */}
      <div className="mt-5 text-center">
        {/* MODIFIED: Conditionally render either the "Buy Now" button or the QR code link */}
        {/* {snapToken ? (
                    <Link href={`/qr?transactionId=${orderId}&qrValue=${encodeURIComponent(snapToken)}`} legacyBehavior>
                        <a className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 inline-block">
                            Lihat QR Code
                        </a>
                    </Link>
                ) : ( */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
          onClick={handleBuyNow}
          disabled={isPaymentProcessing}
        >
          {isPaymentProcessing ? "Memproses Pembayaran..." : "Beli Sekarang"}
        </button>
        {/* )} */}
      </div>
    </div>
  );
}

const gameCurrencies = {
  1: {
    name: "Mobile Legends",
    currencies: [
      { name: "Diamonds 500", price: 100000 },
      { name: "Starlight Member", price: 150000 },
    ],
    requiresServer: false,
  },
  2: {
    name: "Free Fire",
    currencies: [
      { name: "Diamond 1000", price: 200000 },
      { name: "Elite Pass", price: 120000 },
    ],
    requiresServer: false,
  },
  3: {
    name: "Genshin Impact",
    image: "/GI.png",
    currencies: [
      { name: "Primogem 160000", price: 1000000 },
      { name: "Blessing 1 Month", price: 60000 },
      { name: "Battle Pass", price: 120000 },
    ],
    requiresServer: true,
    servers: ["America", "Europe", "Asia", "TW, HK, MO"],
  },
};
