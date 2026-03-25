"use client";

import { cn } from "@/lib/utils";

interface SellerPromptCardProps {
  prompt: any;
}

export function SellerPromptCard({ prompt: p }: SellerPromptCardProps) {
  return (
    <div className="group bg-surface border border-border rounded-2xl overflow-hidden hover:translate-y-[-4px] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer flex flex-col">
       <div className="h-[140px] relative overflow-hidden bg-secondary/30">
          {p.image ? (
            <img src={p.image} className="w-full h-full object-cover" />
          ) : (
            <div className="p-4 flex flex-col gap-1 text-[9px] font-medium text-muted-foreground overflow-hidden h-full">
               <div className="text-foreground font-bold mb-1 line-clamp-2 uppercase italic">{p.promptText?.substring(0, 40)}...</div>
               <div className="opacity-60 leading-relaxed font-mono">{p.promptText?.substring(40, 200)}...</div>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/60 text-white backdrop-blur-md">{p.platform}</span>
          </div>
          <div className={cn(
            "absolute bottom-3 left-3 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm",
            p.status === 'live' ? "bg-success/10 border-success/30 text-success" : 
            p.status === 'draft' ? "bg-amber/10 border-amber/30 text-amber" :
            "bg-primary/10 border-primary/30 text-primary"
          )}>
            {p.status === 'live' ? "● Live" : p.status === 'draft' ? "◌ Draft" : "↺ Review"}
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
           <div className="text-[14px] font-black text-primary font-mono tracking-tighter">₹ {p.price}</div>
         </div>
       </div>
    </div>
  );
}
