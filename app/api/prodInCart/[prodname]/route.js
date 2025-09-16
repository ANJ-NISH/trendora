import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Cart from "@/models/Cart";

import { connectDB } from "@/lib/mongodb";


export async function GET(req, {params})
{
   try
   {
    await connectDB();

    const {prodname}=params;

    if(prodname===undefined)
    {
       return NextResponse.json({message: "Fetching product name", prodstatus: false}, {status: 201}); 
    }

    const token=cookies().get('token')?.value;

    if(!token)
    {
        return NextResponse.json({message: "User not logged in", prodstatus: false}, {status: 201});
    }

    const decoded=jwt.verify(token, "anjnish@12");

    const userId=decoded.userId;

    const cart=await Cart.findOne({userId});

    if(!cart)
    {
       return NextResponse.json({message: "No products in the cart", prodstatus: false},{status: 201}); 
    }
    
    const proddetails=cart.items.filter((item)=> item.productId.toString()===prodname);

    if(proddetails.length===0)
    {
        return NextResponse.json({message: "Product not present in the cart", prodstatus: false},{status: 201});
    }
    return NextResponse.json({message: "Product present in the cart", prodstatus: true, proddetails: proddetails[0]}, {status: 201});
   }

   catch(error)
   {
    return NextResponse.json({message: error.message},{status: 500});
   }
}