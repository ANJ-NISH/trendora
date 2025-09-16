"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 
import { jwtDecode } from "jwt-decode"; 
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";


export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");
    let userId;

    if (token && typeof token === "string") {
      try {
        const decoded = jwtDecode(token);
        userId=decoded.userId;
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
    if (userId) {
      axios
        .get(`/api/orders?userId=${userId}`)
        .then((res) => setOrders(res.data.orders))
        .catch((err) => console.error(err));
    }
  },[]);

  return (
    <>
    <Header/>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0D1B2A] mb-6">Your Order History</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-xl p-6 border border-[#D4AF37]"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-lg font-semibold text-[#0D1B2A]">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0 ${
                    order.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="divide-y">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2">
                    <div>
                      <p className="font-medium text-[#0D1B2A]">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#D4AF37] font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row justify-between mt-4 text-sm text-gray-600">
                <p>Shipping: {order.shippingMethod}</p>
                <p>Payment: {order.paymentMethod}</p>
                <p>Total: <span className="text-[#D4AF37] font-semibold">₹{order.totalAmount}</span></p>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Ordered on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
}
