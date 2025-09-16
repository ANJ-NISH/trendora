"use client"
import Link from "next/link"

import { Ubuntu } from 'next/font/google'
import { SignOutBtn } from "./SignOutBtn";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 
import Cookies from "js-cookie"; 

const ubuntu = Ubuntu({
  weight: ['300', '400'],
  subsets: ['latin'],
})

export const Header=()=>
{
 
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = Cookies.get("token");
           let userId;
       
           if (token && typeof token === "string") {
             try {
               const decoded = jwtDecode(token);
               setToken(decoded);
             } catch (err) {
               console.error("Invalid token", err);
             }
           }
    }, []);

    const [showDropdown, setShowDropdown] = useState(false);

    

    return(
        <>
        <div className={`{{${ubuntu.className} w-full h-auto bg-[#0D1B2A] flex flex-col md:flex-row justify-between md:justify-between items-center p-3 gap-3 md:gap-0}`}>
            {/* Logo */}
            <Link href="/">
            <span className="text-2xl font-semibold text-[#D4AF37] ml-4">Trendora</span>
            </Link>
        

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mr-4">
                <Link href="/addproduct">
                <button className="h-9 cursor-pointer px-4 bg-[#D4AF37] text-[#0D1B2A] text-sm md:text-md rounded-sm">
                Add Products
                </button>
                </Link>
               {token?(<SignOutBtn/>):(<Link href="/signin"><button className="h-9 cursor-pointer px-4 bg-[#D4AF37] text-[#0D1B2A] text-sm md:text-md rounded-sm">
                 Login/Signup
                </button>
                </Link>)}
                <Link href="/cart">
                <button className="h-9  cursor-pointer px-4 bg-[#D4AF37] text-[#0D1B2A] text-sm md:text-md rounded-sm">
                Cart
                </button>
                </Link>


            {token?.email ? (
                <div className="relative">
                    <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="flex items-center space-x-2 bg-[#D4AF37] text-[#0D1B2A] px-3 py-1 rounded-lg hover:bg-white hover:text-[#0D1B2A] transition"
                    >
                    <span className="font-medium">{token.email}</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${
                        showDropdown ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                        />
                    </svg>
                    </button>

                    {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-[#0D1B2A]">
                        <Link
                        href="/Orders"
                        className="block px-4 py-2 hover:bg-[#D4AF37] hover:text-white"
                        >
                        Order History
                        </Link>
                    </div>
                    )}
                </div>
                ) : null}

             
            </div>
            </div>

        </>
    )
}