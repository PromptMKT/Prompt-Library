"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-in" || pathname === "/get-started";
  const isFullWidthPage =
    pathname.startsWith("/home-") ||
    pathname.startsWith("/prompt/") ||
    pathname === "/explore" ||
    pathname === "/upload" ||
    pathname === "/card-variants" ||
    isAuthPage;

  return (
    <div className={cn("flex min-h-screen", isAuthPage && "bg-[#0a0a0f]")}>
      <Sidebar />
      <div className={cn(
        "flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300",
        isAuthPage && "min-h-dvh bg-[#0a0a0f]",
        !isFullWidthPage && "lg:pl-64"
      )}>
        {!isAuthPage && <Navbar />}
        <main className={cn("grow", isAuthPage && "bg-[#0a0a0f]")}>
          {children}
        </main>
      </div>
    </div>
  );
}
