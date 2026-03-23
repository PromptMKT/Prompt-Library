"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-in" || pathname.startsWith("/get-started");
  
  // Define which pages should show the sidebar
  const showSidebar = 
    pathname === "/profile" || 
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
        <Navbar />
        <main className={cn("grow pt-16", isAuthPage && "bg-[#0a0a0f]")}>
          {children}
        </main>
      </div>
    </div>
  );
}

