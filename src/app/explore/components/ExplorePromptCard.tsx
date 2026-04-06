"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Eye, Heart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toggleWishlistAction, isWishlisted as checkWishlisted } from "@/app/actions/wishlist";
import { toast } from "sonner";
import { createPortal } from "react-dom";

type ExplorePromptCardProps = {
  id: string;
  title: string;
  description?: string;
  image: string;
  rating: number;
  usageCount: number;
  viewsCount?: number;
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
  const trimmed = (rawTitle || "Untitled").trim();
  const lowered = trimmed.toLowerCase();

  if (lowered.startsWith(oldPrefix)) {
    const rest = trimmed.slice(oldPrefix.length).trimStart();
    return rest ? `Prompt to ${rest}` : "Prompt to";
  }

  if (lowered.startsWith(basePrefix)) return trimmed;
  return `Prompt to ${trimmed}`;
}

function creatorInitials(name: string): string {
  if (!name) return "??";
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
  viewsCount = 0,
  tags,
  creator,
  price,
  category,
  platform = "AI",
  mode = "grid",
  initialWishlisted = false,
}: ExplorePromptCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (initialWishlisted !== undefined) {
      setIsWishlisted(initialWishlisted);
    }
  }, [initialWishlisted, id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const previous = isWishlisted;
    setIsWishlisted(!previous);

    const res = await toggleWishlistAction(id);
    if (!res.success) {
      setIsWishlisted(previous);
      toast.error(res.error || "Failed to update wishlist");
    } else {
      setIsWishlisted(res.wishlisted ?? !previous);
      toast.success(res.wishlisted ? "Added to wishlist" : "Removed from wishlist");
    }
  };

  const handleOpenView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsViewOpen(true);
  };

  const isVideo = (url: string) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0].toLowerCase();
    return cleanUrl.endsWith(".mp4") || cleanUrl.endsWith(".webm") || cleanUrl.endsWith(".mov") || cleanUrl.endsWith(".ogg");
  };

  const router = useRouter();
  const displayTitle = withPromptPrefix(title);
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
        "w-full max-w-70 flex flex-col"
      )}
    >
      {/* ── CARD CONTENT (Wrapped in a single Link for consistency) ── */}
      <Link href={`/prompt/${id}`} className="flex-1 flex flex-col relative z-0">
        {/* ── IMAGE SECTION ── */}
        <div className="h-[231px] w-full relative overflow-hidden bg-slate-100">
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
        </div>

        {/* ── INFO SECTION ── */}
        <div className="p-4 flex-1 flex flex-col relative bg-white">
          <div className="flex items-center gap-1.5 mb-2 text-[10px]">
            <span className="text-purple-600 tracking-widest">★★★★★</span>
            <span className="font-mono font-bold text-slate-900">{normalizedRating.toFixed(1)}</span>
            <span className="text-slate-400 font-medium italic">({usageCount})</span>
            <div className="h-3 w-px bg-slate-200 mx-0.5" />
            <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
              <Eye className="w-2.5 h-2.5" /> {viewsCount.toLocaleString()}
            </span>
          </div>
          
          <div className="card-title line-clamp-3">
            {displayTitle}
          </div>
          
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

      {/* ── OVERLAY ICONS (Moved OUTSIDE Link to ensure clean click capture) ── */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handleOpenView}
          className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition-colors shadow-sm"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button 
          onClick={handleWishlistToggle}
          className={cn(
            "w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors shadow-sm",
            isWishlisted ? "text-rose-400 border-rose-400/50 bg-rose-500/10" : "text-white hover:text-rose-400 hover:border-rose-400/50"
          )}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-rose-400")} />
        </button>
      </div>

      {/* ── EXPANDED VIEW MODAL (Portal) ── */}
      <AnimatePresence>
        {isViewOpen && isMounted && createPortal(
          <motion.div
            key="expanded-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10 overflow-hidden"
            onClick={() => setIsViewOpen(false)}
          >
            {/* ... modal content ... */}
            <motion.button
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="fixed top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-[10000]"
              onClick={(e) => { e.stopPropagation(); setIsViewOpen(false); }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-5xl w-full max-h-full flex flex-col items-center gap-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-slate-900 aspect-video md:aspect-auto">
                {isVideo(image) ? (
                  <video 
                    src={image} 
                    autoPlay 
                    loop 
                    muted 
                    controls 
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                ) : (
                  <img 
                    src={image} 
                    alt={displayTitle} 
                    className="w-full h-auto max-h-[70vh] object-contain" 
                  />
                )}
              </div>

              <div className="text-center space-y-6 px-4">
                <h2 className="text-2xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg">{displayTitle}</h2>
                <div className="flex flex-wrap items-center justify-center gap-4">
                   <div className="flex items-center gap-3 text-slate-300 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                      <div className="w-6 h-6 rounded-full bg-purple-500/40 flex items-center justify-center text-[10px] font-black text-white">
                        {creatorInitials(creator)}
                      </div>
                      <span className="text-sm font-bold font-mono tracking-tight">@{creator}</span>
                   </div>
                   <Link href={`/prompt/${id}`} onClick={() => setIsViewOpen(false)}>
                     <button 
                       className="px-10 py-3.5 rounded-full bg-purple-600 text-white font-black text-sm uppercase tracking-[0.1em] hover:bg-purple-500 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-purple-600/30"
                     >
                       Get Prompt Details
                     </button>
                   </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </motion.article>
  );
}
