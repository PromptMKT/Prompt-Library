"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, Heart, Share2, Star } from "lucide-react"
import { cn } from "@/lib/utils"
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
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted)

  useEffect(() => {
    setIsWishlisted(initialWishlisted)
  }, [initialWishlisted, id])

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const previous = isWishlisted
    setIsWishlisted(!previous)

    try {
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: id })
      })
      const res = await response.json()
      if (!res.success) {
        setIsWishlisted(previous)
        toast.error(res.error || "Failed to update wishlist")
      } else {
        setIsWishlisted(res.wishlisted ?? !previous)
        toast.success(res.wishlisted ? "Added to wishlist" : "Removed from wishlist")
      }
    } catch {
      setIsWishlisted(previous)
      toast.error("An error occurred")
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({ title, url: `/prompt/${id}` }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/prompt/${id}`)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <Link href={`/prompt/${id}`}>
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
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-6 group-hover:translate-x-0 z-30 duration-200">
            <Link href={`/prompt/${id}`} onClick={(e) => e.stopPropagation()}>
              <button className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-primary flex items-center justify-center shadow-xl hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                <Eye className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={handleWishlistToggle}
              className={cn(
                "w-9 h-9 rounded-xl backdrop-blur-sm flex items-center justify-center shadow-xl transition-all transform hover:scale-110",
                isWishlisted
                  ? "bg-rose-500/20 text-rose-500 border border-rose-400/50"
                  : "bg-white/90 text-slate-500 hover:text-rose-500"
              )}
            >
              <Heart className={cn("w-4 h-4", isWishlisted && "fill-rose-500")} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-slate-500 flex items-center justify-center shadow-xl hover:text-blue-500 transition-all transform hover:scale-110"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

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
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.location.href = `/u/${author.username}`
              }}
            >
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
    </Link>
  )
}
