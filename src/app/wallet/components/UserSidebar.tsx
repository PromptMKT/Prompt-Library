"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  Activity, 
  User, 
  Sparkles, 
  FileText, 
  Wallet, 
  BarChart3, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { label: "Analytics", icon: Activity, href: "/analytics" },
  { label: "Profile", icon: User, href: "/u/priyanair" },
  { label: "My Prompts", icon: Sparkles, href: "/my-prompts" },
  { label: "Drafts", icon: FileText, href: "/drafts" },
  { label: "Wallet", icon: Wallet, href: "/wallet" },
  { label: "Earnings", icon: BarChart3, href: "/earnings" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full h-full flex flex-col py-8 px-4 selection:bg-primary/10 select-none overflow-y-auto">
      {/* Sidebar Header Space */}
      <div className="mb-10 pl-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">P</div>
           <span className="text-xl font-black tracking-tight dark:text-white leading-none">Vault<span className="text-[#7C3AED]">.</span></span>
        </div>
      </div>

      <div className="space-y-2 flex-1">
        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white mb-6 px-4">
          OVERVIEW
        </h5>
        
        <div className="space-y-1">
          {NAV_ITEMS.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={i}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-[#7C3AED10] text-[#7C3AED]" 
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                )}
              >
                {isActive && (
                   <div className="absolute left-0 w-1 h-5 bg-[#7C3AED] rounded-r-full" />
                )}
                <item.icon className={cn(
                  "w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-[#7C3AED]" : "text-slate-400 dark:text-slate-500"
                )} />
                <span className={cn(
                  "text-[14px] font-bold tracking-tight whitespace-nowrap",
                  isActive ? "text-[#7C3AED]" : ""
                )}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
