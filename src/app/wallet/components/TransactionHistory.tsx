"use client";

import React, { useMemo, useState } from "react";
import { FileDown, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type TransactionRow = {
  id: string;
  type: string;
  date: string;
  description: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
};

type HistoryFilter = "All" | "Credit" | "Debit";

const FILTERS: HistoryFilter[] = ["All", "Credit", "Debit"];

export function TransactionHistory({ rows, loading }: { rows: TransactionRow[]; loading: boolean }) {
  const [activeTab, setActiveTab] = useState<HistoryFilter>("All");

  const formatType = (value: string) =>
    value
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

  const formatAmount = (value: number) => {
    const abs = Math.abs(value).toLocaleString();
    return value < 0 ? `-${abs}` : `+${abs}`;
  };

  const filteredRows = useMemo(() => {
    const cloned = [...rows];
    if (activeTab === "Credit") {
      return cloned.filter((row) => row.amount > 0);
    }
    if (activeTab === "Debit") {
      return cloned.filter((row) => row.amount < 0);
    }
    return cloned;
  }, [activeTab, rows]);

  const exportCsv = () => {
    const headers = ["ID", "Type", "Date", "Description", "Amount", "Status"];
    const dataRows = filteredRows.map((row) => [
      row.id,
      row.type,
      row.date ? new Date(row.date).toLocaleString() : "-",
      row.description,
      String(row.amount),
      row.status,
    ]);

    const csv = [headers, ...dataRows]
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transaction-history.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-[#11121d] border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] selection:bg-primary/10">
      {/* Tabs Header */}
      <div className="px-6 md:px-10 pt-8 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-6 md:gap-8 relative flex-wrap">
          {FILTERS.map((tab) => (
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
        
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#7C3AED] transition-all"
        >
           <FileDown className="w-3.5 h-3.5" /> Export .CSV
        </button>
      </div>

      <div className="hidden md:block">
        <table className="w-full table-fixed text-left border-collapse">
          <thead>
            <tr>
               <th className="w-[38%] px-4 lg:px-8 py-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800/50">Description</th>
               <th className="w-[18%] px-4 lg:px-6 py-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800/50">Date</th>
               <th className="w-[14%] px-4 lg:px-6 py-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800/50">Type</th>
               <th className="w-[14%] px-4 lg:px-6 py-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800/50 text-right">Amount</th>
               <th className="w-[16%] px-4 lg:px-8 py-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800/50 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50 dark:divide-slate-800/50">
            {!loading && filteredRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all group cursor-default">
                <td className="px-4 lg:px-8 py-5">
                  <div className="text-[13px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{row.description}</div>
                </td>
                <td className="px-4 lg:px-6 py-5 text-[11px] font-bold text-slate-400 tabular-nums">
                  {row.date ? new Date(row.date).toLocaleString() : "-"}
                </td>
                <td className="px-4 lg:px-6 py-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                  {formatType(row.type)}
                </td>
                <td className={cn(
                  "px-4 lg:px-6 py-5 text-[13px] font-black tabular-nums text-right whitespace-nowrap",
                  row.amount > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {formatAmount(row.amount)}
                </td>
                <td className="px-4 lg:px-8 py-5 text-right">
                   <div className={cn(
                     "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                     row.status === "Completed" && "bg-green-500/5 text-green-500 border-green-500/10",
                     row.status === "Pending" && "bg-yellow-500/5 text-yellow-500 border-yellow-500/10",
                     row.status === "Failed" && "bg-red-500/5 text-red-500 border-red-500/10",
                   )}>
                      {row.status === "Completed" && <CheckCircle2 className="w-2.5 h-2.5" />}
                      {row.status === "Pending" && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                      {row.status === "Failed" && <XCircle className="w-2.5 h-2.5" />}
                      {row.status}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden px-4 py-4 space-y-3">
        {!loading && filteredRows.map((row) => (
          <div key={row.id} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/30 dark:bg-white/[0.01]">
            <div className="text-[13px] font-black text-slate-900 dark:text-white leading-snug">{row.description}</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div className="text-slate-400 font-bold">Date</div>
              <div className="text-slate-800 dark:text-slate-200 font-bold text-right">{row.date ? new Date(row.date).toLocaleString() : "-"}</div>
              <div className="text-slate-400 font-bold">Type</div>
              <div className="text-slate-800 dark:text-slate-200 font-bold text-right uppercase">{formatType(row.type)}</div>
              <div className="text-slate-400 font-bold">Amount</div>
              <div className={cn("font-black text-right whitespace-nowrap", row.amount > 0 ? "text-green-500" : "text-red-500")}>{formatAmount(row.amount)}</div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredRows.length === 0 && (
        <div className="px-10 py-12 text-center text-[12px] font-bold text-slate-400 uppercase tracking-widest">
          No transactions found for this filter.
        </div>
      )}

      {loading && (
        <div className="px-10 py-12 text-center text-[12px] font-bold text-slate-400 uppercase tracking-widest">
          Loading transaction history...
        </div>
      )}

      <div className="px-6 md:px-10 py-8 bg-slate-50/30 dark:bg-white/[0.01] border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             Showing <span className="text-slate-900 dark:text-white font-black">{filteredRows.length}</span> of {rows.length} transactions
          </div>
          <div className="flex items-center gap-2">
              <button className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-30" disabled>←</button>
              <div className="px-4 h-9 flex items-center justify-center rounded-xl bg-[#7C3AED10] text-[11px] font-black text-[#7C3AED] tracking-tighter">1</div>
              <button className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 transition-all disabled:opacity-30" disabled>→</button>
          </div>
      </div>
    </div>
  );
}
