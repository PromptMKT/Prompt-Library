"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Star, 
  MessageCircle, 
  Share2, 
  Globe, 
  Twitter, 
  Github, 
  Zap, 
  Search, 
  MapPin, 
  Link as LinkIcon,
  Users,
  DollarSign,
  TrendingUp,
  Layout,
  ShoppingCart,
  Heart,
  Activity as ActivityIcon,
  Award,
  Wallet,
  CheckCircle2,
  Clock,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Camera,
  Plus,
  Coins,
  History,
  Check,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type TabType = "published" | "purchased" | "wishlist" | "activity" | "reviews";

export default function SellerProfilePage({ params: paramsPromise }: { params: Promise<{ username: string }> }) {
  const params = React.use(paramsPromise);
  const { theme } = useTheme();
  
  const [user, setUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sellerPrompts, setSellerPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("published");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // DEMO MODE: Hardcoded dummy data as per user's HTML
    const dummyUser = {
      username: "priyanair",
      name: "Priya Nair",
      avatar: null,
      bio: "B2B marketer turned AI prompt engineer. I write prompts that actually work for real sales teams — tested across 200+ client campaigns.",
      coins: 240,
      followers: 1204,
      following: 89,
      verified: true,
      location: "Mumbai, India",
      website: "priyanair.in",
      avgRating: 4.9,
      memberSince: "Jan 2026"
    };
    
    const dummyPrompts = [
      { id: "1", title: "Cold Email that Converts — B2B Framework", price: 30, sales: 489, platform: "ChatGPT", category: "Email", reviewsCount: 127, rating: 4.9, status: "live", trending: true, promptText: "Act as a B2B sales expert and write a sequence..." },
      { id: "2", title: "LinkedIn Post Engine", price: 22, sales: 334, platform: "ChatGPT", category: "LinkedIn", reviewsCount: 112, rating: 4.7, status: "live", trending: false, promptText: "Generate 10 LinkedIn post ideas for SaaS founders..." },
      { id: "3", title: "Food Photography Hero", price: 32, sales: 112, platform: "FLUX", category: "Food", reviewsCount: 38, rating: 4.6, status: "live", trending: false, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=150&fit=crop&auto=format" },
      { id: "4", title: "SEO Blog Post Architect", price: 28, sales: 0, platform: "ChatGPT", category: "SEO", reviewsCount: 0, rating: 0, status: "draft", trending: false, promptText: "SEO-optimised blog post framework for [TOPIC]..." },
      { id: "5", title: "Competitor Deep Dive Report", price: 55, sales: 0, platform: "Claude", category: "Research", reviewsCount: 0, rating: 0, status: "review", trending: false, promptText: "You are a market research analyst for [INDUSTRY]..." },
      { id: "6", title: "Viral Twitter Thread Framework", price: 25, sales: 445, platform: "ChatGPT", category: "Twitter", reviewsCount: 201, rating: 4.6, status: "live", trending: true },
    ];

    setUser(dummyUser);
    setCurrentUser(dummyUser); // Make it look like 'my profile' for demo
    setSellerPrompts(dummyPrompts);
    setLoading(false);
  }, [params.username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!user) return notFound();

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    toast(isFollowing ? "Unfollowed" : `✓ Following ${user.name}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("✓ Prompt copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 transition-colors duration-300">
      <style jsx global>{`
        :root {
          --violet: #7C3AED;
          --violet2: #8B5CF6;
          --violet3: #A78BFA;
          --border: rgba(124, 58, 237, 0.13);
          --border2: rgba(139, 92, 246, 0.22);
          --muted: #9B8EC4;
          --surface: #181824;
          --s2: #1E1E2E;
          --amber: #e8a838;
          --success: #22d3ee;
          --danger: #F87171;
        }

        .dark {
          --bg: #0B0B0F;
          --surface: #181824;
          --s2: #1E1E2E;
          --text: #F0EEFF;
          --border: rgba(124, 58, 237, 0.13);
          --border2: rgba(139, 92, 246, 0.22);
        }

        .light {
          --bg: #F5F7FB;
          --surface: #FFFFFF;
          --s2: #EEF0FA;
          --text: #1A0B3B;
          --muted: #6B5B9A;
          --border: rgba(124, 58, 237, 0.1);
          --border2: rgba(124, 58, 237, 0.18);
        }

        .pcard-prompt-bg::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 24px;
          background: linear-gradient(transparent, var(--surface));
          pointer-events: none;
        }
      `}</style>

      {/* ── COVER BANNER ── */}
      <div className="h-[200px] relative overflow-hidden bg-gradient-to-br from-[#0d0420] via-[#1a0b3b] to-[#0d1f3c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(124,58,237,0.25),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.1),transparent_40%)]" />
        <button 
          className="absolute top-[14px] right-[14px] py-[6px] px-[14px] rounded-[20px] text-[11px] font-semibold border border-white/15 bg-black/30 backdrop-blur-[8px] text-white/80 hover:bg-black/50 hover:text-white transition-all flex items-center gap-[5px] z-20"
          onClick={() => toast("Cover editor coming soon")}
        >
          <Edit className="w-3 h-3" /> Edit cover
        </button>
      </div>

      {/* ── PROFILE HEADER ── */}
      <div className="max-w-[1200px] mx-auto px-7 relative">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="relative mt-[-56px] mb-4">
            <div className="w-[108px] h-[108px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-[36px] font-black tracking-[-0.04em] text-white border-[4px] border-background shadow-[0_0_0_1px_var(--border2)] relative z-10 overflow-hidden">
               PN
               <div 
                 className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-[11] text-[10px] font-black text-white uppercase tracking-widest"
                 onClick={() => toast("Photo updated!")}
               >
                  <Camera className="w-4 h-4 mr-1" /> Change
               </div>
            </div>
            <div className="absolute bottom-2 right-1 w-4 h-4 bg-[#22d3ee] border-[3px] border-background rounded-full z-20" title="Online now" />
          </div>
          
          <div className="flex items-center gap-2 pb-3">
            <button 
              className={cn(
                "py-[9px] px-[22px] rounded-[2rem] text-[13px] font-bold transition-all shadow-[0_2px_12px_rgba(124,58,237,0.3)]",
                isFollowing ? "bg-secondary border border-border2 text-muted-foreground shadow-none" : "bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] text-white hover:opacity-90 active:scale-95"
              )}
              onClick={toggleFollow}
            >
              {isFollowing ? "✓ Following" : "+ Follow"}
            </button>
            <button className="py-[9px] px-[18px] rounded-[2rem] text-[13px] font-semibold border border-border2 bg-transparent text-muted-foreground hover:border-[#8B5CF6] hover:text-foreground transition-all" onClick={() => toast("Message feature coming soon")}>
              ✉ Message
            </button>
            <button className="w-[36px] h-[36px] rounded-full border border-border2 bg-transparent flex items-center justify-center text-muted-foreground hover:border-[#8B5CF6] hover:text-foreground transition-all" onClick={() => { copyToClipboard(window.location.href); toast("Link copied!"); }}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pb-5 border-b border-border transition-colors">
          <div className="space-y-1">
            <div className="text-xl font-black tracking-[-0.08em] flex items-center gap-1">
              <span className="text-primary uppercase">Prompt</span><span className="text-foreground uppercase italic tracking-normal">X</span>
            </div>
            <p className="text-[12px] text-muted-foreground font-black uppercase tracking-widest">@{user.username} <span className="mx-2 opacity-30">|</span> MEMBER SINCE {user.memberSince.toUpperCase()}</p>
          </div>
          <p className="text-[14px] text-foreground/80 font-bold max-w-[620px] leading-[1.6] my-4">
            {user.bio}
          </p>
          <div className="flex flex-wrap gap-2 mb-4 mt-2">
            {["B2B Marketing", "Email", "ChatGPT", "Claude", "Content"].map(tag => (
              <span key={tag} className="py-1.5 px-[14px] rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary/80">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary/60" /> {user.location}</span>
            <span className="flex items-center gap-2"><LinkIcon className="w-3.5 h-3.5 text-primary/60" /> <a href="#" className="text-primary hover:underline">{user.website}</a></span>
            <span className="flex items-center gap-2 underline underline-offset-4 decoration-primary/30"><strong className="text-foreground">{user.followers}</strong> followers <span className="opacity-30">/</span> <strong className="text-foreground">{user.following}</strong> following</span>
            <span className="flex items-center gap-2"><Star className="w-3.5 h-3.5 fill-amber text-amber" /> <strong className="text-foreground">{user.avgRating}</strong> AVG RATING</span>
          </div>
        </div>
      </div>

      {/* ── STATS ROW (Standardized Fonts) ── */}
      <div className="flex flex-wrap border-b border-border max-w-[1400px] mx-auto px-7">
        {[
          { label: "Prompts published", value: 41, id: 'published', color: "text-primary" },
          { label: "Total purchases", value: 128, id: 'purchased', color: "text-primary" },
          { label: "Total sales made", value: "1,847", color: "text-primary" },
          { label: "Total earned", value: `2,840`, color: "text-primary" },
          { label: "Verified reviews", value: 327, id: 'reviews', color: "text-primary" },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="flex-1 min-w-[150px] py-6 px-5 text-center cursor-pointer hover:bg-primary/5 transition-all duration-300 border-r border-border last:border-r-0 group"
            onClick={() => stat.id && setActiveTab(stat.id as TabType)}
          >
            <div className={cn("text-3xl font-black tracking-tighter mb-1 transition-transform group-hover:scale-110 duration-500", stat.color)}>
              {i === 3 && <span className="text-xl mr-1 opacity-50 select-none">◈</span>}
              {stat.value}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT (Two Columns) ── */}
      <div className="max-w-[1400px] mx-auto p-7 pb-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          
          {/* LEFT: TABS + CONTENT */}
          <div className="space-y-6">
            {/* Tab bar */}
            <div className="flex border border-border rounded-2xl overflow-hidden bg-surface shadow-sm sticky top-24 z-30 transition-all">
              {[
                { id: "published", label: "My Prompts", count: 41 },
                { id: "purchased", label: "Purchased", count: 23 },
                { id: "wishlist", label: "Wishlist", count: 14 },
                { id: "activity", label: "Activity" },
                { id: "reviews", label: "Reviews", count: 327 },
              ].map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    "flex-1 py-3 px-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer transition-all text-center flex items-center justify-center gap-2 border-r border-border last:border-r-0 hover:text-foreground hover:bg-secondary/30",
                    activeTab === tab.id && "bg-primary/5 border-b-2 border-b-primary text-primary"
                  )}
                >
                  {tab.label} {tab.count !== undefined && <span className="py-[1px] px-2 rounded-full text-[10px] bg-primary/10 border border-primary/20 text-primary font-mono">{tab.count}</span>}
                </div>
              ))}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "published" && (
                  <motion.div key="published" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-6">
                    <div className="filter-bar flex flex-wrap items-center gap-2">
                      {["All", "Live", "Draft", "Under review"].map((filter, i) => (
                        <span key={i} className={cn("py-[6px] px-4 rounded-full text-[10px] font-black uppercase tracking-widest border border-border2 cursor-pointer transition-all", i === 0 ? "bg-primary text-white border-primary" : "text-muted-foreground hover:text-foreground hover:border-primary/40")}>{filter}</span>
                      ))}
                      <select className="ml-auto p-2 px-4 rounded-xl border border-border2 bg-transparent text-foreground text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                        <option>Sort: Top selling</option>
                        <option>Sort: Newest</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/10 rounded-2xl shadow-sm">
                      <div className="space-y-1">
                        <div className="text-sm font-black uppercase tracking-tight text-foreground">Ready to list a new prompt?</div>
                        <div className="text-[11px] text-muted-foreground font-semibold">Your last prompt made <span className="text-primary font-black">₹ 489</span> in its first week</div>
                      </div>
                      <button className="py-3 px-8 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all" onClick={() => toast("Opening prompt editor...")}>
                        + New prompt
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm font-black uppercase tracking-[0.14em] text-foreground/80">Published Prompts</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary cursor-pointer hover:underline" onClick={() => toast("Bulk actions enabled")}>Select all</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {sellerPrompts.map(p => (
                        <div 
                          key={p.id} 
                          className="group bg-surface border border-border rounded-2xl overflow-hidden hover:translate-y-[-4px] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer flex flex-col"
                        >
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
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 pt-10">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-[11px] font-black uppercase tracking-[0.12em] shadow-lg shadow-primary/20">1</div>
                      {[2, 3, "...", 7].map((num, i) => (
                        <div key={i} className="w-10 h-10 rounded-xl border border-border hover:bg-secondary flex items-center justify-center text-[11px] text-muted-foreground font-black cursor-pointer transition-all">{num}</div>
                      ))}
                      <div className="w-10 h-10 rounded-xl border border-border hover:bg-secondary flex items-center justify-center text-muted-foreground cursor-pointer transition-all"><ChevronRightIcon className="w-4 h-4" /></div>
                    </div>
                  </motion.div>
                )}
                
                {/* ... other tabs would go here ... */}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: SIDEBAR (Premium Designed) */}
          <aside className="space-y-6">
            
            {/* Coin Wallet Widget (Updated to match reference) */}
            <div className="bg-white border-2 border-[#f1f1ff] rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#1a1b25]">Coin Wallet</h4>
                <div className="w-10 h-10 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-primary border border-primary/5 transition-transform group-hover:rotate-12">
                   <Wallet className="w-5 h-5" />
                </div>
              </div>
              
              <div className="space-y-10">
                <div className="text-left">
                  <div className="flex items-center gap-3 text-5xl font-black tracking-tighter text-[#1a1b25] mb-2 leading-none">
                    <span className="text-3xl text-primary/40 select-none">◈</span>
                    240
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1b25] flex items-center gap-1.5">
                    <span className="opacity-60 text-[13px]">≈</span> ₹ 214 available
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link href="/wallet" className="flex-1">
                    <button className="w-full h-14 rounded-2xl bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-primary/20">
                      + Top up
                    </button>
                  </Link>
                  <Link href="/wallet" className="flex-1">
                    <button className="w-full h-14 rounded-2xl bg-[#f8f9ff] border-2 border-[#f1f1ff] text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1b25] transition-all hover:bg-white hover:border-primary/20">
                      History
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Earnings Overview */}
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm hover:border-primary/20 transition-all">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Earnings Overview</h4>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-secondary/40 border border-border text-center">
                  <div className="flex items-center justify-center gap-3 text-3xl font-black tracking-tighter text-foreground mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber/20 flex items-center justify-center text-amber text-lg">◈</div>
                    2,840
                  </div>
                  <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">Total Earned · <span className="text-foreground">≈ ₹ 2,528</span></div>
                </div>
                
                <div className="space-y-4">
                   {[
                     { label: "This month", value: "489", color: "text-primary" },
                     { label: "Last month", value: "612", color: "text-foreground" },
                     { label: "Best prompt", value: "1,350", color: "text-amber" },
                     { label: "Pending", value: "81", color: "text-muted-foreground" },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest group">
                       <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                       <div className="flex items-center gap-1.5">
                         <span className={cn("text-[9px] font-black", item.color)}>◈</span>
                         <span className={cn("font-black text-[13px] tracking-tight", item.color)}>{item.value}</span>
                       </div>
                     </div>
                   ))}
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-muted-foreground">Withdrawal</span>
                  <span className="text-primary italic opacity-60">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Profile Strength */}
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm hover:border-primary/20 transition-all">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Profile Strength</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex items-end justify-between font-black mb-2">
                    <span className="text-2xl tracking-tighter text-primary">78%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '78%' }} />
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Profile photo", done: true },
                    { label: "Bio written", done: true },
                    { label: "5+ prompts published", done: true },
                    { label: "First sale made", done: true },
                    { label: "Email verified", done: true },
                    { label: "Add website link", done: false },
                    { label: "Connect X account", done: false },
                    { label: "10+ reviews received", done: false },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 text-[11px] font-semibold tracking-tight">
                      <div className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-colors",
                        task.done ? "bg-success border-success text-white" : "border-border text-transparent"
                      )}>
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className={task.done ? "text-foreground" : "text-muted-foreground"}>{task.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* My Platforms */}
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm hover:border-primary/20 transition-all">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">My Platforms</h4>
              <div className="space-y-2">
                {[
                  { name: "ChatGPT", count: 18, color: "bg-[#10a37f]" },
                  { name: "Claude", count: 12, color: "bg-[#7C3AED]" },
                  { name: "FLUX", count: 7, color: "bg-[#8B5CF6]" },
                  { name: "Midjourney", count: 4, color: "bg-[#fb923c]" },
                ].map((plat, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-secondary/30 border border-transparent hover:border-primary/20 hover:bg-secondary/50 transition-all flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", plat.color)} />
                      <span className="text-[12px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">{plat.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground">{plat.count} <span className="opacity-60">prompts</span></span>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
