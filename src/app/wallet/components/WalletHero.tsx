"use client";

import React from "react";
import { TrendingUp, Wallet, Clock, ChevronDown, Plus, Activity, ArrowUp, ArrowDown, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export function WalletHero({ balance }: { balance: number }) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#11121d] border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm transition-all hover:shadow-md selection:bg-amber-100">
      {/* Decorative background effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12 items-center">
        {/* Left Side: Balance & Primary Actions */}
        <div>
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#7C3AED] opacity-60">
               <span className="font-bold">◈</span> Current Balance
            </div>
            
            <div className="space-y-1">
              <div className="text-[72px] font-black text-[#7C3AED] tracking-[-0.04em] tabular-nums leading-none font-mono">
                {balance.toLocaleString()}
              </div>
              <div className="text-[14px] font-medium text-slate-400 font-mono pl-1 opacity-80 mt-2">
                ≈ ₹ {(balance * 0.89).toFixed(2)} · 1 coin = ₹ 0.89
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="h-12 px-8 bg-[#7C3AED] text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] hover:bg-[#6D28D9] transition-all active:scale-95">
               Top up coins
            </button>
            <button className="h-12 px-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-slate-800 text-slate-500 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2">
               Transaction history <ChevronDown className="w-3.5 h-3.5 opacity-40" />
            </button>
          </div>
        </div>

        {/* Right Side: Quick Stats Column (Following design) */}
        <div className="flex flex-col gap-3">
           {[
             { label: "Total earned (coins)", value: "2,840", color: "text-[#7C3AED]", bg: "bg-[#7C3AED]/5 dark:bg-[#7C3AED]/10", icon: <ArrowUp className="w-3 h-3" /> },
             { label: "Total spent (coins)", value: "1,950", color: "text-slate-400", bg: "bg-slate-50 dark:bg-white/5", icon: <ArrowDown className="w-3 h-3" /> },
             { label: "In escrow (pending)", value: "81", color: "text-rose-400", bg: "bg-rose-500/5 dark:bg-rose-500/10", icon: <Pause className="w-3 h-3" /> },
           ].map((stat, i) => (
             <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/30 dark:bg-white/[0.01] border border-slate-50 dark:border-slate-800 rounded-2xl transition-all hover:bg-white dark:hover:bg-white/[0.05] group shadow-sm">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105", stat.bg, stat.color)}>
                   {stat.icon}
                </div>
                <div className="flex flex-col">
                   <div className={cn("text-[17px] font-black tabular-nums tracking-tighter leading-none mb-1 font-mono", stat.color)}>{stat.value}</div>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">{stat.label}</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
