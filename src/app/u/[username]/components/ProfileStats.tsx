"use client";

import { cn } from "@/lib/utils";

interface ProfileStatsProps {
  onTabChange: (tab: any) => void;
}

export function ProfileStats({ onTabChange }: ProfileStatsProps) {
  const stats = [
    { label: "Prompts published", value: 41, id: 'published', color: "text-primary" },
    { label: "Total purchases", value: 128, id: 'purchased', color: "text-primary" },
    { label: "Total sales made", value: "1,847", color: "text-primary" },
    { label: "Total earned", value: `2,840`, color: "text-primary" },
    { label: "Verified reviews", value: 327, id: 'reviews', color: "text-primary" },
  ];

  return (
    <div className="flex flex-wrap border-b border-border w-full">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="flex-1 min-w-[150px] py-6 px-5 text-center cursor-pointer hover:bg-primary/5 transition-all duration-300 border-r border-border last:border-r-0 group"
          onClick={() => stat.id && onTabChange(stat.id)}
        >
          <div className={cn("text-3xl font-black tracking-tighter mb-1 transition-transform group-hover:scale-110 duration-500", stat.color)}>
            {i === 3 && <span className="text-xl mr-1 opacity-50 select-none">◈</span>}
            {stat.value}
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
