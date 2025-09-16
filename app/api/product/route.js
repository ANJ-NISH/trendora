import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import cloudinaryPkg from "cloudinary";
import streamifier from "streamifier";

export const config = {
  api: {
    bodyParser: false, // disable default body parser (since we use formData)
    sizeLimit: '10mb', // set max upload size
  },
};

export const runtime="nodejs";

const cloudinary=cloudinaryPkg.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBufferToCloudinary(buffer, folder = "products") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function POST(req)
{

    try
    {
        await connectDB();
        const form=await req.formData();


        const name=form.get("name");
        const description=form.get("description") || "";
        const category=form.get("category");
        const price=Number(form.get("price"));
        const discount=Number(form.get("discount") || 0);
        const rating=form.get("rating")? Number(form.get("rating")): undefined;

        if (!name || Number.isNaN(price)) {
            return NextResponse.json(
                { error: "Name and price are required." },
                { status: 400 }
            );
        }

        const imageFiles=form.getAll("images");
        const imageUrls=[];

    for (const file of imageFiles) {
      if (!file || typeof file === "string") continue;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await uploadBufferToCloudinary(buffer, "products");
      imageUrls.push(url);
    }

    const product = await Product.create({
      name,
      description,
      images: imageUrls,
      category,
      price,
      discount,
      rating,
    });

    return NextResponse.json(
      { message: "Product created", product },
      { status: 201 }
    );
    }

    catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}