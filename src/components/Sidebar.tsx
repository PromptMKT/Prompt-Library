"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  PlusCircle, 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { icon: Home, label: "Home", href: "/home-v5" },
  { icon: Search, label: "Explore", href: "/explore" },
  { icon: PlusCircle, label: "Upload", href: "/upload" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  if (
    pathname.startsWith("/home-") ||
    pathname.startsWith("/prompt/") ||
    pathname === "/explore" ||
    pathname === "/upload" ||
    pathname === "/sign-in" ||
    pathname === "/get-started"
  )
    return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border z-50 hidden lg:flex flex-col p-6 shadow-sm overflow-y-auto scrollbar-hide dark:bg-[#0B0B0F]">
      <div className="mb-8 shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-700">
            P
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none text-foreground">Vault<span className="text-primary italic">.</span></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Foundation</span>
          </div>
        </Link>
      </div>

      <nav className="grow space-y-1.5">
        {menuItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
              pathname === item.href 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-card-foreground hover:bg-secondary hover:text-foreground dark:hover:bg-primary/5 dark:hover:text-primary"
            )}
          >
            {pathname === item.href && (
              <motion.div 
                layoutId="active-nav"
                className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full shadow-lg shadow-primary/40 z-20"
              />
            )}
            <item.icon className={cn(
              "w-5 h-5 transition-all duration-300 group-hover:scale-110",
              pathname === item.href ? "text-primary" : "group-hover:text-primary"
            )} />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </Link>
        ))}
      </nav>

    </aside>
  );
};
