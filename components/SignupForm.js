"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react"


export const SignupForm=()=>
{
    const [formState, setFormState]=useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
    })

    const [loading, setLoading] = useState(false);

    const router=useRouter();

    function handleInput(e)
    {
        setFormState({...formState, [e.target.name]: e.target.value});
    }

    async function SignupUser()
    {
       try
       {
        if(formState.name.length<3)
        {
            alert("Enter a valid name");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(formState.email))
        {
         alert("Enter a valid email");
         return;
        }
        const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(formState.password))
        {
          alert("Enter a valid password");
          return;
        }
        if(formState.password!==formState.cpassword)
        {
          alert("Passwords are not the same in two fields");
          return; 
        }
        setLoading(true);
        const res=await axios.post(`/api/signup`,{name:formState.name, email:formState.email, password:formState.password});
        if(res.status===201)
        {
          router.push("/signin");
        }
       }
       catch(error)
       {
        console.log(error);
       } 
      finally 
      {
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
            Creating your account...
          </p>
        </div>
      )}

      <div className="mt-0 flex flex-col w-full max-w-sm items-center justify-evenly bg-white border border-gray-300 rounded-lg shadow-lg p-6">
        <span className="text-2xl font-semibold text-[#0D1B2A] mb-4">
          Signup Here
        </span>

        {/* Name */}
        <label className="w-full text-sm text-[#0D1B2A]">Name</label>
        <input
          type="text"
          name="name"
          onChange={handleInput}
          placeholder="Enter your name..."
          value={formState.name}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
        />

        {/* Email */}
        <label className="w-full text-sm text-[#0D1B2A] mt-3">Email</label>
        <input
          type="email"
          name="email"
          onChange={handleInput}
          placeholder="Enter your email..."
          value={formState.email}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
        />

        {/* Password */}
        <label className="w-full text-sm text-[#0D1B2A] mt-3">Password</label>
        <input
          type="password"
          name="password"
          onChange={handleInput}
          placeholder="Enter your password..."
          value={formState.password}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
        />

        {/* Confirm Password */}
        <label className="w-full text-sm text-[#0D1B2A] mt-3">
          Confirm Password
        </label>
        <input
          type="password"
          name="cpassword"
          onChange={handleInput}
          placeholder="Confirm your password..."
          value={formState.cpassword}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
        />


        {/* Button */}
        <button
          onClick={SignupUser}
          disabled={loading}
          className="w-full cursor-pointer bg-[#0D1B2A] text-white rounded px-4 py-2 mt-5 hover:bg-[#132d44] transition disabled:opacity-50"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}