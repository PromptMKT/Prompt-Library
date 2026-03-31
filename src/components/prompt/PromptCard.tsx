"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Eye, Heart, Share2, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { toggleWishlistAction, isWishlisted as checkWishlisted } from "@/app/actions/wishlist"
import { toast } from "sonner"

interface PromptCardProps {
  id: string
  title: string
  tagline?: string
  price: number
  rating: number
  platform: string
  author: {
    username: string
    avatar: string
  }
  previewImage: string
  promptPreview?: string
  initialWishlisted?: boolean
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={cn(
          "w-3 h-3",
          s <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground/30"
        )}
      />
    ))}
    <span className="text-[10px] font-black text-muted-foreground ml-1">
      {rating}
    </span>
  </div>
)

const ActionStrip = ({ 
  isWishlisted, 
  onWishlistToggle 
}: { 
  isWishlisted: boolean, 
  onWishlistToggle: (e: React.MouseEvent) => void 
}) => (
  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-6 group-hover:translate-x-0 z-30 duration-200">
    <button 
      className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-primary flex items-center justify-center shadow-xl hover:bg-primary hover:text-white transition-all transform hover:scale-110"
      onClick={(e) => { e.stopPropagation(); toast("Opening preview...") }}
    >
      <Eye className="w-4 h-4" />
    </button>
    <button 
      className={cn(
        "w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all transform hover:scale-110",
        isWishlisted ? "text-rose-500" : "text-slate-500 hover:text-rose-500"
      )}
      onClick={onWishlistToggle}
    >
      <Heart className={cn("w-4 h-4", isWishlisted && "fill-rose-500")} />
    </button>
    <button 
      className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-slate-500 flex items-center justify-center shadow-xl hover:text-blue-500 transition-all transform hover:scale-110"
      onClick={(e) => { e.stopPropagation(); toast("Link copied to clipboard!") }}
    >
      <Share2 className="w-4 h-4" />
    </button>
  </div>
)

export function PromptCard({
  id,
  title,
  tagline,
  price,
  rating,
  platform,
  author,
  previewImage,
  promptPreview,
  initialWishlisted = false,
}: PromptCardProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(initialWishlisted)

  React.useEffect(() => {
    // Sync with DB if not provided
    if (initialWishlisted === undefined) {
      checkWishlisted(id).then(setIsWishlisted)
    }
  }, [id, initialWishlisted])

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // Optimistic update
    const previousState = isWishlisted
    setIsWishlisted(!previousState)

    const result = await toggleWishlistAction(id)
    if (result.success) {
      setIsWishlisted(result.wishlisted ?? !previousState)
      toast.success(result.wishlisted ? "Added to wishlist" : "Removed from wishlist")
    } else {
      // Revert on failure
      setIsWishlisted(previousState)
      toast.error(result.error || "Failed to update wishlist")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="glass-card group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-[#181824] border border-border/60 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300"
    >
      <div className="aspect-square relative overflow-hidden">
        {previewImage ? (
          <img
            src={previewImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary/15 via-transparent to-primary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <ActionStrip 
          isWishlisted={isWishlisted} 
          onWishlistToggle={handleWishlistToggle} 
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-md text-white border border-white/10">
          {platform}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-[13px] font-black text-foreground line-clamp-2 leading-snug">
          {title}
        </div>
        {tagline && (
          <p className="text-[11px] text-muted-foreground line-clamp-1 font-medium">
            {tagline}
          </p>
        )}
        <Stars rating={rating} />
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <img
              src={author.avatar}
              className="w-6 h-6 rounded-full"
              alt={author.username}
            />
            <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[80px]">
              {author.username}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-black text-primary">₹{price}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
