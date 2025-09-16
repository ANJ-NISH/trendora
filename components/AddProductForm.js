"use client"

import { useState } from "react";

import axios from "axios";

export const AddProductForm=()=>
{

const [images, setImages] = useState([]);
const [loading, setLoading] = useState(false);


  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };


  async function handleSubmit(e) 
  {
    e.preventDefault();
    
    const form=e.currentTarget;

    const fd=new FormData(form);

    images.forEach((file) => fd.append("images", file));

    try 
    {
        setLoading(true);
        const res = await fetch("/api/product", {method: "POST",body: fd});

        const data = await res.json();
        if (!res.ok) {
        console.error(data);
        alert(data.error || "Failed to save product");
        return;
        }
        alert("Product saved!");
        console.log("Saved product:", data.product);
        form.reset();
        setImages([]);
    } 
    catch (err) 
    {
        console.error(err);
        alert("Something went wrong");
    }
    finally {
      setLoading(false); 
    }
  };

   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-90 z-50">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-semibold">Saving product...</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-[#0D1B2A] text-center">
          Add Product Details
        </h2>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-[#0D1B2A] mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-sm font-medium text-[#0D1B2A] mb-1">
            Product Description
          </label>
          <textarea
            name="description"
            placeholder="Enter product description"
            rows="4"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          />
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-[#0D1B2A] mb-1">
            Product Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {images.length > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              {images.length} files selected
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[#0D1B2A] mb-1">
            Category
          </label>
          <select
            name="category"
            required
            defaultValue=""
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="Men's clothes">Men's clothes</option>
            <option value="Women's clothes">Women's clothes</option>
            <option value="Footwear">Footwear</option>
            <option value="Watches">Watches</option>
            <option value="Speakers">Speakers</option>
          </select>
        </div>

        {/* Product Price */}
        <div>
          <label className="block text-sm font-medium text-[#0D1B2A] mb-1">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            placeholder="Enter product price"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          />
        </div>

        {/* Product Discount */}
        <div>
          <label className="block text-sm font-medium text-[#0D1B2A] mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            name="discount"
            placeholder="Enter discount percentage"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          />
        </div>

        {/* User Rating */}
        <div>
          <label className="block text-sm font-medium text-[#0D1B2A] mb-1">
            User Rating
          </label>
          <select
            name="rating"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          >
            <option value="">Select rating</option>
            <option value="1">⭐ 1</option>
            <option value="2">⭐⭐ 2</option>
            <option value="3">⭐⭐⭐ 3</option>
            <option value="4">⭐⭐⭐⭐ 4</option>
            <option value="5">⭐⭐⭐⭐⭐ 5</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0D1B2A] text-white py-2 rounded-lg font-semibold hover:bg-[#132c45] transition duration-200 disabled:opacity-50"
        >
          Save Product
        </button>
      </form>
    </div>
  );

}