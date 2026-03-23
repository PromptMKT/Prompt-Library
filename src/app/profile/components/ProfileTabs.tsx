"use client";

import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    { id: "published", label: "My Prompts", count: 41 },
    { id: "purchased", label: "Purchased", count: 23 },
    { id: "wishlist", label: "Wishlist", count: 14 },
    { id: "activity", label: "Activity" },
    { id: "reviews", label: "Reviews", count: 327 },
  ];

  return (
    <div className="flex border border-border rounded-2xl overflow-hidden bg-surface shadow-sm sticky top-24 z-30 transition-all">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 py-3 px-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer transition-all text-center flex items-center justify-center gap-2 border-r border-border last:border-r-0 hover:text-foreground hover:bg-secondary/30",
            activeTab === tab.id && "bg-primary/5 border-b-2 border-b-primary text-primary"
          )}
        >
          {tab.label} {tab.count !== undefined && <span className="py-[1px] px-2 rounded-full text-[10px] bg-primary/10 border border-primary/20 text-primary font-mono">{tab.count}</span>}
        </div>
      ))}
    </div>
  );
}
