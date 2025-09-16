import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { NextResponse } from "next/server";


export async function POST(req)
{
    
   const {email, password}=await req.json();

   if(!email || !password)
   {
    return Response.json({ message: "Email and password required" },
        { status: 400 })
   }

   try
   {
    await connectDB();

    const user=await User.findOne({email});
    if(!user)
    {
        return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    const result=await bcrypt.compare(password, user.password);
    if(!result)
    {
       return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    const token=jwt.sign({userId: user._id, email: user.email}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});

    const res= NextResponse.json(
      {
        message: "Sign in successful",
        token,
        user: { id: user._id, email: user.email, name: user.name },
      },
      { status: 200 }
    );

    res.cookies.set("token", token,{
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 60*60,
    })
    
    return res;
   }
   catch(err)
   {
    console.error(err);
    return Response.json({ message: "Server error" }, { status: 500 });
   }
}