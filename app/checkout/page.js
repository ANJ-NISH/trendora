"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { Suspense } from "react";

export function Checkout() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const cartParam = searchParams.get("cart");
  const cartItems = cartParam ? JSON.parse(decodeURIComponent(cartParam)) : [];

  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("");
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  // Calculate total
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost =
    shipping === "express" ? 100 : shipping === "standard" ? 50 : 0;
  const total = subtotal + shippingCost;

 const handleConfirm = async () => {
  if (!payment) {
    alert("Please select a payment method!");
    return;
  }
  if (
    payment === "card" &&
    (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)
  ) {
    alert("Please enter all card details!");
    return;
  }

  try {

    const orderData = {
      items: cartItems,
      shippingMethod: shipping,
      paymentMethod: payment,
      totalAmount: total,
    };

    const res = await axios.post("/api/orders", orderData);

    if (res.data.success) {
      router.push("/order-confirmed");
    } else {
      alert("Error saving order. Please try again!");
    }
  } catch (err) {
    console.error("Order save failed:", err);
    alert("Something went wrong while saving your order.");
  }
};

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#0D1B2A] mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Summary */}
          <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[#0D1B2A] mb-4">
              Order Summary
            </h2>
            <div className="divide-y">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between py-3">
                  <div>
                    <p className="font-medium text-[#0D1B2A]">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-[#D4AF37] font-semibold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 font-medium">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Shipping</span>
              <span>₹{shippingCost}</span>
            </div>
            <div className="flex justify-between mt-2 text-lg font-bold text-[#0D1B2A]">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Shipping + Payment */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[#0D1B2A] mb-4">
              Shipping Options
            </h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={shipping === "standard"}
                  onChange={(e) => setShipping(e.target.value)}
                />
                <span>Standard (₹50, 5-7 days)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={shipping === "express"}
                  onChange={(e) => setShipping(e.target.value)}
                />
                <span>Express (₹100, 1-3 days)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shipping"
                  value="free"
                  checked={shipping === "free"}
                  onChange={(e) => setShipping(e.target.value)}
                />
                <span>Free Shipping (7-10 days)</span>
              </label>
            </div>

            <h2 className="text-xl font-semibold text-[#0D1B2A] mt-6 mb-4">
              Payment Options
            </h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={payment === "card"}
                  onChange={(e) => {
                    setPayment(e.target.value);
                    setShowCardModal(true);
                  }}
                />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={(e) => {
                    setPayment(e.target.value);
                    setShowCardModal(false);
                  }}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>

            <button
              onClick={handleConfirm} 
              className="cursor-pointer mt-6 w-full bg-[#0D1B2A] hover:bg-[#D4AF37] text-white hover:text-[#0D1B2A] font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>

      {/* Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowCardModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-[#D4AF37]"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-[#0D1B2A] mb-4">
              Enter Card Details
            </h3>
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.number}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, number: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                value={cardDetails.expiry}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, expiry: e.target.value })
                }
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <input
                type="password"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cvv: e.target.value })
                }
                   className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            <button
              onClick={() => setShowCardModal(false)}
              className="mt-4 w-full bg-[#0D1B2A] hover:bg-[#D4AF37] text-white hover:text-[#0D1B2A] font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Save Card
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}


export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <Checkout />
    </Suspense>
  );
}