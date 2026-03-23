"use client";

import { Download, ChevronRight, ShoppingBag, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const purchasedItems = [
  { id: "1", title: "Corporate Presentation Wizard", date: "Mar 18, 2026", price: 45, platform: "Midjourney", author: "design_guru", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&h=100&fit=crop" },
  { id: "2", title: "Advanced Python Debugger Prompt", date: "Mar 12, 2026", price: 29, platform: "Claude", author: "code_master" },
  { id: "3", title: "Travel Blog Blueprint", date: "Feb 28, 2026", price: 15, platform: "ChatGPT", author: "content_ninja" },
];

export default function PurchasedPage() {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Purchased Prompts</h1>
        <p className="text-muted-foreground font-medium">Access and download your purchased AI prompts and assets.</p>
      </header>

      {purchasedItems.length > 0 ? (
        <div className="space-y-4">
          {purchasedItems.map((item) => (
            <div key={item.id} className="bg-card/40 border border-border/50 rounded-3xl p-5 hover:border-primary/30 hover:bg-secondary/30 transition-all group flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-secondary relative overflow-hidden flex-shrink-0">
                 {item.image ? (
                   <img src={item.image} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-muted-foreground font-black text-xs uppercase bg-primary/5">P</div>
                 )}
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                   <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">{item.platform}</span>
                   <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {item.date}</p>
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-muted-foreground">Sold by <span className="text-foreground font-bold hover:underline cursor-pointer">@{item.author}</span></p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                 <button className="h-11 px-6 rounded-2xl bg-secondary border border-border text-xs font-black uppercase tracking-widest text-foreground hover:bg-white hover:border-primary/50 transition-all flex items-center gap-2" onClick={() => toast.success("Opening prompt preview...")}>
                   <Eye className="w-4 h-4" /> View Prompt
                 </button>
                 <button className="h-11 px-6 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2" onClick={() => toast.success("Downloading prompt package...")}>
                   <Download className="w-4 h-4" /> Download
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center text-center space-y-6">
           <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/30">
              <ShoppingBag className="w-12 h-12" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-foreground">No purchases yet</h3>
              <p className="text-sm text-muted-foreground">Found something you like? Explore our library.</p>
           </div>
           <button className="px-8 py-3 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
             Explore Prompts
           </button>
        </div>
      )}
    </div>
  );
}
