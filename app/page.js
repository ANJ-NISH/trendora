import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
   <>
   <Header/>
   <div className="mt-8 mb-20">
    <span className="text-2xl ml-18 font-bold text-[#0D1B2A]">SHOP BY CATEGORY</span>
    <div className="mt-6 flex justify-evenly">
      <Link href="/product/Men's clothes">
      <Image src="/cat1.png" className="cursor-pointer" alt="category1" width={170} height={250}/>
      </Link>
      <Link href="/product/Women's clothes">
      <Image src="/cat2.png" className="cursor-pointer" alt="category2" width={170} height={250}/> 
      </Link>
        
      <Link href="/product/Footwear">
      <Image src="/cat3.png" alt="category3" width={170} height={250}/> 
      </Link>
        
        <Link href="/product/Watches">
        <Image src="/cat4.png" alt="category4" width={170} height={250}/> 
        </Link>
        
        <Link href="/product/Speakers">
        <Image src="/cat5.png" alt="category5" width={170} height={250}/> 
        </Link>
    </div>
   </div>
   <Footer/>
   </>
  );
}
