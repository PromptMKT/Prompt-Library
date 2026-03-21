"use client";

import { Button } from "@/components/ui/button";
import { Download, Link2, Share, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface PurchaseSidebarProps {
  price: number;
  isPurchased: boolean;
  handlePurchase: () => void;
  seller: any;
}

export function PurchaseSidebar({ price, isPurchased, handlePurchase, seller }: PurchaseSidebarProps) {
  const sellerData = typeof seller === 'object' ? seller : { username: seller };
  const username = sellerData.username || sellerData.name || "anonymous";
  const avatar = sellerData.avatar || `https://avatar.iran.liara.run/public/boy?username=${username}`;

  return (
    <aside className="space-y-4">
      <div className="sticky top-20 bg-card shadow-sm dark:shadow-none border border-border/40 rounded-2xl overflow-hidden">
        {/* BUY CARD HEADER */}
        <div className="p-5 border-b border-border/40">
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="text-lg text-primary font-bold">⬡</span>
            <span className="font-mono text-[28px] font-bold text-primary">{price}</span>
            <span className="text-[13px] text-muted-foreground ml-1">≈ ${(price / 10).toFixed(2)}</span>
          </div>
          <div className="text-xs text-muted-foreground mb-4">One-time purchase · Yours forever</div>
          
          {!isPurchased ? (
            <Button className="w-full h-12 rounded-xl text-[15px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all mb-2.5" onClick={handlePurchase}>
              🔓 Buy Now — ⬡ {price} coins
            </Button>
          ) : (
            <Button className="w-full h-12 rounded-xl text-[14px] font-bold bg-secondary border border-border/40 hover:bg-muted transition-all mb-2.5">
              <Download className="w-4 h-4 mr-2" /> Download Source
            </Button>
          )}
          
          <Button variant="outline" className="w-full h-11 rounded-xl border-border/40 bg-transparent text-muted-foreground text-[13px] hover:text-primary hover:border-primary hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(108,99,255,0.15)] transition-all duration-300">
            ♡ Save to Wishlist
          </Button>

          <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-xl text-xs text-green-400 text-center leading-relaxed">
            🛡️ Verified buyer protection<br/>
            <span className="text-muted-foreground">If this prompt doesn't work, leave a review and get coin credit back</span>
          </div>
        </div>

        {/* BUY CARD BODY */}
        <div className="p-4 px-5 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-border/40 text-[13px]">
            <span className="text-muted-foreground">Platform</span>
            <span className="text-foreground font-medium font-mono text-[12px]">ChatGPT</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border/40 text-[13px]">
            <span className="text-muted-foreground">Category</span>
            <span className="text-foreground font-medium font-mono text-[12px]">Email Copy</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border/40 text-[13px]">
            <span className="text-muted-foreground">Variables</span>
            <span className="text-foreground font-medium font-mono text-[12px]">5 variables</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border/40 text-[13px]">
            <span className="text-muted-foreground">Last tested</span>
            <span className="text-foreground font-medium font-mono text-[12px]">Feb 2025</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border/40 text-[13px]">
            <span className="text-muted-foreground">Outputs</span>
            <span className="text-foreground font-medium font-mono text-[12px]">3 screenshots</span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-muted-foreground">Total sales</span>
            <span className="text-foreground font-medium font-mono text-[12px]">489</span>
          </div>
        </div>

        {/* SHARE */}
        <div className="p-4 flex gap-2">
          <button className="flex-1 py-2 px-3 rounded-lg border border-border/40 bg-transparent text-muted-foreground text-xs hover:bg-secondary/50 hover:-translate-y-0.5 hover:shadow-sm hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-1.5" onClick={() => toast.success("Link copied!")}>
            <Link2 className="w-3.5 h-3.5" /> Copy link
          </button>
          <button className="flex-1 py-2 px-3 rounded-lg border border-border/40 bg-transparent text-muted-foreground text-xs hover:bg-secondary/50 hover:-translate-y-0.5 hover:shadow-sm hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-1.5">
            <Share className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>

      {/* SELLER CARD */}
      <div className="p-4 bg-card shadow-sm dark:shadow-none rounded-2xl border border-border/40 mt-4">
        <div className="flex items-center gap-3 mb-3">
           <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-amber-300 flex items-center justify-center font-bold text-primary-foreground text-sm overflow-hidden">
             {avatar ? <img src={avatar} className="w-full h-full object-cover" /> : username.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">@{username}</div>
            <div className="text-[11px] text-muted-foreground">⭐ 4.9 seller · Top Creator</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-background/50 rounded-lg p-2 text-center">
            <div className="text-base font-bold text-primary font-mono">41</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">prompts listed</div>
          </div>
          <div className="bg-background/50 rounded-lg p-2 text-center">
            <div className="text-base font-bold text-primary font-mono">2.1k</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">total sales</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed mb-3">
          Specialises in AI engineering and conversion copy.
        </div>

        <div className="flex gap-2">
          <Link href={`/explore?q=${encodeURIComponent(username)}`} className="flex-2">
            <Button variant="outline" className="w-full h-9 rounded-lg border-border/40 bg-transparent text-muted-foreground text-xs hover:border-primary hover:text-primary transition-colors">
              View all prompts →
            </Button>
          </Link>
          <Button variant="outline" className="flex-1 h-9 rounded-lg border-border/40 bg-transparent text-muted-foreground text-xs hover:border-primary hover:text-primary transition-colors">
            + Follow
          </Button>
        </div>
      </div>
    </aside>
  );
}
