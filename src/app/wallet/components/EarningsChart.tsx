"use client";

import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from "recharts";
import { FileDown, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const CHART_DATA = [
  { name: 'Oct', earned: 280, spent: 120 },
  { name: 'Nov', earned: 380, spent: 180 },
  { name: 'Dec', earned: 520, spent: 240 },
  { name: 'Jan', earned: 610, spent: 290 },
  { name: 'Feb', earned: 720, spent: 340 },
  { name: 'Mar', earned: 840, spent: 380 },
];

export function EarningsChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-[#11121d] border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
           <h3 className="text-[14px] font-black text-[#1a1b25] dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#7C3AED]" /> Earnings performance
           </h3>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Last 6 Months activity</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-slate-800">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Oct 2025 - Mar 2026</span>
           </div>
           <button className="flex items-center gap-2 text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.2em] hover:text-[#5b21b6] transition-colors group">
             <FileDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
           </button>
        </div>
      </div>
      
      <div className="h-[340px] w-full pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={CHART_DATA} 
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            barGap={12}
          >
             <defs>
                <linearGradient id="earnedGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
                   <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#cbd5e1" stopOpacity={0.4} />
                   <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.1} />
                </linearGradient>
             </defs>
             <CartesianGrid 
               vertical={false} 
               strokeDasharray="3 3" 
               stroke="#cbd5e1" 
               opacity={0.1}
             />
             <XAxis 
               dataKey="name" 
               axisLine={false} 
               tickLine={false} 
               tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
               dy={15}
               className="font-sans uppercase tracking-[0.2em]"
             />
             <YAxis 
               axisLine={false} 
               tickLine={false} 
               tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
               ticks={[0, 200, 400, 600, 800, 1000]}
               dx={-5}
               className="font-sans"
             />
             <Tooltip 
               cursor={{ fill: 'rgba(124, 58, 237, 0.05)', radius: 12 }}
               contentStyle={{ 
                 borderRadius: '24px', 
                 backgroundColor: '#11121d', 
                 border: '1px solid rgba(255,255,255,0.1)', 
                 boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                 padding: '16px' 
               }}
               itemStyle={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
             />
             <Legend 
               iconType="circle" 
               align="right" 
               verticalAlign="top"
               iconSize={8}
               wrapperStyle={{ 
                 fontSize: 10, 
                 fontWeight: 900, 
                 textTransform: 'uppercase', 
                 letterSpacing: '0.2em', 
                 paddingBottom: '40px',
                 color: '#94a3b8',
                 opacity: 0.6
               }} 
             />
             <Bar 
               dataKey="earned" 
               name="Earned" 
               fill="url(#earnedGradient)" 
               radius={[6, 6, 0, 0]} 
               barSize={32}
             />
             <Bar 
               dataKey="spent" 
               name="Spent" 
               fill="url(#spentGradient)" 
               radius={[6, 6, 0, 0]} 
               barSize={32} 
             />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between select-none opacity-40">
        <div className="text-[9px] font-black tracking-[0.4em] uppercase text-slate-400">Ledger Index: v2.4.0</div>
        <div className="text-[9px] font-black tracking-[0.4em] uppercase text-[#7C3AED] italic">Verified Real-time Analytics</div>
      </div>
    </div>
  );
}
