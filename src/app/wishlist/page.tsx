"use client";

import { useState, useEffect } from "react";
import { Heart, Search, Filter, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Reuse the card logic
const WishlistPromptCard = ({ prompt: p }: { prompt: any }) => (
  <motion.div 
    layout 
    initial={{ opacity: 0, scale: 0.95 }} 
    animate={{ opacity: 1, scale: 1 }} 
    exit={{ opacity: 0, scale: 0.95 }}
    className="group bg-card/40 border border-border rounded-2xl overflow-hidden hover:translate-y-[-4px] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
  >
     <div className="h-[140px] relative overflow-hidden bg-secondary relative">
        {p.image ? (
          <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="p-4 flex flex-col gap-1 text-[9px] font-medium text-muted-foreground overflow-hidden h-full">
             <div className="text-foreground font-bold mb-1 line-clamp-2 uppercase italic leading-snug">{p.title}</div>
             <div className="opacity-60 leading-relaxed font-mono">{p.promptPreview || "Act as a specialist and create..."}</div>
          </div>
        )}
        <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0 duration-300">
           <button 
             className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-rose-500 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
             onClick={(e) => { e.stopPropagation(); toast("Removed from wishlist"); }}
           >
              <Heart className="w-5 h-5 fill-rose-500" />
           </button>
        </div>
        <div className="absolute top-3 left-3 z-[20]">
          <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/60 text-white backdrop-blur-md border border-white/10">{p.platform}</span>
        </div>
     </div>
     <div className="p-5 flex flex-col flex-1">
       <div className="text-[10px] font-black uppercase tracking-[0.15em] text-primary mb-2">{p.category}</div>
       <div className="text-sm font-black text-foreground mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{p.title}</div>
       <div className="flex items-center gap-1.5 text-[11px] mb-4">
         <span className="text-primary font-black tracking-tight">{p.rating > 0 ? "★★★★★" : "☆☆☆☆☆"}</span>
         <span className="font-bold text-foreground">{p.rating > 0 ? p.rating.toFixed(1) : "0.0"}</span>
         <span className="text-muted-foreground">({p.reviewsCount})</span>
       </div>
       <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
         <div className="text-[10px] font-black uppercase tracking-widest text-primary/70">{p.sales} sales</div>
         <div className="text-sm font-black text-primary font-mono tracking-tighter">₹ {p.price}</div>
       </div>
     </div>
  </motion.div>
);

const wishlistItems = [
  { id: "1", title: "Corporate Presentation Wizard", price: 45, sales: 842, platform: "Midjourney", category: "Design", reviewsCount: 322, rating: 4.8, image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=200&fit=crop" },
  { id: "2", title: "Advanced Python Debugger Prompt", price: 29, sales: 1205, platform: "Claude", category: "Programming", reviewsCount: 521, rating: 4.9 },
  { id: "3", title: "Travel Blog Blueprint", price: 15, sales: 42, platform: "ChatGPT", category: "Writing", reviewsCount: 8, rating: 4.5 },
  { id: "4", title: "Product Photography AI Assistant", price: 35, sales: 231, platform: "FLUX", category: "Marketing", reviewsCount: 44, rating: 4.7, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop" },
];

export default function WishlistPage() {
  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-4">
            Wishlist <span className="text-xl font-bold bg-primary/10 text-primary px-3 py-1 rounded-2xl">{wishlistItems.length}</span>
          </h1>
          <p className="text-muted-foreground font-medium">Keep track of the prompts you want to buy later.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-xl border border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="h-10 px-4 rounded-xl border border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all flex items-center gap-2">
            Most Recent <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </header>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
          <AnimatePresence mode="popLayout">
            {wishlistItems.map((item) => (
              <WishlistPromptCard key={item.id} prompt={item} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center text-center space-y-6">
           <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/30 animate-pulse">
              <Heart className="w-12 h-12" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-foreground">Your wishlist is empty</h3>
              <p className="text-sm text-muted-foreground">Start exploring our library and save prompts you love.</p>
           </div>
           <button className="px-8 py-3 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
             Explore Library
           </button>
        </div>
      )}
    </div>
  );
}
