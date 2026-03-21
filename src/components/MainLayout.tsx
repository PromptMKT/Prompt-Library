"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-in" || pathname.startsWith("/get-started");
  const isFullWidthPage =
    pathname.startsWith("/home-") ||
    pathname.startsWith("/prompt/") ||
    pathname.startsWith("/coins") ||
    pathname === "/explore" ||
    pathname === "/upload" ||
    pathname === "/dashboard" ||
    pathname === "/card-variants" ||
    isAuthPage;

  return (
    <div className={cn("flex min-h-screen", isAuthPage && "bg-[#0a0a0f]")}>
      <div className={cn(
        "flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300",
        isAuthPage && "min-h-dvh bg-[#0a0a0f]"
      )}>
        <Navbar />
        <main className={cn("grow pt-16", isAuthPage && "bg-[#0a0a0f]")}>
          {children}
        </main>
      </div>
    </div>
  );
}
