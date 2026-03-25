"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { AuthGate } from "./AuthGate";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = 
    pathname === "/sign-in" || 
    pathname === "/sign_in" || 
    pathname.startsWith("/register") ||
    pathname.startsWith("/get-started");
  
  const showSidebar = 
    pathname === "/profile" || 
    pathname.startsWith("/u/") ||
    pathname === "/dashboard" || 
    pathname === "/wallet" || 
    pathname === "/wishlist" || 
    pathname === "/purchased" || 
    pathname === "/settings";

  return (
    <div className={cn("flex min-h-screen", isAuthPage && "bg-[#0a0a0f]")}>
      {showSidebar && <Sidebar />}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300",
        isAuthPage && "min-h-dvh bg-[#0a0a0f]",
        showSidebar && "lg:ml-60"
      )}>
        {!isAuthPage && <Navbar />}
        <main className={cn("grow", !isAuthPage && "pt-16", isAuthPage && "bg-[#0a0a0f]")}>
          <AuthGate>{children}</AuthGate>
        </main>
      </div>
    </div>
  );
}

