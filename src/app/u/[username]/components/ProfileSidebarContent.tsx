"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  coins?: number;
  totalSales?: number;
  platformBreakdown?: { name: string; count: number }[];
  prompts?: any[];
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toLocaleString();
}

const PLAT_COLORS: Record<string, string> = {
  ChatGPT: "bg-[#10a37f]",
  Claude: "bg-[#7C3AED]",
  FLUX: "bg-[#8B5CF6]",
  Midjourney: "bg-[#fb923c]",
  Gemini: "bg-[#4285f4]",
  Cursor: "bg-[#38bdf8]",
  Copilot: "bg-[#38bdf8]",
};

export function ProfileSidebarContent({
  coins = 0,
  totalSales = 0,
  platformBreakdown = [],
  prompts = [],
}: ProfileSidebarProps) {
  const totalEarnings = prompts.reduce((acc, p) => acc + (p.sales || 0) * (p.price || 0), 0);
  const bestPrompt = [...prompts].sort((a, b) => (b.sales || 0) - (a.sales || 0))[0];

  return (
    <aside className="space-y-4 max-w-[340px] w-full">

      {/* Coin Wallet */}
      <div className="bg-white dark:bg-[#181824] border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Coin Wallet</h4>
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:rotate-12">
            <Wallet className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-3xl font-black tracking-tighter text-foreground leading-none mb-1">
              <span className="text-xl text-primary/40 select-none">◈</span>
              {formatCompact(coins)}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              ≈ ₹ {formatCompact(Math.round(coins * 0.89))} available
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/wallet" className="flex-1">
              <button className="w-full h-11 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-primary/15">
                + Top up
              </button>
            </Link>
            <Link href="/wallet" className="flex-1">
              <button className="w-full h-11 rounded-xl bg-secondary/40 border border-border text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-secondary transition-all">
                History
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="bg-background border border-border rounded-2xl p-5 hover:border-primary/20 transition-all">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Earnings Overview</h4>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center">
            <div className="text-2xl font-black tracking-tighter text-foreground mb-1">{formatCompact(totalSales)}</div>
            <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total Sales</div>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Total prompts", value: String(prompts.length), color: "text-foreground" },
              { label: "Best prompt", value: bestPrompt ? `${(bestPrompt.sales || 0).toLocaleString()} sales` : "—", color: "text-[#e8a838]" },
              { label: "Est. earnings", value: totalEarnings > 0 ? `₹ ${formatCompact(totalEarnings)}` : "—", color: "text-primary" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{item.label}</span>
                <span className={cn("font-bold font-mono", item.color)}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[10px] uppercase tracking-wider">
            <span className="text-muted-foreground font-bold">Withdrawal</span>
            <span className="text-primary italic opacity-60 font-bold">Coming soon</span>
          </div>
        </div>
      </div>

      {/* Platforms */}
      {platformBreakdown.length > 0 && (
        <div className="bg-background border border-border rounded-2xl p-5 hover:border-primary/20 transition-all">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">My Platforms</h4>
          <div className="space-y-1.5">
            {platformBreakdown.map((plat, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-secondary/20 border border-transparent hover:border-primary/15 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", PLAT_COLORS[plat.name] || "bg-primary")} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80 group-hover:text-primary transition-colors">{plat.name}</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">{plat.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
