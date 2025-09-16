import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";


export async function POST(req){
    try
    {
        await connectDB();
        const body= await req.json();
        const {userId, productId, price, quantity}=body;

        let cart=await Cart.findOne({userId});

        if(!cart)
        {
            cart= new Cart({
                userId,
                items: [{productId, price, quantity}]
            });
        }
        else
        {
            const itemIndex=cart.items.findIndex((item)=> item.productId.toString()===productId);
            if(itemIndex>-1)
            {
                cart.items[itemIndex].quantity+=quantity;
            }
            else
            cart.items.push({productId, price, quantity});
        }

        await cart.save();
        return NextResponse.json({success: true, cart});
    }
    catch(error)
    {
        console.error(error);
        return NextResponse.json({success: false, message: error.message}, {status: 500});
    }
}