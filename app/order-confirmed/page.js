"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrderConfirmed() {
  const router = useRouter();

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <h1 className="text-3xl font-bold text-[#0D1B2A] mb-4">
          🎉 Your order has been confirmed!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for shopping with us. We’ll send you updates when your order
          ships.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-[#0D1B2A] hover:bg-[#D4AF37] text-white hover:text-[#0D1B2A] font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
        >
          Back to Home
        </button>
      </div>
      <Footer />
    </>
  );
}
