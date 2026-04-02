"use client";

import React from "react";
import { Zap, Star, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

const PACKAGES = [
  { id: "starter", coins: 100, label: "Starter pack", price: 89, savings: "", popular: false, icon: Zap },
  { id: "popular", coins: 500, label: "Popular pack", price: 399, savings: "Save 10%", popular: true, icon: Star },
  { id: "pro", coins: 1200, label: "Pro pack", price: 849, savings: "Save 20%", popular: false, icon: Gem },
];

export function CoinPackages({
  onPurchaseAction,
  onCustomPurchaseAction,
  isPurchasing = false,
}: {
  onPurchaseAction: (id: string) => void;
  onCustomPurchaseAction?: (coins: number) => void;
  isPurchasing?: boolean;
}) {
  const [customCoins, setCustomCoins] = React.useState<string>("");

  const parsedCoins = Number.parseInt(customCoins || "0", 10);
  const safeCoins = Number.isFinite(parsedCoins) && parsedCoins > 0 ? parsedCoins : 0;
  const rupees = ((safeCoins / 50) * 20).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PACKAGES.map((pkg) => (
        <div 
          key={pkg.id}
          className={cn(
            "group bg-white dark:bg-[#11121d] border-2 rounded-[2.56rem] p-10 text-center relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer",
            pkg.popular 
              ? "border-[#7C3AED] shadow-[0_20px_40px_rgba(124,58,237,0.1)] ring-1 ring-[#7C3AED20]" 
              : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm",
            isPurchasing && "opacity-60 pointer-events-none"
          )}
          onClick={() => onPurchaseAction(pkg.id)}
        >
          {pkg.popular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-5 py-2 bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-b-2xl z-20 flex items-center gap-2">
              <Star className="w-3 h-3" /> Most popular
            </div>
          )}

          <div className="relative z-10">
            <div className="mt-8 mb-6">
              <div className="flex items-center justify-center gap-3">
                <span className="text-[36px] font-black text-[#7C3AED] opacity-80 select-none leading-none mt-1">◈</span>
                <span className="text-[64px] font-black text-[#7C3AED] tracking-[-0.05em] tabular-nums font-mono leading-none">
                  {pkg.coins}
                </span>
              </div>
              <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-4 opacity-70">{pkg.label}</div>
            </div>

            <div className="mb-8 space-y-1">
              <div className="text-[36px] font-black text-slate-900 dark:text-white tracking-tight leading-none">₹{pkg.price}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest opacity-60 mt-2">₹{(pkg.price / pkg.coins).toFixed(2)} per coin</div>
            </div>

            {pkg.savings && (
              <div className="mb-8 inline-block px-3 py-1 bg-[#7C3AED]/5 dark:bg-[#7C3AED]/10 border border-[#7C3AED]/10 dark:border-[#7C3AED]/20 text-[#7C3AED] text-[10px] font-black uppercase tracking-widest rounded-lg">
                {pkg.savings}
              </div>
            )}

            <button className={cn(
              "w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 shadow-sm",
              pkg.popular 
                ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-primary/20" 
                : "bg-slate-50 dark:bg-white/[0.04] text-[#1a1b25] dark:text-white border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
            )} disabled={isPurchasing}>
              {isPurchasing
                ? "Processing..."
                : `Buy ${pkg.id === 'pro' ? 'Pro' : pkg.id === 'popular' ? 'Popular' : 'Starter'}`}
            </button>
          </div>
        </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#11121d] border border-slate-100 dark:border-slate-800 rounded-[1.75rem] p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Custom Coins</label>
            <input
              type="number"
              min={1}
              step={1}
              value={customCoins}
              onChange={(e) => setCustomCoins(e.target.value)}
              placeholder="Enter number of coins"
              disabled={isPurchasing}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0e1018] text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Equivalent Rupees</label>
            <input
              type="text"
              readOnly
              value={`₹ ${rupees}`}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#141826] text-sm font-black text-slate-700 dark:text-slate-200"
            />
          </div>

          <button
            type="button"
            disabled={isPurchasing || safeCoins <= 0 || !onCustomPurchaseAction}
            onClick={() => {
              if (!onCustomPurchaseAction || safeCoins <= 0) return;
              onCustomPurchaseAction(safeCoins);
            }}
            className={cn(
              "h-12 px-8 rounded-xl text-[11px] font-black uppercase tracking-[0.18em] transition-all",
              isPurchasing || safeCoins <= 0 || !onCustomPurchaseAction
                ? "bg-slate-300 text-white cursor-not-allowed"
                : "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
            )}
          >
            {isPurchasing ? "Processing..." : "Buy"}
          </button>
        </div>
      </div>
    </div>
  );
}
