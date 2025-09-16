"use client"

import { Header } from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function Cart()
{

    const {cart, setCart}=useCart();

    const [products, setCartProd]=useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const goToCheckout = () => {
      const encoded = encodeURIComponent(JSON.stringify(products));
      router.push(`/checkout?cart=${encoded}`);
    };

    useEffect(() => {
      async function fetchCart()
      {
         try {
            const token = Cookies.get("token");
            const decoded = jwtDecode(token);
            const res = await axios.get(`/api/fetchCart?userId=${decoded.userId}`);
            setCartProd(res.data.cartitems);
            setCart(res.data.cartitems);
          } catch (err) {
            console.error("Error fetching cart:", err);
          } finally {
            setLoading(false);
          }
      }
      fetchCart();
    }, []);

    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return(<>
    <Header/>

      <div className="min-h-screen bg-white text-white px-4 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-[#0D1B2A] border-b border-[#D4AF37] pb-2">
              Your Cart
            </h2>

            {loading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-[#1B263B] rounded-2xl shadow-md p-4 animate-pulse"
                  >
                    <div className="w-24 h-24 bg-gray-700 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-700 rounded"></div>
                  </div>
                ))
              : products.map((product) => (
                  <div
                    key={product.name}
                    className="flex items-center gap-4 bg-[#1B263B] rounded-2xl shadow-md p-4"
                  >
                    <Image height={96}
                    width={96}
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-300">
                        Price: ₹{product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-300">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                    <div className="text-[#D4AF37] font-bold">
                      ₹{(product.price * product.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-[#1B263B] rounded-2xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold border-b border-[#D4AF37] pb-2 mb-4">
              Cart Summary
            </h2>

            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="mt-6 h-6 bg-gray-700 rounded w-1/3"></div>
                <div className="mt-6 w-full h-10 bg-gray-700 rounded-xl"></div>
              </div>
            ) : (
              <>
                <ul className="space-y-3">
                  {products.map((product) => (
                    <li
                      key={product.name}
                      className="flex justify-between text-sm text-gray-300"
                    >
                      <span>
                        {product.name} × {product.quantity}
                      </span>
                      <span>
                        ₹{(product.price * product.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">₹{total.toFixed(2)}</span>
                </div>

                <button onClick={goToCheckout} className="mt-6 w-full bg-[#D4AF37] text-[#0D1B2A] cursor-pointer font-semibold py-2 px-4 rounded-xl hover:bg-yellow-600 transition">
                  Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    <Footer/>
    </>)

}