"use client"

import { useState } from "react";
import Link from "next/link";

import axios from "axios";
import { useRouter } from "next/navigation";

export const SigninForm = () => {


  const [formState, setFormState]=useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const router =useRouter();
  async function handleSignIn()
  {
   try
   {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(formState.email))
      {
        alert("Please enter a valid email id");
        return;
      }

      setLoading(true);
      const res=await axios.post(`api/signin`,{email: formState.email, password: formState.password});
      if(res.status === 200)
      {
       router.push("/");
      }
   }
   catch(err)
   {
    if(err.response && err.response.status===401)
    {
      alert("Invalid email or password. Try again.");
      setFormState({email: "",password: ""});
      return;
    }
    console.log(err);
   }
   finally {
      setLoading(false); 
    }
  }

    return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 p-4 relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-90 z-50">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-semibold">
            Logging you in...
          </p>
        </div>
      )}

      <div className="flex flex-col w-full max-w-sm items-center bg-white border border-gray-300 rounded-lg shadow-lg p-6">
        {/* Title */}
        <span className="text-2xl font-semibold text-[#0D1B2A] mb-4">
          Sign In
        </span>

        {/* Email */}
        <label className="w-full text-sm text-[#0D1B2A]">Email</label>
        <input
          value={formState.email}
          onChange={(e) =>
            setFormState({ ...formState, email: e.target.value })
          }
          type="email"
          placeholder="Enter your email..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
        />

        {/* Password */}
        <label className="w-full text-sm text-[#0D1B2A] mt-3">Password</label>
        <input
          value={formState.password}
          onChange={(e) =>
            setFormState({ ...formState, password: e.target.value })
          }
          type="password"
          placeholder="Enter your password..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
        />

        {/* Button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full cursor-pointer bg-[#0D1B2A] text-white rounded px-4 py-2 mt-5 hover:bg-[#132d44] transition disabled:opacity-50"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center w-full my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Sign up link */}
        <p className="text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#0D1B2A] font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
