"use client";

import React from "react";
import { Clock, Zap, ShieldCheck, ArrowRight, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ESCROW_DATA = [
  { name: "Aditya K.", initials: "AK", item: "Cold Email Framework", amount: 27, time: "2h", color: "bg-[#7C3AED]" },
  { name: "Meera R.", initials: "MR", item: "LinkedIn Post Engine", amount: 20, time: "18h", color: "bg-[#8B5CF6]" },
  { name: "Karthik S.", initials: "KS", item: "Twitter Thread Framework", amount: 23, time: "31h", color: "bg-[#A78BFA]" },
  { name: "Riya V.", initials: "RV", item: "Food Photography Hero", amount: 11, time: "42h", color: "bg-[#C4B5FD]" },
];

const SPEND_DATA = [
  { name: "Code & Technical", value: 60, amount: 230, color: "bg-[#7C3AED]" },
  { name: "Image & Visual", value: 35, amount: 135, color: "bg-[#8B5CF6]" },
  { name: "Strategy & Planning", value: 25, amount: 95, color: "bg-[#A78BFA]" },
  { name: "Agents & Agentic", value: 20, amount: 80, color: "bg-[#C4B5FD]" },
];

export function WalletSidebar() {
  return (
    <div className="space-y-8 select-none">
      {/* In Escrow Detail Section */}
      <div className="bg-white dark:bg-[#11121d] border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-white/[0.01]">
           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">In escrow</h3>
           <div className="text-[10px] font-black font-mono text-[#7C3AED] px-3 py-1 bg-[#7C3AED10] rounded-full">81 held</div>
        </div>
        <div className="p-8">
           <div className="flex gap-3 mb-6 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl items-start">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-amber-600/80 leading-relaxed uppercase tracking-widest leading-none">
                 Coins are held for 48h to prevent disputes.
              </p>
           </div>
           <div className="space-y-3">
              {ESCROW_DATA.map((escrow, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800/50 rounded-[1.25rem] transition-all hover:bg-white dark:hover:bg-white/[0.05] group">
                   <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg shadow-black/5 transition-transform group-hover:rotate-6", escrow.color)}>
                      {escrow.initials}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-black text-slate-900 dark:text-white leading-none mb-1.5">{escrow.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest opacity-60 italic">{escrow.item}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[13px] font-black text-[#7C3AED] font-mono leading-none mb-1">⬡{escrow.amount}</div>
                      <div className="text-[9px] font-bold text-slate-400 font-mono tracking-tighter uppercase">{escrow.time} left</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Withdrawal Options (Coming Soon) */}
      <div className="bg-white dark:bg-[#11121d] border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <ShieldCheck className="w-24 h-24 rotate-12" />
         </div>
         <h4 className="text-[15px] font-black text-slate-900 dark:text-white mb-1.5 uppercase tracking-tighter">Settlements</h4>
         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-6 opacity-60">Transfer your coins to bank account via UPI</p>
         <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl group/btn hover:border-[#7C3AED/20] transition-all cursor-not-allowed opacity-60">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                  <Zap className="w-4 h-4 text-[#7C3AED]" />
               </div>
               <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Instant Pay</div>
            </div>
            <div className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 text-[9px] font-black uppercase rounded-md">Locked</div>
         </div>
      </div>

      {/* Spend Breakdown */}
      <div className="bg-white dark:bg-[#11121d] border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
         <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-white/[0.01]">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Spend Analysis</h3>
         </div>
         <div className="p-8 space-y-6">
            {SPEND_DATA.map((item, i) => (
              <div key={i} className="space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                       <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]", item.color)} />
                       <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-black text-[#1a1b25] dark:text-white tabular-nums font-mono opacity-80">⬡{item.amount}</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                      className={cn("h-full rounded-full transition-opacity group-hover:opacity-80", item.color)}
                    />
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
