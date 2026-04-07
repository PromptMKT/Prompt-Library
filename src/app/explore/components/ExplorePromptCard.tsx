"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ExplorePromptCardProps = {
  id: string;
  title: string;
  description?: string;
  image: string;
  rating: number;
  usageCount: number;
  tags: string[];
  creator: string;
  price: number;
  category?: string;
  platform?: string;
  mode?: "grid" | "list";
  initialWishlisted?: boolean;
};

function withPromptPrefix(rawTitle: string): string {
  const basePrefix = "prompt to";
  const oldPrefix = "prompt to generate";
  const trimmed = rawTitle.trim();
  const lowered = trimmed.toLowerCase();

  if (lowered.startsWith(oldPrefix)) {
    const rest = trimmed.slice(oldPrefix.length).trimStart();
    return rest ? `Prompt to ${rest}` : "Prompt to";
  }

  if (lowered.startsWith(basePrefix)) return trimmed;
  return `Prompt to ${trimmed}`;
}

function ratingStars(value: number): string {
  const rounded = Math.max(0, Math.min(5, Math.round(value)));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function creatorInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("")
    .slice(0, 2);
}

export function ExplorePromptCard({
  id,
  title,
  description,
  image,
  rating,
  usageCount,
  tags,
  creator,
  price,
  category,
  platform = "AI",
  mode = "grid",
}: ExplorePromptCardProps) {
  const router = useRouter();
  const displayTitle = withPromptPrefix(title);
  const displayTags = (tags || []).slice(0, 3);
  const normalizedRating = Number.isFinite(rating) ? rating : 4.8;
  const listDescription = (description || title || "Untitled prompt").trim();

  if (mode === "list") {
    return (
      <motion.article transition={{ duration: 0.2, ease: "easeOut" }} className="w-full">
        <Link href={`/prompt/${id}`} className="block w-full py-5 hover:bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_180px_160px] gap-3 md:gap-6 items-start">
            <div className="min-w-0">
              <p className="text-[15px] md:text-[16px] leading-6 text-foreground truncate">{listDescription}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold md:hidden">Category</p>
              <p className="text-[14px] text-foreground/90 truncate">{category || tags?.[0] || "Prompt"}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold md:hidden">Product</p>
              <p className="text-[14px] text-foreground/90 truncate">{platform || "AI"}</p>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md hover:shadow-xl hover:border-purple-500 transition-all duration-300",
        "w-full max-w-70 flex flex-col cursor-pointer"
      )}
    >
      <Link href={`/prompt/${id}`} className="w-full flex-1 flex flex-col">
        {/* ── IMAGE SECTION ── */}
        <div className="h-42.5 w-full relative overflow-hidden bg-slate-100">
          {image ? (
            <img 
              src={image} 
              alt={displayTitle} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full bg-slate-200 animate-pulse" />
          )}

          {/* Top-Left Platform Badge */}
          <span className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-md border border-white/10 text-white rounded-full text-[9px] font-black tracking-widest uppercase shadow-md z-10">
            {platform}
          </span>

          {/* Top-Right Glass Icons (Hover Only) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition-colors shadow-sm"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:text-rose-400 hover:border-rose-400/50 transition-colors shadow-sm"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── CONTENT SECTION ── */}
        <div className="p-4 flex-1 flex flex-col relative bg-white">
          
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2 text-[10px]">
            <span className="text-purple-600 tracking-widest">★★★★★</span>
            <span className="font-mono font-bold text-slate-900">{normalizedRating.toFixed(1)}</span>
            <span className="text-slate-400 font-medium italic">({usageCount})</span>
          </div>
          
          {/* Title - Card Title style */}
          <div className="card-title line-clamp-3">
            {displayTitle}
          </div>
          
          {/* Footer (Author & Price) */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
            <div 
              className="flex items-center gap-2 flex-1 cursor-pointer hover:opacity-80 transition-opacity z-20"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/u/${creator}`); }}
            >
              <div className="w-5 h-5 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[8px] font-bold text-white shadow-sm shrink-0">
                {creatorInitials(creator || "Anonymous")}
              </div>
              <div className="text-[11px] font-medium text-slate-700 truncate hover:text-purple-600 transition-colors">
                {creator}
              </div>
            </div>
            <div className="text-sm font-bold font-mono text-purple-600">
              ◈ {price}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
