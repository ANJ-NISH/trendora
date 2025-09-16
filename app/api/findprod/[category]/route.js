import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";


export async function GET(req, {params})
{
    try
    {
      await connectDB();
      const {category}=params;
      const res=await Product.find({category});

      return NextResponse.json({data: res},{status: 200});
    }
    catch(err)
    {
        console.error(err);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        )
    }
}