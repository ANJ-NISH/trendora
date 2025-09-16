import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req)
{

    try
    {
      await connectDB();

      const {prodid}=await req.json();
      const token=cookies().get('token')?.value;
      
        if(!token)
          {
              return NextResponse.json({message: "User not logged in", prodstatus: false}, {status: 201});
          }
      
        const decoded=jwt.verify(token, "anjnish@12");
      
        const userId=decoded.userId;
      

      const cart=await Cart.findOne({userId});

      cart.items = cart.items.map((item) => {
        if (item.productId.toString() === prodid) {
            const newQty = item.quantity + 1;
            return { ...item.toObject(), quantity: newQty }
        }
        return item;
      }); 

      await cart.save();

      return NextResponse.json({message: "Product quantity "},{status: 201});
    }
    catch(error)
    {
      return NextResponse.json({message: error.message},{status: 500});
    }
}