"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, ChevronRight, FileDown, Clock, CheckCircle2, PauseCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const TRANSACTIONS = [
  { id: "tx_1", type: "earned", label: "Sale: Cold Email Framework", ref: "@aditya_k", date: "Mar 20, 2:14pm", amount: "+27", balance: "240", status: "Completed", statusType: "done" },
  { id: "tx_2", type: "spent", label: "Purchase: React Component Builder", ref: "by Dev K.", date: "Mar 19, 6:30pm", amount: "-50", balance: "213", status: "Completed", statusType: "done" },
  { id: "tx_3", type: "earned", label: "Sale: LinkedIn Post Engine", ref: "@meera_r", date: "Mar 19, 2:12pm", amount: "+20", balance: "263", status: "Completed", statusType: "done" },
  { id: "tx_4", type: "topup", label: "Top-up: Popular pack", ref: "via UPI / PhonePe", date: "Mar 18, 11:00am", amount: "+500", balance: "243", status: "Completed", statusType: "done" },
  { id: "tx_5", type: "earned", label: "Escrow: Cold Email Framework", ref: "@dev_m (pending)", date: "Mar 20, 2:14pm", amount: "+27", balance: "—", status: "In escrow", statusType: "hold" },
];

export function TransactionHistory() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="bg-white dark:bg-[#11121d] border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] selection:bg-primary/10">
      {/* Tabs Header */}
      <div className="px-10 pt-8 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex gap-8 relative">
          {["All", "Earned", "Spent", "Top-ups"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative z-10",
                activeTab === tab ? "text-[#7C3AED]" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                   layoutId="active-tx-tab"
                   className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full"
                   transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
        
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#7C3AED] transition-all">
           <FileDown className="w-3.5 h-3.5" /> Export .CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
               <th className="px-8 py-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800/50">Transaction</th>
               <th className="px-8 py-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800/50">Timestamp</th>
               <th className="px-8 py-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800/50">Volume</th>
               <th className="px-8 py-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800/50">Resulting</th>
               <th className="px-8 py-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800/50 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50 dark:divide-slate-800/50">
            {TRANSACTIONS.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all group cursor-default">
                <td className="px-8 py-5 min-w-[300px]">
                  <div className="flex items-center gap-4">
                     <div className={cn(
                       "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm",
                       tx.type === "earned" ? "bg-[#7C3AED10] text-[#7C3AED] border border-[#7C3AED20]" :
                       tx.type === "spent" ? "bg-slate-50 dark:bg-white/5 text-slate-400 border border-slate-100 dark:border-slate-800" : 
                       "bg-[#7C3AED20] text-[#7C3AED] border border-[#7C3AED40]"
                     )}>
                       {tx.type === "earned" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                     </div>
                     <div className="flex flex-col">
                        <div className="text-[13px] font-black text-slate-900 dark:text-white leading-none mb-1.5">{tx.label}</div>
                        <div className="text-[10px] font-bold text-slate-400 truncate opacity-60 flex items-center gap-1.5 uppercase tracking-wider">
                           <span className="w-1 h-1 rounded-full bg-slate-300" /> {tx.ref}
                        </div>
                     </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 tabular-nums">
                      <Clock className="w-3 h-3 opacity-40" /> {tx.date}
                   </div>
                </td>
                <td className="px-8 py-5">
                  <div className={cn(
                    "text-[14px] font-black font-mono tracking-tight flex items-baseline gap-1",
                    tx.type === "earned" ? "text-[#7C3AED]" : "text-slate-900 dark:text-white"
                  )}>
                    <span className="text-[10px] opacity-40 select-none">⬡</span> {tx.amount}
                  </div>
                </td>
                <td className="px-8 py-5 text-[11px] font-bold text-slate-400 tabular-nums font-mono opacity-80">
                   {tx.balance !== "—" ? <><span className="opacity-40 tracking-tighter mr-1">⬡</span>{tx.balance}</> : "—"}
                </td>
                <td className="px-8 py-5 text-right">
                   <div className={cn(
                     "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                     tx.statusType === "done" ? "bg-[#7C3AED05] text-[#7C3AED] border-[#7C3AED15]" :
                     tx.statusType === "hold" ? "bg-rose-500/5 text-rose-500 border-rose-500/15" :
                     "bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-slate-800"
                   )}>
                      {tx.statusType === "done" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <PauseCircle className="w-2.5 h-2.5" />}
                      {tx.status}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-10 py-8 bg-slate-50/30 dark:bg-white/[0.01] border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             Showing <span className="text-slate-900 dark:text-white font-black">1-5</span> of 48 transactions
          </div>
          <div className="flex items-center gap-2">
              <button className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-30" disabled>←</button>
              <div className="px-4 h-9 flex items-center justify-center rounded-xl bg-[#7C3AED10] text-[11px] font-black text-[#7C3AED] tracking-tighter">1</div>
              <button className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">→</button>
          </div>
      </div>
    </div>
  );
}
