"use client";

import { cn } from "@/lib/utils";

interface ProfileStatsProps {
  onTabChange?: (tab: any) => void;
  isOwner?: boolean;
  promptsCount?: number;
  totalSales?: number;
  avgRating?: number;
  reviewsCount?: number;
  coins?: number;
  purchasedCount?: number;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toLocaleString();
}

export function ProfileStats({
  onTabChange,
  isOwner = false,
  promptsCount = 0,
  totalSales = 0,
  avgRating = 0,
  reviewsCount = 0,
  coins = 0,
  purchasedCount = 0,
}: ProfileStatsProps) {
  const visitorStats = [
    { label: "Prompts", value: String(promptsCount), id: "prompts", color: "text-foreground" },
    { label: "Total sales", value: formatCompact(totalSales), color: "text-[#A78BFA]" },
    { label: "Avg rating", value: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : "N/A", id: "reviews", color: avgRating > 0 ? "text-[#e8a838]" : "text-muted-foreground" },
    { label: "Reviews", value: String(reviewsCount), id: "reviews", color: "text-foreground" },
    { label: "Response rate", value: "—", color: "text-muted-foreground" },
  ];

  const ownerStats = [
    { label: "Prompts", value: String(promptsCount), id: "prompts", color: "text-foreground" },
    { label: "Total sales", value: formatCompact(totalSales), color: "text-[#A78BFA]" },
    { label: "Avg rating", value: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : "N/A", id: "reviews", color: avgRating > 0 ? "text-[#e8a838]" : "text-muted-foreground" },
    { label: "Purchased", value: String(purchasedCount), id: "purchased", color: "text-foreground" },
    { label: "Coins", value: `◈ ${formatCompact(coins)}`, color: "text-[#22d3ee]" },
  ];

  const stats = isOwner ? ownerStats : visitorStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 border-b border-border/50 w-full max-w-[1400px] mx-auto">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center py-4 text-center cursor-pointer transition-all duration-150 border-r border-border/50 last:border-r-0 hover:bg-primary/5 group relative"
          onClick={() => stat.id && onTabChange && onTabChange(stat.id)}
        >
          <div className={cn("text-lg font-extrabold font-mono leading-none mb-1", stat.color)}>
            {stat.value}
          </div>
          <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</div>
          <div className="absolute bottom-0 left-[25%] right-[25%] h-[2px] rounded bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-60" />
        </div>
      ))}
    </div>
  );
}
