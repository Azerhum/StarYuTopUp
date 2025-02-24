import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function GameDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [game, setGame] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [userId, setUserId] = useState("");
  const [server, setServer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderId, setOrderId] = useState("");
  const [snapToken, setSnapToken] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const [customerEmail, setCustomerEmail] = useState(""); // Added customerEmail state

  useEffect(() => {
    if (router.isReady) {
      const currentGame = gameCurrencies[id];
      setGame(currentGame || null);
    }
  }, [router.isReady, id]);

  useEffect(() => {
    setSnapToken("");
    setOrderId("");
  }, [game]);

  const handleCurrencyClick = (currency) => {
    setSelectedCurrency(currency);
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleEmailChange = (e) => {
    setCustomerEmail(e.target.value);
  };

  const handleServerChange = (e) => {
    setServer(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBuyNow = async () => {
    if (!selectedCurrency || !selectedCurrency.price) {
      alert("Pilih currency terlebih dahulu!");
      return;
    }
    if (!isValidEmail(customerEmail)) {
      alert("Format email tidak valid!");
      return;
    }
    if (!userId) {
      alert("Please enter User ID.");
      return;
    }

    if (game.requiresServer && !server) {
      alert("Please select a server.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const customerDetails = {
      user_id: userId,
      email: customerEmail,
      server: server,
      gameName: game ? game.name : "",
      currencyName: selectedCurrency.name,
      price: selectedCurrency.price,
      payment_method: paymentMethod,
    };

    const itemDetails = [
      {
        id: game ? game.id : "",
        name: game ? `${game.name} - ${selectedCurrency.name}` : "",
        price: selectedCurrency.price,
        quantity: 1, // Quantity is now always 1
      },
    ];

    const payload = {
      currency: selectedCurrency.name,
      price: selectedCurrency.price,
      customerDetails: customerDetails,
      itemDetails: itemDetails,
    };

    console.log("Data dikirim ke API:", payload);
    setIsPaymentProcessing(true);

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
        const { order_id, snapToken } = data;
        setOrderId(order_id);
        setSnapToken(snapToken);
        setIsPaymentProcessing(false);

        console.log("✅ Order ID:", order_id);
        console.log("✅ Snap Token:", snapToken);

        router.push(
          `/qr?transactionId=${order_id}&qrValue=${encodeURIComponent(
            snapToken
          )}`
        );
        localStorage.setItem("itemDetails", JSON.stringify(itemDetails));
      } else {
        alert(`Gagal: ${data.message}`);
        setIsPaymentProcessing(false);
      }
    } catch (error) {
      console.error("Gagal membuat transaksi:", error);
      setIsPaymentProcessing(false);
    }
  };

  if (!game) {
    return <p className="text-center mt-5">Game tidak ditemukan!</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 font-sans">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-md shadow-md mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold ml-4">{game.name} Purchase</h1>
          <div className="mr-4">
            <span className="text-sm">Customer Support: 09:00-21:00 WIB</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Game Info and User Input */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              {/* Game Image and Instructions */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {game.name}
                  </h2>
                  <p className="text-gray-600">{game.instructions}</p>
                </div>
              </div>

              {/* User Input Form */}
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="userId"
                  >
                    User ID:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="userId"
                    type="text"
                    placeholder="Masukkan User ID"
                    value={userId}
                    onChange={handleUserIdChange}
                  />
                </div>
                {game.requiresServer && (
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="server"
                    >
                      Server:
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="server"
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
                  </div>
                )}
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Masukkan Email Anda"
                    value={customerEmail}
                    onChange={handleEmailChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Pilih Nominal yang Ingin Anda Beli
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {game.currencies.map((currency, index) => (
                  <button
                    key={index}
                    className={`bg-purple-100 hover:bg-purple-200 rounded-xl p-4 text-center transition duration-200 ${
                      selectedCurrency === currency ? "bg-purple-300" : ""
                    }`}
                    onClick={() => handleCurrencyClick(currency)}
                  >
                    <div className="font-semibold text-gray-800">
                      {currency.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Rp {currency.price.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Payment Method and Buy Button */}
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Pilih Metode Pembayaran
              </h2>
              <div>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

              <button
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:shadow-outline mt-4 w-full transition duration-200"
                type="button"
                onClick={handleBuyNow}
                disabled={isPaymentProcessing}
              >
                {isPaymentProcessing ? "Memproses..." : "Beli Sekarang"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const gameCurrencies = {
  1: {
    id: "GI001",
    name: "Genshin Impact",
    image: "/gi.png",
    instructions:
      "Masukkan User ID dan Pilih Server Anda. Pastikan User ID sudah benar.",
    currencies: [
      { name: "Blessing Welkin Moon", price: 62000 },
      { name: "Blessing Welking Moon x2 ", price: 120000 },
      { name: "Blessing Welking Moon x3 ", price: 180000 },
      { name: "60 Crystals", price: 13000 },
      { name: "300 + 30 Crystals", price: 62000 },
      { name: "980 + 110 Crystals", price: 182000 },
      { name: "1280 + 140 Crystals", price: 245000 },
      { name: "1980 + 260 Crystals", price: 395000 },
      { name: "3280 + 600 Crystals", price: 610000 },
      { name: "4260 + 710 Crystals", price: 795000 },
      { name: "6480 + 1600 Crystals", price: 1200000 },
      { name: "9760 + 2200 Crystals", price: 1820000 },
      { name: "6480 + 1600 x2 Crystals", price: 2340000 },
      { name: "6480 + 1600 x3 Crystals", price: 3660000 },
      { name: "6480 + 1600 x4 Crystals", price: 4875000 },
    ],
    requiresServer: true,
    servers: ["America", "Europe", "Asia", "TW, HK, MO"],
  },
  2: {
    id: "ZZZ001",
    name: "Zenless Zone Zero",
    image: "/zzz.png",
    instructions: "Masukkan User ID Anda.",
    currencies: [
      { name: "Inter-Knot Membership", price: 62500 },
      { name: "60 Monochrome", price: 18000 },
    ],
    requiresServer: true,
    servers: ["America", "Europe", "Asia", "TW, HK, MO"],
  },
  3: {
    id: "HSR001",
    name: "Honkai Star Rail",
    image: "/hsr.jpg",
    instructions:
      "Masukkan User ID dan Pilih Server Anda. Pastikan User ID sudah benar.",
    currencies: [
      { name: "Express Supply Pass", price: 62000 },
      { name: "Express Supply Pass x2", price: 122000 },
      { name: "Express Supply Pass x3", price: 183000 },
      { name: "Express Supply Pass x4", price: 244000 },
      { name: "Express Supply Pass x5", price: 300000 },
      { name: "60 Oneric Shard", price: 16000 },
      { name: "300 + 30 Oneric Shard", price: 62000 },
      { name: "980 + 110 Oneric Shard", price: 183000 },
      { name: "1280 + 140 Oneric Shard", price: 242000 },
      { name: "1980 + 260 Oneric Shard", price: 392000 },
      { name: "3280 + 600 Oneric Shard", price: 600000 },
      { name: "4260 + 710 Oneric Shard", price: 780000 },
      { name: "6480 + 1600 Oneric Shard", price: 1200000 },
      { name: "9760 + 2200 Oneric Shard", price: 1780000 },
      { name: "6480 + 1600 x2 Oneric Shard", price: 2380000 },
      { name: "6480 + 1600 x3 Oneric Shard", price: 3600000 },
      { name: "6480 + 1600 x4 Oneric Shard", price: 4750000 },
      { name: "6480 + 1600 x5 Oneric Shard", price: 5900000 },
    ],
    requiresServer: true,
    servers: ["America", "Europe", "Asia", "TW, HK, MO"],
  },
  4: {
    id: "PUBGM001",
    name: "PUBG Mobile",
    image: "/PUBGM.jpg",
    instructions: "Masukkan User ID PUBG Mobile Anda.",
    currencies: [
      { name: "UC 660", price: 150000 },
      { name: "Royal Pass", price: 120000 },
    ],
    requiresServer: false,
  },
  5: {
    id: "ML001",
    name: "Mobile Legends",
    image: "/ml.png",
    instructions: "Masukkan User ID dan Zone ID Anda. Contoh: 12345678(1234)",
    currencies: [
      { name: "Diamonds 500", price: 100000 },
      { name: "Starlight Member", price: 150000 },
    ],
    requiresServer: false,
  },
  6: {
    id: "FF001",
    name: "Free Fire",
    image: "/freefire.jpg",
    instructions: "Masukkan User ID Free Fire Anda.",
    currencies: [
      { name: "Diamond 1000", price: 200000 },
      { name: "Elite Pass", price: 120000 },
    ],
    requiresServer: false,
  },
  7: {
    id: "HOK001",
    name: "Honor of Kings",
    image: "/hok.png",
    instructions: "Masukkan User ID Honor of Kings Anda.",
    currencies: [
      { name: "Token 500", price: 120000 },
      { name: "Battle Pass", price: 110000 },
    ],
    requiresServer: false,
  },
};
