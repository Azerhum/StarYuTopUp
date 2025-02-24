import { useState, useEffect } from "react";
import axios from "axios";
import ImageSlider from "../components/Slider";
import Link from "next/link";

export default function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    setGames([
      { id: 1, name: "Genshin Impact", image: "/gi.png" },
      { id: 2, name: "Zenless Zone Zero", image: "/zzz.png" },
      { id: 3, name: "HSR : Honkai Star Rail", image: "/hsr.jpg" },
      { id: 4, name: "PUBG Mobile", image: "/PUBGM.jpg" },
      { id: 5, name: "Mobile Legend", image: "/ml.png" },
      { id: 6, name: "Free Fire", image: "/freefire.jpg" },
      { id: 7, name: "Honor of Kings", image: "/hok.png" },
    ]);
  }, []);

  return (
    <div className="bg-gradient-to-br from-teal-200 to-yellow-200 min-h-screen font-sans antialiased">
      <main className="container mx-auto py-6">
        <section className="mb-8">
          <ImageSlider />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Pilih Game Favoritmu
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className="flex bg-gray-800 text-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col" // Dark background and white text
              >
                <div className="relative">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-41 object-cover rounded-t-5x1" // Height adjusted and object-cover
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-lg font-semibold truncate">
                    {game.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-indigo-100 py-6">
        <div className="container mx-auto text-center text-gray-500">
          <p>© 2025 Staryu Top Up. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
