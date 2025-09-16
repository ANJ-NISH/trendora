"use client"

import { Header } from "@/components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";

import Image from "next/image";
import Footer from "@/components/Footer";


export default function Prodprice({params})
{
    const {user, setUser}=useUser();
    const {cart, setCart}=useCart();

    const [prodadded, setProdadd]=useState(false);

    const [cartStatus, setCartStatus]=useState();

    const rparams=React.use(params);
    const prodprice=rparams.Prodprice;

    const [product, setProddetails]=useState('');

    const [dState, setDstate]=useState(true);

    const [selectedImage, setSelectedImage] = useState(0);
    const router=useRouter();
    useEffect(()=>{

        async function fetchproddetails()
        {
            const res=await axios.get(`/api/indiprod/${prodprice}`);
            setProddetails(res.data.data[0]); 
        }

        async function fetchCartStatus()
        {
          if(product._id===undefined)
          return;
          const res1= await axios.get(`/api/prodInCart/${product._id}`);
          if(!res1.data.prodstatus)
          {
            setCartStatus([{prodstatus: false}]);
          }
          else
          {
            setCartStatus([{prodstatus: true, proddetails: res1.data.proddetails}]);
          }
        }

        fetchproddetails();
        fetchCartStatus();
    },[prodprice,product._id, prodadded, dState])

    async function additemToCart()
    {
      const token=Cookies.get('token');

      if (!token) {
      router.push("/signin");
      return;
    }
      let decoded;
      if(token)
      {
        decoded=jwtDecode(token);
        setUser(decoded);
      }

    const res = await axios.post(`/api/cart/add`, {
      userId: decoded.userId,
      productId: product._id,
      price: product.price,  
      quantity: 1
    });

    setProdadd(!prodadded);
    setCart(res.data);
    }


    async function reduceQuantity()
    {
      const res=await axios.post('/api/cart/decrease',{prodid: product._id});
      setDstate(!dState);
    }

    async function increaseQuantity()
    {
      const res=await axios.post('/api/cart/increase',{prodid: product._id});
      setDstate(!dState);
    }



   return (
    <>
      <Header />

      {/* ✅ Show skeleton while loading */}
      {!product ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 bg-[#0D1B2A] rounded-xl p-6 shadow-lg text-white animate-pulse">
            {/* Left Skeleton */}
            <div className="flex flex-row gap-4">
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="w-16 h-16 bg-gray-700 rounded-lg" />
                ))}
              </div>
              <div className="w-[400px] h-[400px] bg-gray-700 rounded-xl" />
            </div>

            {/* Right Skeleton */}
            <div className="flex-1 space-y-4">
              <div className="h-6 w-1/2 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
              <div className="h-24 w-full bg-gray-700 rounded"></div>
              <div className="h-8 w-32 bg-gray-700 rounded"></div>
              <div className="flex gap-2">
                <div className="h-10 w-36 bg-gray-700 rounded"></div>
                <div className="h-10 w-20 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ✅ Actual Product UI */
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 bg-[#0D1B2A] rounded-xl p-6 shadow-lg text-white">
            {/* Left: Product Images */}
            <div className="flex flex-row gap-4">
              <div className="grid grid-cols-2 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 ${
                      selectedImage === idx
                        ? "border-[#D4AF37]"
                        : "border-transparent"
                    } rounded-lg overflow-hidden`}
                  >
                    <div className="w-16 h-16 aspect-square relative">
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex-1">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex-1 flex flex-col gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>

              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-semibold">
                  {product.rating.toFixed(1)}
                </span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating)
                          ? "fill-[#D4AF37]"
                          : "fill-gray-400"
                      }`}
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>

              <p className="text-gray-300">{product.description}</p>

              <div className="flex items-center gap-4">
                <span className="text-[#D4AF37] text-2xl font-bold">
                  ₹{product.price}
                </span>
                {product.discount && (
                  <>
                    <span className="text-gray-400 line-through">
                      ₹{Math.round(product.price / (1 - product.discount / 100))}
                    </span>
                    <span className="text-[#D4AF37] font-semibold">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Cart buttons (same as before) */}
              <div> { cartStatus===undefined && <button className="mr-3 bg-white hover:bg-white text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-48 sm:w-52"> Fetching product cart status </button> } {/* Add to Cart button */} { cartStatus!==undefined && cartStatus[0].prodstatus ? (<button disabled className="mr-3 bg-white hover:bg-white text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-36 sm:w-40"> Already in Cart </button>):(cartStatus!==undefined && <button onClick={additemToCart} className="bg-[#D4AF37] cursor-pointer mr-3 hover:bg-yellow-500 text-[#0D1B2A] font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-36 sm:w-40"> Add to Cart </button>) } 
              { cartStatus!==undefined && cartStatus[0].prodstatus && (cartStatus[0].proddetails.quantity>1? (<button onClick={reduceQuantity} className=" cursor-pointer mr-3 bg-white hover:bg-white-500 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-12 sm:w-16"> - </button>):(<button onClick={reduceQuantity} className="mr-3 bg-white cursor-pointer hover:bg-white text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-28 sm:w-24"> Remove </button>) ) } 
              { cartStatus!==undefined && cartStatus[0].prodstatus && <span className="mr-3 bg-white hover:bg-white text-black  font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-12 sm:w-16"> {cartStatus[0].proddetails.quantity} </span> } 
              { cartStatus!==undefined && cartStatus[0].prodstatus && <button onClick={increaseQuantity} className="bg-white cursor-pointer hover:bg-white text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-12 sm:w-16"> + </button> } </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}