"use client";

import { cn } from "@/lib/utils";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { deletePromptAction, togglePromptStatusAction } from "@/app/actions/prompt";
import { toast } from "sonner";
import Link from "next/link";

interface SellerPromptCardProps {
  prompt: any;
  isOwner?: boolean;
}

export function SellerPromptCard({ prompt: p, isOwner = false }: SellerPromptCardProps) {
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

          {/* Owner Actions */}
          {isOwner && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
              <Link 
                href={`/upload?id=${p.id}`}
                className="p-2 rounded-full bg-white/90 text-slate-900 border border-border shadow-lg hover:bg-primary hover:text-white transition-all"
                onClick={(e) => e.stopPropagation()}
                title="Edit prompt"
              >
                <Edit className="w-3.5 h-3.5" />
              </Link>
              <button 
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to ${p.status === 'live' ? 'hide' : 'show'} this prompt?`)) {
                    const res = await togglePromptStatusAction(p.id, p.status !== 'live');
                    if (res.success) {
                      window.location.reload();
                    } else {
                      toast.error("Failed to toggle status");
                    }
                  }
                }}
                className="p-2 rounded-full bg-white/90 text-slate-900 border border-border shadow-lg hover:bg-amber-500 hover:text-white transition-all"
                title={p.status === 'live' ? "Hide prompt" : "Show prompt"}
              >
                {p.status === 'live' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this prompt forever?")) {
                    const res = await deletePromptAction(p.id);
                    if (res.success) {
                      window.location.reload();
                    } else {
                      toast.error("Failed to delete prompt");
                    }
                  }
                }}
                className="p-2 rounded-full bg-white/90 text-rose-500 border border-border shadow-lg hover:bg-rose-500 hover:text-white transition-all"
                title="Delete prompt"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
           <div className="flex items-center gap-3">
             <div className="text-[10px] font-black uppercase tracking-widest text-primary/70">{p.sales || 0} sales</div>
             <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
               <Eye className="w-3 h-3" /> {p.viewsCount || 0} views
             </div>
           </div>
           <div className="text-[14px] font-black text-primary font-mono tracking-tighter">₹ {p.price}</div>
         </div>
       </div>
    </div>
  );
}
