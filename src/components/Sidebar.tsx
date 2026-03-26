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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profile", href: "/u/profile" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: Upload, label: "Upload", href: "/upload" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
  { icon: ShoppingBag, label: "Purchased", href: "/purchased" },
  { icon: Settings, label: "Setting", href: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { profile, user, loading } = useAuth();

  const Navigation = () => {
    return (
      <nav className="grow space-y-1">
        {sidebarLinks.map((item) => {
          const href = item.label === "Profile" && profile?.username ? `/u/${profile.username}` : item.href;
          const isActive = pathname === href;
          return (
            <Link
              key={item.label}
              href={href}
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
    );
  };

  const UserSection = () => {

    if (loading) return <div className="p-4 animate-pulse bg-secondary/20 rounded-2xl h-16" />;
    if (!user) return null;

    const initials = profile?.display_name 
      ? profile.display_name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase()
      : (profile?.email || user.email || "?")[0].toUpperCase();

    const name = profile?.display_name || user.email?.split('@')[0] || "User";

    const profileLink = profile?.username ? `/u/${profile.username}` : "/u/profile";

    return (
      <div className="pt-6 border-t border-border/40 mt-auto">
        <Link href={profileLink} className="p-4 rounded-2xl bg-secondary/30 border border-border/40 flex items-center gap-3 hover:bg-secondary/50 transition-all">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs uppercase">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate max-w-[100px]">{name}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{profile?.role || "Creator"}</p>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 bg-background border-r border-border/50 z-[100] hidden lg:flex flex-col p-5 overflow-y-auto scrollbar-hide dark:bg-[#0B0B0F]">
      <div className="mb-4 px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Overview</p>
      </div>

      <Navigation />

      <UserSection />
    </aside>
  );
};
