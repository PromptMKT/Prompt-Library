"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface ReviewData {
  id: number;
  rating: number;
  title?: string;
  body?: string;
  createdAt?: string;
  promptTitle?: string;
  promptCategory?: string;
  reviewerName?: string;
  reviewerAvatar?: string;
}

interface ProfileReviewsProps {
  reviews?: ReviewData[];
  avgRating?: number;
}

export function ProfileReviews({ reviews = [], avgRating = 0 }: ProfileReviewsProps) {
  const [activeChip, setActiveChip] = useState("All reviews");

  const chips = ["All reviews", "5 ★", "4 ★", "3 ★"];

  // Compute review distribution
  const distribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as keyof typeof dist;
      dist[star]++;
    }
    return dist;
  }, [reviews]);

  const computedAvg = useMemo(() => {
    if (reviews.length === 0) return avgRating;
    return Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1));
  }, [reviews, avgRating]);

  // Filter reviews based on active chip
  const filteredReviews = useMemo(() => {
    if (activeChip === "All reviews") return reviews;
    const starMatch = activeChip.match(/^(\d)/);
    if (starMatch) {
      const targetStar = parseInt(starMatch[1]);
      return reviews.filter((r) => Math.round(r.rating) === targetStar);
    }
    return reviews;
  }, [reviews, activeChip]);

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  const getAvatarGradient = (index: number) => {
    const gradients = [
      "linear-gradient(135deg, #7C3AED, #A78BFA)",
      "linear-gradient(135deg, #10b981, #0ea5e9)",
      "linear-gradient(135deg, #f59e0b, #ef4444)",
      "linear-gradient(135deg, #ec4899, #8b5cf6)",
      "linear-gradient(135deg, #06b6d4, #3b82f6)",
    ];
    return gradients[index % gradients.length];
  };

  const starString = (rating: number) => {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  };

  if (reviews.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 text-center py-20">
        <p className="text-muted-foreground text-sm">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* SUMMARY */}
      <div className="grid grid-cols-[130px_1fr] gap-[22px] p-[18px_20px] bg-secondary/30 border border-border/40 rounded-[14px] mb-[18px] items-center max-md:grid-cols-1 max-md:justify-center">
        <div className="text-center">
          <div className="text-[48px] font-extrabold font-mono text-[#e8a838] leading-none">
            {computedAvg.toFixed(1)}
          </div>
          <div className="text-[18px] text-[#e8a838] my-1">{starString(computedAvg)}</div>
          <div className="text-[11px] text-muted-foreground">{reviews.length} verified review{reviews.length !== 1 ? "s" : ""}</div>
        </div>
        <div className="flex flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star as keyof typeof distribution];
            const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono w-[8px] text-right">{star}</span>
                <div className="flex-1 h-[5px] rounded-[3px] bg-secondary overflow-hidden">
                  <div className="h-full rounded-[3px] bg-[#e8a838]" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground/60 font-mono w-[24px]">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 mb-[16px] overflow-x-auto pb-1 no-scrollbar">
        {chips.map((chip) => (
          <div
            key={chip}
            onClick={() => setActiveChip(chip)}
            className={cn(
              "text-[12px] font-semibold px-[13px] py-[6px] rounded-[20px] cursor-pointer whitespace-nowrap transition-all duration-150 border",
              activeChip === chip
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-background border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            {chip}
          </div>
        ))}
        <select className="ml-auto bg-background border border-border/40 text-muted-foreground text-[12px] font-semibold py-[6px] px-[12px] rounded-[10px] outline-none cursor-pointer">
          <option>Most recent</option>
          <option>Highest rated</option>
        </select>
      </div>

      {/* REVIEWS LIST */}
      <div className="flex flex-col gap-2.5">
        {filteredReviews.map((rev, i) => (
          <div
            key={rev.id}
            className="bg-background border border-border/40 rounded-[12px] p-4 transition-colors duration-150 hover:border-border group"
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <div
                className="w-[36px] h-[36px] rounded-full flex flex-shrink-0 items-center justify-center text-[12px] font-bold text-white overflow-hidden"
                style={{ background: getAvatarGradient(i) }}
              >
                {rev.reviewerAvatar ? (
                  <img src={rev.reviewerAvatar} alt={rev.reviewerName} className="w-full h-full object-cover" />
                ) : (
                  getInitials(rev.reviewerName || "")
                )}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-foreground">{rev.reviewerName}</div>
                <div className="flex items-center gap-2 mt-[2px]">
                  <span className="text-[9px] font-bold tracking-[0.5px] px-[6px] py-[2px] rounded-full bg-[rgba(34,211,238,0.1)] text-[#22d3ee]">
                    ✓ Verified buyer
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">{formatDate(rev.createdAt)}</span>
                </div>
              </div>
              <div className="text-[14px] text-[#e8a838] shrink-0 tracking-widest">{starString(rev.rating)}</div>
            </div>

            {rev.body && (
              <div className="text-[12px] text-muted-foreground leading-[1.65] mb-3">
                "{rev.body}"
              </div>
            )}

            {rev.promptTitle && (
              <div className="text-[10px] text-muted-foreground/60 mb-3">
                On <span className="font-semibold text-foreground">{rev.promptTitle}</span>
                {rev.promptCategory && ` · ${rev.promptCategory}`}
              </div>
            )}

            <div className="flex items-center gap-[7px]">
              <span className="text-[10px] text-muted-foreground/60 font-medium mr-[3px]">Helpful?</span>
              <button className="text-[10px] font-bold text-muted-foreground px-2.5 py-[5px] rounded-[14px] border border-border/40 bg-secondary/30 cursor-pointer transition-colors hover:border-border hover:bg-secondary/50">
                👍
              </button>
              <button className="text-[10px] font-bold text-muted-foreground px-2.5 py-[5px] rounded-[14px] border border-border/40 bg-secondary/30 cursor-pointer transition-colors hover:border-border hover:bg-secondary/50">
                👎
              </button>
            </div>
          </div>
        ))}

        {reviews.length > filteredReviews.length && (
          <button className="w-full mt-[10px] text-center p-[11px] rounded-[10px] border border-border/40 bg-secondary/30 text-[13px] font-bold text-primary transition-all hover:bg-primary/10 hover:border-primary/20">
            Show all {reviews.length} reviews
          </button>
        )}
      </div>
    </div>
  );
}
