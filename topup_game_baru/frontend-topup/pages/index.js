import { useState, useEffect } from "react";
import axios from "axios";
import ImageSlider from "../components/Slider";

export default function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Fetch data dari backend (sementara data dummy)
    setGames([
      { id: 1, name: "Genshin Impact", image: "/GI.png" },
      { id: 2, name: "Free Fire", image: "/freefire.jpg" },
      { id: 3, name: "PUBG Mobile", image: "/pubg.jpg" },
      { id: 4, name: "PUBG Mobile", image: "/pubg.jpg" },
      { id: 5, name: "PUBG Mobile", image: "/pubg.jpg" },
      { id: 6, name: "PUBG Mobile", image: "/pubg.jpg" },
      { id: 7, name: "PUBG Mobile", image: "/pubg.jpg" },
      { id: 8, name: "PUBG Mobile", image: "/pubg.jpg" },
      { id: 9, name: "PUBG Mobile", image: "/pubg.jpg" },
      { id: 10, name: "PUBG Mobile", image: "/pubg.jpg" },
    ]);
  }, []);

  return (
    <div>
      <ImageSlider />
      <h2 className="text-center text-2xl font-bold mt-5">Pilih Game Favoritmu</h2>
    </div>,
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Top Up Game</h1>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {games.map((game) => (
          <a
            key={game.id}
            href={`/game/${game.id}`}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <img src={game.image} alt={game.name} className="w-full rounded" />
            <h2 className="text-lg font-semibold text-center mt-2">
              {game.name}
            </h2>
          </a>
        ))}
      </div>
    </div>
  );
}
