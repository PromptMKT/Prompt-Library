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
    { label: "Prompts", value: promptsCount.toLocaleString(), id: "prompts", color: "text-foreground" },
    { label: "Total sales", value: totalSales.toLocaleString(), color: "text-[#A78BFA]" },
    { label: "Avg rating", value: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : "—", id: "reviews", color: "text-[#e8a838]" },
    { label: "Reviews", value: reviewsCount.toLocaleString(), id: "reviews", color: "text-foreground" },
    { label: "Response rate", value: "98%", color: "text-[#22d3ee]" },
  ];

  const ownerStats = [
    { label: "Prompts", value: promptsCount.toLocaleString(), id: "prompts", color: "text-foreground" },
    { label: "Total sales", value: totalSales.toLocaleString(), color: "text-[#A78BFA]" },
    { label: "Avg rating", value: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : "—", id: "reviews", color: "text-[#e8a838]" },
    { label: "Purchased", value: purchasedCount.toLocaleString(), id: "purchased", color: "text-foreground" },
    { label: "Coins", value: `◈ ${coins.toLocaleString()}`, color: "text-[#22d3ee]" },
  ];

  const stats = isOwner ? ownerStats : visitorStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 border-b border-[rgba(124,58,237,0.13)] w-full">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center py-[18px] text-center cursor-pointer transition-all duration-150 border-r border-[rgba(124,58,237,0.13)] last:border-r-0 hover:bg-[rgba(139,92,246,0.08)] group relative"
          onClick={() => stat.id && onTabChange && onTabChange(stat.id)}
        >
          <div className={cn("text-[20px] font-extrabold font-mono leading-none mb-1", stat.color)}>
            {stat.value}
          </div>
          <div className="text-[10px] text-[#9B8EC4] font-semibold uppercase tracking-[0.5px]">{stat.label}</div>
          <div className="absolute bottom-0 left-[25%] right-[25%] h-[2px] rounded-[2px] bg-[#8B5CF6] opacity-0 transition-opacity duration-200 group-hover:opacity-60" />
        </div>
      ))}
    </div>
  );
}
