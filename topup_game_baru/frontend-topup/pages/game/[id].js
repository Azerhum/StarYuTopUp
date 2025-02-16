import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function GameDetail() {
  const router = useRouter();
  const { id } = router.query;
  const game = gameCurrencies[id];

  // State variables
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [userId, setUserId] = useState("");
  const [server, setServer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [qrValue, setQrValue] = useState(""); // Add qrValue state

  useEffect(() => {
    // Reset QR code when component mounts or changes
    setQrValue("");
    setShowQR(false);
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
    if (!transactionId) {
      alert("Transaction ID tidak ditemukan!");
      return;
    }

    try {
      const response = await fetch(
        `/api/checkPayment?transactionId=${transactionId}`
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
        price: selectedCurrency.price
    };

    console.log("Data dikirim ke API:", payload);

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
        } else {
            alert(`Gagal: ${data.message}`);
        }
    } catch (error) {
        console.error("Gagal membuat transaksi:", error);
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
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
          onClick={() => {
            console.log("✅ Tombol 'Beli Sekarang' diklik!", selectedCurrency);
            handleBuyNow(selectedCurrency);
          }}
        >
          Beli Sekarang
        </button>
      </div>
      {showQR && qrValue && (
        <div className="mt-5 text-center">
          <h2>Scan QR untuk Membayar</h2>
          <QRCodeCanvas value={qrValue} size={256} level={"H"} />
        </div>
      )}
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
