import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import Product from "@/models/Product";


export async function GET(req)
{
    try
    {
        await connectDB();
        const {searchParams}=new URL(req.url);
        const userId=searchParams.get('userId');
        let cart=await Cart.findOne({userId});

        let cartprods=[];

        for(let pd of cart.items)
        {
            let product=await Product.findById(pd.productId);
            cartprods.push({name:product.name,image:product.images[0],price:product.price, quantity: pd.quantity});
        }
        return NextResponse.json({success: true, cartitems: cartprods})
    }
    catch(error)
    {
        console.error(error);
        return NextResponse.json({success: false, message: error.message},{status: 500});
    }
}