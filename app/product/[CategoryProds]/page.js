"use client";

import Image from "next/image";
import * as React from "react";
import { Header } from "@/components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function CategoryProds({ params }) {
  const resolvedParams = React.use(params); 
  const category = resolvedParams.CategoryProds;
  const [products, setProds] = useState([]);
  const [ogproducts, setOG] = useState([]);
  const [shText, setshText] = useState("");

  const decoded = decodeURIComponent(category);
  const [loading, setLoading] = useState(true);

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    async function fetchproducts() {
      try {
        const res = await axios.get(`/api/findprod/${category}`);
        setOG(res.data.data);
        setProds(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchproducts();
  }, [category]);

  // 🔍 Search
  function searchProd(text) {
    setshText(text);
    let filtered = ogproducts.filter((product) =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    applyFiltersAndSorting(filtered);
  }

  // 🧮 Apply Filters + Sorting
  function applyFiltersAndSorting(data = ogproducts) {
    let filtered = [...data];

    // Price filter
    if (minPrice !== "") {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== "") {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter((p) => p.rating >= ratingFilter);
    }

    // Sorting
    if (sortOption === "priceLowHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighLow") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "ratingHighLow") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setProds(filtered);
  }

  // Re-run filters when user changes them
  useEffect(() => {
    applyFiltersAndSorting(
      ogproducts.filter((p) =>
        p.name.toLowerCase().includes(shText.toLowerCase())
      )
    );
  }, [minPrice, maxPrice, ratingFilter, sortOption]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <span className="text-2xl ml-18 font-bold text-[#0D1B2A]">{decoded}</span>
        <br />
        <br />

        {/* 🔍 Search Bar */}
        <input
          type="text"
          onChange={(e) => searchProd(e.target.value)}
          value={shText}
          placeholder="Search products here..."
          className="h-9 w-full ml-18 md:w-1/3 border-none rounded-sm bg-[#0D1B2A] p-2 text-sm text-white"
        />

        {/* 🧮 Filters + Sorting */}
        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-sm">
          {/* Price Range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24 p-2 text-sm border rounded"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24 p-2 text-sm border rounded"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Rating:</span>
            {[4, 3, 2].map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={`px-3 py-1 text-sm rounded border ${
                  ratingFilter === r
                    ? "bg-[#0D1B2A] text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {r}★ & above
              </button>
            ))}
            {ratingFilter !== 0 && (
              <button
                onClick={() => setRatingFilter(0)}
                className="text-xs text-red-500 underline ml-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="ml-auto">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 text-sm border rounded"
            >
              <option value="">Sort By</option>
              <option value="priceLowHigh">Price: Low → High</option>
              <option value="priceHighLow">Price: High → Low</option>
              <option value="ratingHighLow">Rating: High → Low</option>
            </select>
          </div>
        </div>

        {/* Flexbox Layout */}
        <div className="flex flex-wrap justify-center gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="mt-6 w-[150px] sm:w-[180px] md:w-[190px] lg:w-[200px] bg-[#0D1B2A] text-white rounded-xl shadow-md overflow-hidden animate-pulse"
                >
                  <div className="w-full aspect-[3/4] bg-gray-700"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            : products.map((product) => (
                <div
                  key={product.name}
                  className="mt-6 w-[150px] sm:w-[180px] md:w-[190px] lg:w-[200px] bg-[#0D1B2A] text-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-full aspect-[3/4] overflow-hidden">
                    <Link href={`/product/${decoded}/${product.price}`}>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={200}
                        height={266}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>
                  <div className="p-3">
                    <h2 className="text-sm sm:text-base font-semibold mb-1 truncate">
                      {product.name}
                    </h2>
                    <p className="text-[#D4AF37] text-sm sm:text-base font-bold mb-2">
                      ₹{product.price}
                    </p>
                    <div className="flex items-center">
                      <span className="text-[#D4AF37] text-xs sm:text-sm font-semibold mr-1">
                        {product.rating.toFixed(1)}
                      </span>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              i < Math.round(product.rating)
                                ? "fill-[#D4AF37]"
                                : "fill-gray-400"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
      