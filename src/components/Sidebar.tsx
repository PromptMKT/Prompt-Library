"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Heart, 
  Upload, 
  Wallet, 
  ShoppingBag, 
  Settings,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: Upload, label: "Upload", href: "/upload" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
  { icon: ShoppingBag, label: "Purchased", href: "/purchased" },
  { icon: Settings, label: "Setting", href: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 bg-background border-r border-border/50 z-[100] hidden lg:flex flex-col p-5 overflow-y-auto scrollbar-hide dark:bg-[#0B0B0F]">
      <div className="mb-4 px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Overview</p>
      </div>

      <nav className="grow space-y-1">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-primary/5 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground dark:hover:bg-primary/5 dark:hover:text-primary"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-sidebar-nav"
                  className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full shadow-lg shadow-primary/40 z-20"
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300 group-hover:scale-110",
                isActive ? "text-primary" : "group-hover:text-primary"
              )} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-border/40 mt-auto">
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">PN</div>
            <div>
              <p className="text-xs font-bold text-foreground truncate max-w-[100px]">Priya Nair</p>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Creator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

