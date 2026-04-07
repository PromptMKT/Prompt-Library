"use client";

import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  promptsCount?: number;
  reviewsCount?: number;
  purchasedCount?: number;
  wishlistCount?: number;
  isOwner?: boolean;
}

export function ProfileTabs({
  activeTab,
  onTabChange,
  promptsCount = 63,
  reviewsCount = 512,
  purchasedCount = 0,
  wishlistCount = 0,
  isOwner = false
}: ProfileTabsProps) {
  const visitorTabs = [
    { id: "prompts", label: "Prompts", count: promptsCount },
    { id: "reviews", label: "Reviews", count: reviewsCount },
    { id: "about", label: "About" },
  ];

  const ownerTabs = [
    { id: "prompts", label: "Published", count: promptsCount },
    { id: "purchased", label: "Purchased" },
    { id: "wishlist", label: "Wishlist" },
    { id: "activity", label: "Activity" },
    { id: "reviews", label: "Reviews", count: reviewsCount },
  ];

  const tabs = isOwner ? ownerTabs : visitorTabs;

  return (
    <div className="flex border-b border-[rgba(255,255,255,0.06)] mb-[22px] overflow-x-auto no-scrollbar relative z-10 w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-[18px] py-[10px] text-[13px] font-semibold cursor-pointer border-b-[2px] transition-colors whitespace-nowrap",
              isActive
                ? "text-[#A78BFA] border-[#8B5CF6]"
                : "text-[#8E8E9E] border-transparent hover:text-[#A78BFA]"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "ml-[8px] px-[6px] py-[2px] rounded-full text-[10px] whitespace-nowrap",
                isActive
                  ? "bg-[rgba(139,92,246,0.15)] text-[#A78BFA]"
                  : "bg-[rgba(255,255,255,0.05)] text-[#8E8E9E]"
              )}>
                {tab.count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
