"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ExplorePromptCardProps = {
  id: string;
  title: string;
  image: string;
  rating: number;
  usageCount: number;
  tags: string[];
  creator: string;
  price: number;
  platform?: string;
  mode?: "grid" | "list";
};

function withPromptPrefix(rawTitle: string): string {
  const prefix = "prompt to generate";
  const trimmed = rawTitle.trim();
  if (trimmed.toLowerCase().startsWith(prefix)) return trimmed;
  return `Prompt to Generate ${trimmed}`;
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
  image,
  rating,
  usageCount,
  tags,
  creator,
  price,
  platform = "AI",
  mode = "grid",
}: ExplorePromptCardProps) {
  const displayTitle = withPromptPrefix(title);
  const displayTags = (tags || []).slice(0, 3);
  const normalizedRating = Number.isFinite(rating) ? rating : 4.8;

  return (
    <motion.article
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/60 bg-white dark:bg-[#181824] shadow-md hover:shadow-xl transition-all duration-300",
        "w-full max-w-[280px] min-h-[430px] flex flex-col"
      )}
    >
      <Link href={`/prompt/${id}`} className="w-full h-full flex flex-col">
        <div
          className={cn(
            "relative overflow-hidden bg-muted/40",
            "h-[200px] w-full"
          )}
        >
          {image ? (
            <img
              src={image}
              alt={displayTitle}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/15 via-transparent to-primary/10" />
          )}

          <div className="absolute top-4 left-4">
            <Badge className="rounded-full bg-black/50 text-white border-white/20 normal-case tracking-normal px-3 py-1 text-[11px] font-semibold">
              {platform}
            </Badge>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              className="w-9 h-9 rounded-full border border-white/25 bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Preview prompt"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full border border-white/25 bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-linear-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:scale-105 transition-transform"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="h-10 rounded-xl bg-white/85 dark:bg-black/30 border border-white/40 dark:border-white/20 text-foreground text-sm font-semibold hover:bg-white dark:hover:bg-black/45 transition-colors"
                >
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 flex flex-col gap-3 min-w-0 w-full flex-1">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary tracking-tight">{ratingStars(normalizedRating)}</span>
              <span className="font-bold text-foreground">{normalizedRating.toFixed(1)} ({Math.max(usageCount, 0)})</span>
            </div>

            <h3 className="text-[1.05rem] leading-tight font-bold tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {displayTitle}
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              {displayTags.map((tag) => (
                <Badge
                  key={tag}
                  className="rounded-full bg-primary/10 text-primary border-primary/20 normal-case tracking-normal px-2.5 py-1 text-[10px]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="h-px bg-border/60" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary text-[11px] font-black flex items-center justify-center shrink-0">
                {creatorInitials(creator || "Anonymous")}
              </div>
              <span className="text-sm text-muted-foreground truncate">{creator || "Unknown creator"}</span>
            </div>
            <span className="text-lg font-black text-primary">₹{price}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
