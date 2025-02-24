// components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Staryu Topup
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:text-gray-200">
            Beranda
          </Link>
          <Link href="/transaksi" className="hover:text-gray-200">
            Cek Transaksi
          </Link>
          <Link href="/kalkulator" className="hover:text-gray-200">
            Kalkulator
          </Link>
          <Link href="/berita" className="hover:text-gray-200">
            Berita & Promo
          </Link>
        </div>

        {/* Search & Auth */}
        <div className="flex items-center space-x-4">
          <input
            type="search"
            placeholder="Search"
            className="bg-purple-700 text-white px-2 py-1 rounded focus:outline-none"
          />
          <select className="bg-purple-700 text-white px-2 py-1 rounded focus:outline-none">
            <option>ID</option>
          </select>
          <Link href="/masuk" className="hover:text-gray-200">
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="bg-purple-900 px-4 py-2 rounded hover:bg-purple-700"
          >
            Daftar
          </Link>
        </div>
      </div>
    </nav>
  );
}
