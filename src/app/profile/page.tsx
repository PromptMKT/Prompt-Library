"use client";

import React, { useState } from "react";
import { 
  Camera, 
  Edit2, 
  ExternalLink, 
  MapPin, 
  MessageSquare, 
  MoreHorizontal, 
  Share2, 
  Star, 
  CheckCircle2,
  TrendingUp,
  Clock,
  Layout,
  Plus,
  ArrowRight,
  Wallet,
  History,
  TrendingUp as EarningsIcon,
  ShoppingBag,
  Heart,
  Activity,
  MessageCircle,
  Copy,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("published");
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data matching the HTML provided
  const stats = [
    { label: "Prompts published", value: "41", type: "default" },
    { label: "Total purchases", value: "128", type: "default" },
    { label: "Total sales made", value: "1,847", type: "primary" },
    { label: "Total earned", value: "◈ 2,840", type: "primary" },
    { label: "Verified reviews", value: "327", type: "default" },
  ];

  const platforms = [
    { name: "ChatGPT", count: "18 prompts", color: "var(--primary)" },
    { name: "Claude", count: "12 prompts", color: "var(--primary)" },
    { name: "FLUX", count: "7 prompts", color: "var(--primary)" },
    { name: "Midjourney", count: "4 prompts", color: "var(--primary)" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* COVER BANNER */}
      <div className="h-[220px] relative overflow-hidden bg-gradient-to-br from-[#1a0b3b] via-[#2d1b5a] to-[#0f0a20]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.2)_0%,transparent_40%)]" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <button className="absolute top-6 right-8 px-4 py-2 rounded-2xl text-[10px] font-black border border-white/10 bg-black/40 backdrop-blur-xl text-white uppercase tracking-[0.1em] hover:bg-black/60 transition-all flex items-center gap-2">
          <Edit2 className="w-3.5 h-3.5" /> Edit cover
        </button>
      </div>

      {/* PROFILE HEADER */}
      <div className="max-w-[1240px] mx-auto px-8 relative">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div className="relative inline-block -mt-[70px] mb-4">
            <div className="w-[140px] h-[140px] rounded-[32px] bg-gradient-to-br from-primary to-[#A78BFA] flex items-center justify-center text-5xl font-black text-white border-[6px] border-background shadow-2xl shadow-primary/30 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
              PN
            </div>
            <div className="absolute bottom-4 right-1.5 w-5 h-5 rounded-full bg-primary border-[4px] border-background z-10 shadow-lg" title="Online now" />
            <div className="absolute inset-0 rounded-[32px] bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-all cursor-pointer rotate-[-2deg] hover:rotate-0">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-3 pb-6">
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={cn(
                "px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2.5",
                isFollowing 
                  ? "bg-secondary/50 border border-border text-muted-foreground" 
                  : "bg-primary text-white shadow-[0_10px_30px_-5px_hsla(258,89%,66%,0.4)] hover:scale-105 active:scale-95"
              )}
            >
              {isFollowing ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {isFollowing ? "Following" : "Follow"}
            </button>
            <button className="w-12 h-12 rounded-2xl border border-border bg-card/50 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-2xl border border-border bg-card/50 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="pb-10 border-b border-border">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-black tracking-[-0.04em] flex items-center gap-4 font-jakarta">
              Priya Nair
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black bg-primary/10 border border-primary/20 text-primary uppercase tracking-[0.2em] shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified creator
              </span>
            </h1>
            <p className="font-mono text-sm text-primary font-bold tracking-tight bg-primary/5 self-start px-2 py-0.5 rounded-lg border border-primary/10">
              @priyanair · <span className="text-muted-foreground font-medium">Member since Jan 2026</span>
            </p>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mt-6 leading-relaxed font-bold tracking-tight">
            B2B marketer turned AI prompt engineer. I write prompts that actually work. Tested across <span className="text-primary font-black underline decoration-primary/30 decoration-4 underline-offset-8">200+ campaigns</span>.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-8">
            {["B2B Marketing", "Email", "ChatGPT", "Claude", "Content"].map(tag => (
              <span key={tag} className="px-5 py-2 rounded-xl text-[10px] font-black bg-secondary/80 border border-border text-foreground hover:border-primary/40 hover:bg-primary/[0.03] transition-all cursor-default uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-8 mt-10 text-[13px] font-black text-muted-foreground">
            <span className="flex items-center gap-2.5 hover:text-primary transition-colors cursor-default"><MapPin className="w-4 h-4 text-primary" /> Mumbai, India</span>
            <span className="flex items-center gap-2.5 hover:text-primary transition-colors cursor-default"><ExternalLink className="w-4 h-4 text-primary" /><a href="#" className="underline-offset-4 hover:underline decoration-primary/40">priyanair.in</a></span>
            <span className="flex items-center gap-2.5 tracking-tight">
              <span className="text-foreground">1,204</span> <span className="uppercase text-[10px] tracking-widest text-muted-foreground/60">followers</span> · <span className="text-foreground">89</span> <span className="uppercase text-[10px] tracking-widest text-muted-foreground/60">following</span>
            </span>
            <span className="flex items-center gap-2.5"><Star className="w-4 h-4 text-primary fill-primary" /><span className="text-foreground tracking-tighter text-base">4.9</span> <span className="font-bold text-[10px] uppercase tracking-widest opacity-60">(327 reviews)</span></span>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="sticky top-[64px] z-30 bg-background border-b border-border shadow-sm">
        <div className="max-w-[1240px] mx-auto px-8 flex overflow-x-auto no-scrollbar">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex-1 min-w-[160px] py-6 px-4 text-center transition-all",
                idx < stats.length - 1 && "border-r border-border"
              )}
            >
              <div className="text-3xl font-black font-jakarta tracking-[-0.05em] text-primary">
                {stat.value}
              </div>
              <div className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.15em] mt-1.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-[1240px] mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
        
        {/* LEFT: TABS & PROMPTS */}
        <div className="space-y-8">
          <div className="flex p-1.5 bg-secondary/30 border border-border rounded-[20px] items-center">
            {[
              { id: "published", label: "My Prompts", count: 41 },
              { id: "purchased", label: "Purchased", count: 23 },
              { id: "wishlist", label: "Wishlist", count: 14 },
              { id: "activity", label: "Activity" },
              { id: "reviews", label: "Reviews", count: 327 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-3 px-4 text-[9px] font-black uppercase tracking-[0.15em] transition-all rounded-[14px] flex items-center justify-center gap-2 whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-card text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {tab.label} {tab.count !== undefined && (
                  <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-black font-mono transition-colors", activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-black/5 text-muted-foreground")}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeTab === "published" && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-primary/[0.03] border border-primary/10 rounded-[28px] relative overflow-hidden group">
                    <div className="relative z-10">
                      <p className="text-xl font-black tracking-tight font-jakarta">Scale your impact.</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wide">Your last prompt earned <span className="text-primary font-black">◈ 489</span></p>
                    </div>
                    <button className="relative z-10 px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-[14px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                      + List New Prompt
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Compact Prompt Cards */}
                    {[
                      { title: "Competitor Deep Dive Report", platform: "Claude", sales: 334, rating: 4.9, reviews: 127, price: 55, tags: ["Research"], status: "Live" },
                      { title: "Viral Twitter Thread Framework", platform: "ChatGPT", sales: 112, rating: 4.6, reviews: 32, price: 25, tags: ["Viral"], status: "Live" },
                      { title: "SaaS Cold Email Sequence", platform: "ChatGPT", sales: 89, rating: 4.8, reviews: 45, price: 30, tags: ["B2B"], status: "Live" },
                      { title: "Midjourney Photoreal Portrait", platform: "Midjourney", sales: 245, rating: 4.9, reviews: 88, price: 15, tags: ["Art"], status: "Live" },
                      { title: "SEO Blog Post Architect", platform: "Claude", sales: 156, rating: 4.7, reviews: 54, price: 40, tags: ["Content"], status: "Live" },
                      { title: "Python Script Generator", platform: "ChatGPT", sales: 412, rating: 5.0, reviews: 198, price: 20, tags: ["Code"], status: "Live" },
                    ].map((item, idx) => (
                      <div key={idx} className="glass-card rounded-[28px] overflow-hidden group border-border/80 hover:border-primary/40 transition-all duration-300">
                        <div className="h-36 relative bg-secondary/10 overflow-hidden border-b border-border/40">
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 font-black">
                            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg border border-border/40">
                               <Star className="w-2.5 h-2.5 text-primary fill-primary" />
                               <span className="text-[9px] text-foreground">{item.rating}</span>
                            </div>
                            <span className="text-[8px] text-primary uppercase tracking-widest">{item.status}</span>
                          </div>

                          <div className="p-6 pt-12 font-mono text-[8px] leading-[1.6] text-muted-foreground/30">
                             <div className="w-full h-1.5 bg-primary/5 rounded-full mb-2" />
                             <div className="w-[80%] h-1.5 bg-primary/5 rounded-full mb-2" />
                             <p className="line-clamp-2 mt-4">Encryption layer active. Reasoning engine: {item.platform} Engine X</p>
                          </div>
                        </div>

                        <div className="p-5 space-y-3.5">
                           <div className="flex gap-1.5">
                             <span className="text-[8px] px-2 py-0.5 rounded-lg bg-primary/5 text-primary font-black uppercase border border-primary/10">{item.platform}</span>
                             <span className="text-[8px] px-2 py-0.5 rounded-lg bg-secondary text-muted-foreground font-black uppercase border border-border">{item.tags[0]}</span>
                           </div>
                           <h3 className="text-sm font-black tracking-tight leading-[1.4] font-jakarta line-clamp-2">
                             {item.title}
                           </h3>
                           <div className="flex items-center justify-between pt-4 border-t border-border/40">
                             <div className="flex flex-col">
                               <span className="text-[8px] text-muted-foreground font-black uppercase opacity-60">Sales</span>
                               <span className="text-[11px] text-primary font-black font-mono tracking-tighter">{item.sales}</span>
                             </div>
                             <div className="flex items-center gap-1">
                               <span className="text-[8px] text-muted-foreground font-black uppercase opacity-60">Listing Price</span>
                               <span className="text-lg font-black text-primary font-mono tracking-tighter leading-none">◈ {item.price}</span>
                             </div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-1.5 pt-8">
                    {[1, 2, 3, "...", 7].map((page, i) => (
                      <button 
                        key={i}
                        className={cn(
                          "w-10 h-10 rounded-xl transition-all font-black text-[10px] flex items-center justify-center",
                          page === 1 
                            ? "bg-primary text-white shadow-sm" 
                            : page === "..." 
                              ? "text-muted-foreground cursor-default" 
                              : "bg-secondary/30 border border-border text-muted-foreground hover:text-primary hover:bg-primary/5"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: PREMIUM WIDGETS */}
        <aside className="space-y-8 lg:sticky lg:top-[180px]">
          
          {/* Coin Wallet Widget */}
          <div className="bg-card border border-border rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-primary/20 transition-colors duration-1000" />
            <div className="relative z-10">
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6">Wallet Balance</h2>
              <div className="flex items-center gap-5 p-6 bg-background rounded-[28px] mb-6 border border-border/80 group-hover:border-primary/50 transition-all scale-100 group-hover:scale-[1.02] shadow-sm">
                <div className="text-4xl font-black text-primary drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">◈</div>
                <div>
                  <div className="text-4xl font-black font-jakarta tracking-[-0.05em] leading-none">240</div>
                  <div className="text-[10px] text-muted-foreground font-black mt-2 uppercase tracking-widest opacity-60">Vault Credits</div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                 <button className="w-full py-4 rounded-[20px] bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:translate-y-0 transition-all">
                   Add Credits
                 </button>
                 <button className="w-full py-4 rounded-[20px] bg-secondary border border-border text-muted-foreground font-black text-[10px] uppercase tracking-[0.1em] hover:text-primary transition-all flex items-center justify-center gap-3">
                   <History className="w-4 h-4" /> Transaction Log
                 </button>
              </div>
            </div>
          </div>

          {/* Earnings Analytics */}
          <div className="bg-card border border-border rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
             <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6">Revenue Analytics</h2>
             <div className="text-center py-8 bg-background rounded-[28px] mb-6 border border-border/80 group-hover:border-primary/20 transition-all shadow-sm">
               <div className="text-primary text-5xl font-black font-jakarta tracking-[-0.05em] leading-none drop-shadow-[0_0_20px_rgba(139,92,246,0.2)]">◈ 2,840</div>
               <div className="text-[10px] text-muted-foreground mt-3 font-black uppercase tracking-widest opacity-60">Total Revenue Generated</div>
             </div>
             <div className="space-y-4">
                {[
                  { lbl: "Revenue this month", val: "◈ 489", color: "text-primary" },
                  { lbl: "Top Performing Asset", val: "◈ 1,350", color: "text-primary" },
                  { lbl: "Settled Balance", val: "◈ 1,220", color: "text-muted-foreground" },
                ].map(row => (
                  <div key={row.lbl} className="flex justify-between items-center border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <span className="text-muted-foreground uppercase tracking-tight font-black text-[9px] opacity-70">{row.lbl}</span>
                    <span className={cn("font-mono font-black text-sm tracking-tighter", row.color)}>{row.val}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-card border border-border rounded-[40px] p-8 shadow-2xl">
             <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6">Creator Authority</h2>
             <div className="flex items-center gap-5 mb-8">
                <span className="text-3xl font-black font-jakarta text-primary">78%</span>
                <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden shadow-inner">
                   <div className="h-full bg-primary shadow-[0_0_15px_var(--accent-primary)] transition-all duration-1000 ease-out" style={{ width: "78%" }} />
                </div>
             </div>
             <div className="space-y-4">
                {[
                  { label: "Profile Identity Verified", done: true },
                  { label: "Marketplace Expert Bio", done: true },
                  { label: "5+ Active Marketplace Listings", done: true },
                  { label: "First sale made", done: true },
                  { label: "Email verified", done: true },
                  { label: "Add website link", done: false },
                  { label: "Connect X account", done: false },
                  { label: "10+ reviews received", done: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tight">
                    <div className={cn("w-6 h-6 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500", item.done ? "bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/10" : "bg-black/5 border-border text-muted-foreground/30")}>
                      {item.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                    <span className={item.done ? "text-foreground" : "text-muted-foreground/50"}>{item.label}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* My Platforms */}
          <div className="bg-card border border-border rounded-[40px] p-8 shadow-2xl">
             <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6">My Platforms</h2>
             <div className="space-y-3">
                {platforms.map(p => (
                  <div key={p.name} className="flex items-center justify-between p-4 bg-secondary/40 rounded-2xl border border-border group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs font-black uppercase tracking-tighter text-foreground">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground group-hover:text-primary transition-colors">{p.count}</span>
                  </div>
                ))}
             </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
