import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode"; 

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/cart", "/addproduct",], 
};