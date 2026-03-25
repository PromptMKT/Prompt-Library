"use client";

import Link from "next/link";
import { Wallet, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileSidebarContent() {
  return (
    <aside className="space-y-6">
      
      {/* Coin Wallet Widget */}
      <div className="bg-white dark:bg-[#181824] border-2 border-[#f1f1ff] dark:border-border rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#1a1b25] dark:text-foreground">Coin Wallet</h4>
          <div className="w-10 h-10 rounded-2xl bg-[#f5f3ff] dark:bg-primary/20 flex items-center justify-center text-primary border border-primary/5 transition-transform group-hover:rotate-12">
             <Wallet className="w-5 h-5" />
          </div>
        </div>
        
        <div className="space-y-10">
          <div className="text-left">
            <div className="flex items-center gap-3 text-5xl font-black tracking-tighter text-[#1a1b25] dark:text-foreground mb-2 leading-none">
              <span className="text-3xl text-primary/40 select-none">◈</span>
              240
            </div>
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1b25] dark:text-foreground/60 flex items-center gap-1.5">
              <span className="opacity-60 text-[13px]">≈</span> ₹ 214 available
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link href="/wallet" className="flex-1">
              <button className="w-full h-14 rounded-2xl bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-primary/20">
                + Top up
              </button>
            </Link>
            <Link href="/wallet" className="flex-1">
              <button className="w-full h-14 rounded-2xl bg-[#f8f9ff] dark:bg-secondary/30 border-2 border-[#f1f1ff] dark:border-border text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1b25] dark:text-foreground transition-all hover:bg-white dark:hover:bg-secondary hover:border-primary/20">
                History
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm hover:border-primary/20 transition-all">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Earnings Overview</h4>
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-secondary/40 border border-border text-center">
            <div className="flex items-center justify-center gap-3 text-3xl font-black tracking-tighter text-foreground mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber/20 flex items-center justify-center text-amber text-lg">◈</div>
              2,840
            </div>
            <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">Total Earned · <span className="text-foreground">≈ ₹ 2,528</span></div>
          </div>
          
          <div className="space-y-4">
             {[
               { label: "This month", value: "489", color: "text-primary" },
               { label: "Last month", value: "612", color: "text-foreground" },
               { label: "Best prompt", value: "1,350", color: "text-amber" },
               { label: "Pending", value: "81", color: "text-muted-foreground" },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest group">
                 <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                 <div className="flex items-center gap-1.5">
                   <span className={cn("text-[9px] font-black", item.color)}>◈</span>
                   <span className={cn("font-black text-[13px] tracking-tight", item.color)}>{item.value}</span>
                 </div>
               </div>
             ))}
          </div>
          <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
            <span className="text-muted-foreground">Withdrawal</span>
            <span className="text-primary italic opacity-60">Coming soon</span>
          </div>
        </div>
      </div>

      {/* My Platforms */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm hover:border-primary/20 transition-all">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">My Platforms</h4>
        <div className="space-y-2">
          {[
            { name: "ChatGPT", count: 18, color: "bg-[#10a37f]" },
            { name: "Claude", count: 12, color: "bg-[#7C3AED]" },
            { name: "FLUX", count: 7, color: "bg-[#8B5CF6]" },
            { name: "Midjourney", count: 4, color: "bg-[#fb923c]" },
          ].map((plat, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-secondary/30 border border-transparent hover:border-primary/20 hover:bg-secondary/50 transition-all flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full", plat.color)} />
                <span className="text-[12px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">{plat.name}</span>
              </div>
              <span className="text-[10px] font-black text-muted-foreground">{plat.count} <span className="opacity-60">prompts</span></span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
