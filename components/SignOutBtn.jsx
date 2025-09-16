"use client"

export const SignOutBtn=()=>
{
    const handleSignOut = async () => {
    await fetch("/api/logout", { method: "GET" });
    alert("You have been logged out");
    window.location.href = "/signin";
    }

    return(
    <button onClick={handleSignOut} className="h-9 cursor-pointer px-4 bg-[#D4AF37] text-[#0D1B2A] text-sm md:text-md rounded-sm">
    Sign out</button>
    )
}