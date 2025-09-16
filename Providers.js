"use client";

import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";


export function Providers({ children }) {
  return( 
  <CartProvider>
    <UserProvider>
    {children}
    </UserProvider>
    </CartProvider>
  )
}