"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidthPage = pathname === "/auth" || pathname.startsWith("/home-") || pathname === "/upload" || pathname === "/card-variants";

  return (
    <div className="flex">
      <Sidebar />
      <div className={cn(
        "flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300",
        !isFullWidthPage && "lg:pl-64"
      )}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
