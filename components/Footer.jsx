// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h1 className="text-2xl font-bold text-[#D4AF37]">Trendora</h1>
          <p className="mt-3 text-sm text-gray-400">
            Your one-stop shop for fashion, lifestyle, and trends. Discover the best deals with Trendora.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-white">Quick Links</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="/shop" className="hover:text-[#D4AF37] transition-colors">Shop</a></li>
            <li><a href="/about" className="hover:text-[#D4AF37] transition-colors">About Us</a></li>
            <li><a href="/contact" className="hover:text-[#D4AF37] transition-colors">Contact</a></li>
            <li><a href="/faq" className="hover:text-[#D4AF37] transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-lg font-semibold text-white">Stay Updated</h2>
          <p className="mt-3 text-sm text-gray-400">
            Subscribe to our newsletter for the latest offers and styles.
          </p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-lg text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#D4AF37] text-black font-semibold px-4 rounded-r-lg hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-8 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-[#D4AF37]">Trendora</span>. All rights reserved.
      </div>
    </footer>
  );
}
