"use client";

import { useState, useEffect } from "react";
import { Heart, Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const toggleWishlistAction = async (promptId: string) => {
  const response = await fetch('/api/wishlist/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ promptId })
  });
  return response.json();
};

// Updated WishlistPromptCard to use real data and actions
const WishlistPromptCard = ({ prompt: p, onRemove }: { prompt: any; onRemove: (id: string) => void }) => (
  <motion.div 
    layout 
    initial={{ opacity: 0, scale: 0.95 }} 
    animate={{ opacity: 1, scale: 1 }} 
    exit={{ opacity: 0, scale: 0.95 }}
    className="group bg-card/40 border border-border rounded-2xl overflow-hidden hover:translate-y-[-4px] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
  >
     <div className="h-[140px] relative overflow-hidden bg-secondary">
        {p.image ? (
          <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.title} />
        ) : (
          <div className="p-4 flex flex-col gap-1 text-[9px] font-medium text-muted-foreground overflow-hidden h-full">
             <div className="text-foreground font-bold mb-1 line-clamp-2 uppercase italic leading-snug">{p.title}</div>
             <div className="opacity-60 leading-relaxed font-mono">{p.promptPreview || "Explore this prompt's capabilities..."}</div>
          </div>
        )}
        <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0 duration-300">
           <button 
             className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-rose-500 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
             onClick={async (e) => { 
                e.stopPropagation(); 
                const res = await toggleWishlistAction(p.id);
                if (res.success && !res.wishlisted) {
                  onRemove(p.id);
                  toast.success("Removed from wishlist");
                }
             }}
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
         <span className="text-amber-400 font-black tracking-tight">
           {"★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating))}
         </span>
         <span className="font-bold text-foreground">{p.rating > 0 ? p.rating.toFixed(1) : "0.0"}</span>
       </div>
       <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
         <div className="text-[10px] font-black uppercase tracking-widest text-primary/70">{p.sales} sales</div>
         <div className="text-sm font-black text-primary font-mono tracking-tighter">₹ {p.price}</div>
       </div>
     </div>
  </motion.div>
);

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('wishlist')
          .select(`
            prompt_id,
            prompts (
              id,
              title,
              description,
              price,
              cover_image_url,
              purchases_count,
              average_rating,
              platforms (name),
              categories (name)
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const mapped = (data || []).map((item: any) => ({
          id: item.prompts.id,
          title: item.prompts.title,
          price: item.prompts.price,
          sales: item.prompts.purchases_count || 0,
          platform: item.prompts.platforms?.name || "AI",
          category: item.prompts.categories?.name || "Prompt",
          rating: item.prompts.average_rating || 0,
          image: item.prompts.cover_image_url,
          promptPreview: item.prompts.description
        }));

        setItems(mapped);
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-4">
            Wishlist <span className="text-xl font-bold bg-primary/10 text-primary px-3 py-1 rounded-2xl">{items.length}</span>
          </h1>
          <p className="text-muted-foreground font-medium">Keep track of the prompts you want to buy later.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-xl border border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all flex items-center gap-2">
            Most Recent <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </header>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <WishlistPromptCard key={item.id} prompt={item} onRemove={handleRemove} />
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
           <Link href="/explore">
             <button className="px-8 py-3 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
               Explore Library
             </button>
           </Link>
        </div>
      )}
    </div>
  );
}
