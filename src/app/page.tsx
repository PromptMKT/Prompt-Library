"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, ImageIcon, Video, Code, Search, Star,
  MessageSquare, Heart, Eye, Layers, Camera, PenTool,
  LayoutTemplate, Briefcase, ChevronRight, Play, Sparkles,
  Flame, TrendingUp, Zap, Globe, ArrowRight, BadgeCheck, Share2
} from "lucide-react";

import { PromptService } from "@/lib/services/PromptService";
import { ExplorePromptCard } from "@/app/explore/components/ExplorePromptCard";
import { supabase } from "@/lib/supabase";

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────







const platforms = [
  { name: "ChatGPT",    icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg", padding: "p-5 md:p-7" },
  { name: "Midjourney", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png", padding: "p-3.5 md:p-5" },
  { name: "Anthropic",  icon: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg", padding: "p-[18px] md:p-[30px]" },
  { name: "Gemini",     icon: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg", padding: "p-[18px] md:p-[28px]" },
  { name: "Meta",       icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", padding: "p-5 md:p-8" },
  { name: "GitHub",     icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg", padding: "p-[22px] md:p-[32px]" },
  { name: "Notion",     icon: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg", padding: "p-6 md:p-10" },
  { name: "HuggingFace",icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg", padding: "p-[18px] md:p-[26px]" },
];

const trendingGroups = [
  { label: "Daily Hacks",       icon: <Zap className="w-3.5 h-3.5" /> },
  { label: "Image Generation",  icon: <ImageIcon className="w-3.5 h-3.5" /> },
  { label: "Video Generation",  icon: <Video className="w-3.5 h-3.5" /> },
  { label: "Persona",           icon: <Camera className="w-3.5 h-3.5" /> },
  { label: "Agents",            icon: <Globe className="w-3.5 h-3.5" /> },
];



const professions = [
  { title: "CONTENT\nCREATORS",             emoji: "🤳" },
  { title: "FOUNDERS &\nENTREPRENEURS",     emoji: "👔" },
  { title: "DESIGNERS",                     emoji: "🎨" },
  { title: "LEGAL\nPROFESSIONALS",          emoji: "⚖️" },
  { title: "WEBSITE\nDEVELOPERS",           emoji: "💻" },
  { title: "MARKETERS &\nAGENCIES",         emoji: "📈" },
];

const guides = [
  { title: "LinkedIn Hacks",      tag: "🔗 LinkedIn",  seeds: ["park", "city", "bridge", "office"] },
  { title: "SEO Hacks",           tag: "🔍 SEO",       seeds: ["mountain", "forest", "river", "road"] },
  { title: "Startup Ideas Hacks", tag: "💡 Startup",   seeds: ["aurora", "desert", "coast", "lake"] },
];



// ─── HELPERS ──────────────────────────────────────────────────────────────────

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} className={cn("w-3 h-3", s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
    ))}
    <span className="text-[10px] font-black text-muted-foreground ml-1">{rating}</span>
  </div>
);

const SectionHeader = ({ title, sub, more = true, href = "/explore" }: { title: string; sub?: string; more?: boolean; href?: string }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <h2 className="heading-h2">{title}</h2>
      {sub && <p className="body-xs tracking-widest mt-2">{sub}</p>}
    </div>
    {more && (
      <Link href={href}>
        <button className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
          See all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    )}
  </div>
);


const WishlistButton = ({ promptId }: { promptId: string }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = isWishlisted;
    setIsWishlisted(!prev);
    try {
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId })
      });
      const res = await response.json();
      if (!res.success) {
        setIsWishlisted(prev);
      } else {
        setIsWishlisted(res.wishlisted ?? !prev);
      }
    } catch {
      setIsWishlisted(prev);
    }
  };
  return (
    <button onClick={handleToggle} className={cn("w-8 h-8 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors shadow-sm z-[50]", isWishlisted ? "bg-rose-500/20 text-rose-400 border-rose-400/50" : "bg-black/40 text-white hover:text-rose-400 hover:border-rose-400/50")}>
      <Heart className={cn("w-4 h-4", isWishlisted && "fill-rose-400")} />
    </button>
  );
};

const ActionStrip = ({ promptId }: { promptId: string }) => (
  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-6 group-hover:translate-x-0 z-30 duration-200">
    <button className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition-colors shadow-sm">
      <Eye className="w-4 h-4" />
    </button>
    <WishlistButton promptId={promptId} />
    <button className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:text-blue-400 hover:border-blue-400/50 transition-colors shadow-sm">
      <Share2 className="w-4 h-4" />
    </button>
  </div>
);

// Portrait card (9:16)
const PortraitCard = ({ id, image, badge, title, price, rating, author, href }: { id: string; image: string; badge?: string; title?: string; price?: number; rating?: number; author?: string; href: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass-card group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 flex flex-col w-full max-w-80 min-h-107.5"
    onClick={() => { window.location.href = href; }}
  >
    <div className="aspect-[9/16] relative overflow-hidden">
      <img src={image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <ActionStrip promptId={id} />
      {badge && (
        <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-md text-white border border-white/10">
          {badge}
        </span>
      )}
      {(title || price) && (
        <div className="absolute bottom-3 left-3 right-3">
          {title && <div className="text-[11px] font-black text-white line-clamp-2 leading-snug mb-1">{title}</div>}
          {price && <div className="text-sm font-black text-primary">${price}</div>}
        </div>
      )}
    </div>
    {author && (
      <div className="px-4 py-3 flex items-center gap-2">
        <img src={`https://i.pravatar.cc/32?u=${author}`} className="w-6 h-6 rounded-full" alt="" />
        <span className="text-[10px] font-bold text-muted-foreground">{author}</span>
        {rating && <Stars rating={rating} />}
      </div>
    )}
  </motion.div>
);

// Full standard prompt card
const PromptCard = ({ p, href }: { p: any; href: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -6 }}
    className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200/80 bg-white transition-colors duration-300 flex flex-col shadow-sm hover:shadow-xl hover:shadow-purple-500/10 h-full w-full max-w-80 min-h-107.5"
    onClick={() => { window.location.href = href; }}
  >
    <div className="h-62.5 w-full relative overflow-hidden shrink-0 bg-slate-100">
      <img src={p.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <ActionStrip promptId={p.id} />
      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-md text-white border border-white/10">
        {p.platform}
      </span>
    </div>
    <div className="p-4 space-y-3">
      <div className="card-title text-foreground line-clamp-2">{p.title}</div>
      <Stars rating={p.rating} />
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <img src={`https://i.pravatar.cc/32?u=${p.author}`} className="w-6 h-6 rounded-full" alt="" />
          <span className="text-[10px] font-bold text-muted-foreground">{p.author}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-black text-primary">${p.price}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Shared fixed-size card for Image Transformation, Instagram, and YouTube sections
const SectionCard200 = ({ p, href, category1, category2, imageOnly = false }: { p: any; href: string; category1: string; category2: string; imageOnly?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4 }}
    className="w-full"
    onClick={() => { window.location.href = href; }}
  >
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:border-primary transition-all relative group h-full">
      {imageOnly ? (
        <div className="h-[430px] w-full relative overflow-hidden bg-secondary">
          <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          
          {/* Top-Left Platform Badge */}
          <span className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-md z-10 transition-transform duration-300 group-hover:translate-x-1">
            {p.platform}
          </span>

          <ActionStrip promptId={p.id} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Hover Content Section (Bottom 15%) */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/20 backdrop-blur-xl border-t border-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex items-center justify-between shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-white/90 tracking-wider">RATING</span>
              <div className="flex items-center gap-1">
                <span className="text-white text-[10px] tracking-tight">★★★★★</span>
                <span className="text-[11px] font-bold text-white">{p.rating.toFixed(1)}</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/40 shadow-xl transition-all active:scale-95">
              Buy Now ◈ {p.price}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r z-10 from-primary via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="h-[200px] relative overflow-hidden bg-secondary">
            <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold border border-white/20 bg-black/40 text-white backdrop-blur-md z-10">
              {p.platform}
            </div>
            <ActionStrip promptId={p.id} />
          </div>
          <div className="p-4 flex flex-col h-full bg-white">
            <div className="flex gap-1.5 flex-wrap mb-2">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-border text-primary font-mono">{category1}</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-border text-primary font-mono">{category2}</span>
            </div>
            <div className="text-sm font-bold text-foreground leading-snug mb-3 line-clamp-2 min-h-[2.75rem]">{p.title}</div>
            <div className="flex items-center gap-1.5 mb-3 text-[11px]">
              <span className="text-primary tracking-widest">★★★★★</span>
              <span className="font-mono font-bold text-foreground">{p.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
              <div 
                className="flex items-center gap-2 flex-1 cursor-pointer hover:opacity-80 transition-opacity z-20"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/u/${p.author}`; }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[8px] font-bold text-white shrink-0 uppercase">
                  {p.author.charAt(0)}
                </div>
                <div className="text-[11px] text-muted-foreground truncate hover:text-primary transition-colors">{p.author}</div>
              </div>
              <div className="text-sm font-bold font-mono text-primary">◈ {p.price}</div>
            </div>
          </div>
        </>
      )}
    </div>
  </motion.div>
);

// Stacked batch card
const BatchCard = ({ title, img, href }: { title: string; img: string; href: string }) => (
  <motion.div whileHover={{ y: -6 }} className="relative group cursor-pointer w-full max-w-80 min-h-107.5" onClick={() => { window.location.href = href; }}>
    <div className="absolute inset-0 bg-card border border-border rounded-3xl -rotate-3 scale-95 opacity-40 shadow-sm" />
    <div className="absolute inset-0 bg-card border border-border rounded-3xl -rotate-1 scale-[0.97] opacity-60 shadow-sm" />
    <div className="glass-card relative bg-card border border-border/60 hover:border-primary rounded-3xl overflow-hidden shadow-sm transition-all hover:shadow-2xl hover:shadow-primary/20">
      <div className="aspect-square relative overflow-hidden">
        <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute bottom-3 left-3 right-3 text-[11px] font-black uppercase tracking-widest text-white leading-tight">{title}</span>
      </div>
    </div>
  </motion.div>
);

// Trending mini card
const TrendingCard = ({ seed, idx, href, title, price }: { seed: string; idx: number; href: string; title?: string; price?: number }) => (
  <motion.div whileHover={{ y: -4, scale: 1.03 }} className="glass-card w-28 shrink-0 bg-card border border-border/60 hover:border-primary rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-primary/20 transition-all" onClick={() => { window.location.href = href; }}>
    <div className="aspect-square overflow-hidden relative">
      <img src={`https://picsum.photos/seed/${seed}-${idx}/200`} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    </div>
    <div className="p-2">
      <div className="text-[9px] font-black text-foreground truncate">{title || `Prompt #${idx+1}`}</div>
      <div className="text-[8px] text-muted-foreground font-bold mt-0.5">◈ {price || 12 + idx}</div>
    </div>
  </motion.div>
);

// Contributor profile card
const ProfileCard = ({ c, href }: { c: any; href: string }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="glass-card w-60 shrink-0 bg-card border border-border/60 hover:border-primary rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer"
    onClick={() => { window.location.href = href; }}
  >
    <div className="h-20 bg-gradient-to-br from-primary/80 to-violet-600/80 relative overflow-hidden">
      <img src={`https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80&seed=${c.seed}`} className="w-full h-full object-cover opacity-30 mix-blend-overlay" alt="" />
      <button className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur text-[9px] font-black text-primary rounded-full flex items-center gap-1 shadow-lg hover:scale-105 transition-transform">
        Follow <Plus className="w-2.5 h-2.5" />
      </button>
    </div>
    <div className="px-5 pb-5 relative">
      <div className="absolute -top-7 left-5 w-14 h-14 rounded-full border-4 border-card bg-card overflow-hidden shadow-lg z-10">
        <img src={`https://i.pravatar.cc/150?u=${c.seed}`} className="w-full h-full object-cover relative z-10" alt="" />
      </div>
      <div className="pt-1 mb-3 ml-[64px]">
        <div className="flex items-center gap-1.5 mb-1 text-left">
          <h4 className="text-sm font-black text-foreground tracking-tight line-clamp-1">{c.name}</h4>
          <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
        </div>
        <p className="text-[10px] text-muted-foreground font-medium leading-snug text-left truncate">{c.role}</p>
      </div>
      <div className="flex items-center gap-2 mb-4 bg-secondary/60 rounded-xl px-3 py-2">
        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">EXP</span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden flex">
          {["bg-blue-500","bg-emerald-400","bg-yellow-400","bg-orange-400","bg-rose-500"].map((c,i) => (
            <div key={i} className={cn("flex-1", c)} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border border-t border-border pt-4">
        {[
          { label: "Likes",  value: c.likes,  Icon: Heart },
          { label: "Posts",  value: c.posts,  Icon: MessageSquare },
          { label: "Views",  value: c.views,  Icon: Eye },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="flex flex-col items-center gap-1 py-1 group/stat">
            <span className="text-[11px] font-black text-foreground">{value}</span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
            <Icon className="w-3 h-3 text-muted-foreground/40 group-hover/stat:text-primary transition-colors" />
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Favorite Card (Specific to Most Liked section matching User requirements)
const FavoriteCard = ({ p, href }: { p: any; href: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl overflow-hidden border border-slate-200/80 hover:border-purple-500 transition-colors duration-300 flex flex-col group cursor-pointer shadow-sm hover:shadow-xl hover:shadow-purple-500/10 h-full w-full max-w-80 min-h-107.5"
    onClick={() => { window.location.href = href; }}
  >
    <div className="h-62.5 w-full relative overflow-hidden shrink-0 bg-slate-100">
      <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
      
      {/* Top-Left Platform Badge */}
      <span className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-md z-10">
        {p.platform}
      </span>

      {/* Hover Action Icons (Eye, Heart, Share) - Slide in ONLY on hover */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-6 group-hover:translate-x-0 z-30 duration-200">
        <button className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition-colors shadow-sm">
          <Eye className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:text-rose-400 hover:border-rose-400/50 transition-colors shadow-sm">
          <Heart className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:text-blue-400 hover:border-blue-400/50 transition-colors shadow-sm">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    {/* ── CONTENT SECTION ── */}
    <div className="p-3 flex flex-col h-full bg-white relative">
      <div className="flex items-center gap-1.5 mb-1.5 text-[10px]">
        <span className="text-purple-600 tracking-widest">★★★★★</span>
        <span className="font-mono font-bold text-slate-900">{p.rating}</span>
      </div>
      
      <div className="text-xs font-bold leading-snug text-slate-900 mb-2 line-clamp-2">
        {p.title}
      </div>
      
      <div className="flex gap-1.5 flex-wrap mb-3">
        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-50 border border-purple-100/50 text-purple-600 font-bold">
          Architecture
        </span>
        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-50 border border-purple-100/50 text-purple-600 font-bold">
          System Design
        </span>
      </div>
      
      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 mt-auto">
        <div 
          className="flex items-center gap-1.5 flex-1 cursor-pointer hover:opacity-80 transition-opacity z-20"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/u/${p.author}`; }}
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[7px] font-bold text-white shadow-sm shrink-0 uppercase">
            {p.author.charAt(0)}
          </div>
          <div className="text-[10px] font-medium text-slate-700 truncate hover:text-purple-600 transition-colors">
            {p.author}
          </div>
        </div>
        <div className="text-xs font-bold font-mono text-purple-600">
          ◈ {p.price}
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [dbPrompts, setDbPrompts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const homePrompts = await PromptService.getAllPrompts(200);
        if (homePrompts) {
          const remappedPrompts = homePrompts.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price || 0,
            image: p.cover_image_url || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80',
            rating: p.average_rating || 5.0,
            author: p.users?.username || 'Creator',
            authorId: p.creator_id,
            authorAvatar: p.users?.avatar_url,
            platform: p.platforms?.name || 'ChatGPT',
            category: p.categories?.name || 'General',
            categoryId: p.categories?.id || null,
            sales: p.purchases_count || 0,
            viewsCount: p.views_count || 0,
            seed: p.users?.username || 'user'
          }));
          setDbPrompts(remappedPrompts as any);

          const userMap = new Map();
          remappedPrompts.forEach((p: any) => {
             if (p.authorId) {
               const existing = userMap.get(p.authorId) || { name: p.author, role: "Prompt Engineer", likes: 0, posts: 0, views: 0, seed: p.seed, avatarUrl: p.authorAvatar };
               existing.posts += 1;
               existing.views += Number(p.viewsCount);
               existing.likes += Math.round(Number(p.rating) * 10 + (Number(p.sales) * 2)); 
               userMap.set(p.authorId, existing);
             }
          });
          const topUsers = Array.from(userMap.values())
             .sort((a, b) => b.views - a.views)
             .map((u: any) => ({ 
               ...u, 
               likes: u.likes > 1000 ? (u.likes/1000).toFixed(1) + 'K' : u.likes.toString(), 
               views: u.views > 1000 ? (u.views/1000).toFixed(1) + 'K' : u.views.toString(),
               posts: u.posts.toString()
             }));
          setDbUsers(topUsers);
        }

        const { data: cats } = await supabase.from('categories').select('*');
        if (cats) setDbCategories(cats);

      } catch (err) {
        console.error("Error loading home data:", err);
      }
    };
    fetchData();
  }, []);

  const getFiltered = (condition: (p: any) => boolean, limit = 5) => {
    const subset = dbPrompts.filter(condition);
    if (subset.length >= limit) return subset.slice(0, limit);
    const fallback = dbPrompts.filter((p: any) => !subset.includes(p)).slice(0, Math.max(0, limit - subset.length));
    return [...subset, ...fallback];
  };

  const imagePrompts = getFiltered((p: any) => p.category?.toLowerCase().includes("image") || p.category?.toLowerCase().includes("visual"));
  const videoPrompts = getFiltered((p: any) => p.category?.toLowerCase().includes("video") || p.platform?.toLowerCase().includes("runway"));
  const packPrompts = dbPrompts.length > 5 ? dbPrompts.slice(5, 10) : dbPrompts; 
  const trendingPrompts = [...dbPrompts].sort((a: any, b: any) => b.viewsCount - a.viewsCount);
  const mostLikedPrompts = [...dbPrompts].sort((a: any, b: any) => b.rating - a.rating);
  const displayPrompts = dbPrompts; 

  // Icon mapping for database categories
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('photo') || n.includes('image')) return ImageIcon;
    if (n.includes('video')) return Video;
    if (n.includes('code')) return Code;
    if (n.includes('seo') || n.includes('market')) return Globe;
    return Zap;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20" suppressHydrationWarning>

      <main className="max-w-[1440px] mx-auto px-10 pt-16 pb-40 space-y-28">

        {/* ── HERO ─────────────────────────────────────────────────────────────── */}
        <section className="text-center space-y-10 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" /> 10,000+ Premium AI Prompts
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-title text-foreground"
          >
            The Prompt<br />
            <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">Marketplace</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="body-base max-w-xl mx-auto"
          >
            Buy & sell high-quality AI prompts for Midjourney, ChatGPT, DALL-E, Runway and more.
            Unlock stunning outputs instantly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <button className="h-14 px-10 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:brightness-110 shadow-2xl shadow-primary/30 transition-all" suppressHydrationWarning>
              Browse Prompts
            </button>
            <button className="h-14 px-10 bg-secondary text-foreground text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-secondary/70 transition-all">
              Sell Prompts →
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 pt-4"
          >
            {[["10K+","Prompts"], ["4.9★","Avg. Rating"], ["50K+","Users"], ["200+","Sellers"]].map(([v,l]) => (
              <div key={l} className="text-center">
                <div className="text-xl font-black text-foreground">{v}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{l}</div>
              </div>
            ))}
          </motion.div>
        </section>


        {/* ── IMAGE TRANSFORMATION (9:16) ──────────────────────────────────────── */}
        <section>
          <SectionHeader title="Image Transformation" sub="Instagram · Story · Portrait · 9:16 Format" href="/explore?category=image-visual" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {imagePrompts.slice(0, 5).map((p, i) => (
              <SectionCard200
                key={p.id}
                p={p}
                href={`/prompt/${p.id}`}
                category1="Transformation"
                category2={i % 2 === 0 ? "Portrait" : "Reel"}
                imageOnly
              />
            ))}
          </div>
        </section>

        {/* ── INSTAGRAM PROMPTS ────────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Instagram Prompts" sub="Reels · AI Avatars · Posts" href="/explore?category=image-visual" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {imagePrompts.slice(0, 5).map((p, i) => (
              <SectionCard200
                key={`ig-${p.id}`}
                p={p}
                href={`/prompt/${p.id}`}
                category1="Instagram"
                category2={["Reel", "AI Avatar", "Post", "Story", "Reel"][i]}
                imageOnly
              />
            ))}
          </div>
        </section>

        {/* ── PLATFORM SPECIFIC PROMPTS ────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Platform Specific Prompts" more={false} />
          <div className="flex flex-nowrap gap-5 md:gap-8 items-center justify-start w-full overflow-x-auto scrollbar-hide pb-6 pt-2">
            {platforms.map((p, i) => (
              <motion.div
                key={`${p.name}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1, y: -6 }}
                className="w-20 h-20 md:w-[104px] md:h-[104px] shrink-0 rounded-full bg-white flex items-center justify-center shadow-lg shadow-slate-200/50 border border-slate-100 cursor-pointer overflow-hidden transition-all duration-300 relative group snap-center"
                title={p.name}
              >
                <div className={cn("w-full h-full flex items-center justify-center absolute inset-0 text-slate-900 transition-transform duration-300", p.padding)}>
                  <img 
                    src={p.icon} 
                    alt={p.name} 
                    className="w-full h-full object-contain grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 16:9 VIDEO PROMPTS ───────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Video & YouTube Prompts" sub="16:9 Widescreen · Cinematic" href="/explore?category=video-generation" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pb-2">
            {videoPrompts.slice(0, 5).map((p, i) => (
              <ExplorePromptCard
                key={`video-${p.id}-${i}`}
                id={p.id.toString()}
                title={p.title}
                description={p.description || p.title}
                image={p.image}
                rating={p.rating || 4.7}
                usageCount={p.sales || 2100}
                tags={[p.category || "Video", i % 2 === 0 ? "YouTube" : "Cinematic"]}
                creator={p.author || "Creator Pro"}
                price={p.price || 24}
                category={p.category || "Video"}
                platform={p.platform || "Platform"}
                mode="grid"
                initialWishlisted={false}
                viewsCount={p.viewsCount || 0}
              />
            ))}
          </div>
        </section>

        {/* ── BATCH STACKED PROMPT CARDS ───────────────────────────────────────── */}
        <section>
          <SectionHeader title="Prompt Packs" sub="Bundled collections → stacked value" href="/explore?sort=featured" />
          <div className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide pb-2">
            {packPrompts.slice(0, 5).map((b, i) => (
              <SectionCard200
                key={`pack-${b.id}-${i}`}
                p={{
                  title: b.title,
                  image: b.image,
                  platform: "Bundle",
                  rating: b.rating || 4.8,
                  author: b.author || "Creator",
                  price: b.price || 19,
                }}
                href={`/prompt/${b.id}`}
                category1="Prompt Pack"
                category2="Bundle"
              />
            ))}
          </div>
        </section>

        {/* ── BASED ON PROFESSION & INTEREST ─────────────────────────────────────── */}
        <section>
          <SectionHeader title="Based on Your Profession & Interest" sub="Single prompt cards · handpicked for you" href="/explore?sort=newest" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pb-2">
            {displayPrompts.slice(0, 5).map((p) => (
              <ExplorePromptCard
                key={`prof2-${p.id}`}
                id={p.id.toString()}
                title={p.title}
                description={p.description || p.title}
                image={p.image}
                rating={p.rating || 4.8}
                usageCount={p.sales || 0}
                tags={["Profession", "Interest"]}
                creator={p.author || "Unknown"}
                price={p.price || 0}
                category="Profession"
                platform={p.platform || "AI"}
                mode="grid"
                initialWishlisted={false}
                viewsCount={p.viewsCount || 0}
              />
            ))}
          </div>
        </section>

        {/* ── PROMPTS BY PROFESSIONALS ─────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Prompts by Professionals" sub="Handpicked categories for your specific role" />
          <div className="flex flex-nowrap justify-start gap-6 md:gap-[70px] pt-4 pb-8 overflow-x-auto scrollbar-hide">
            {professions.map((prof, i) => (
              <motion.div
                key={prof.title + i}
                whileHover={{ y: -8, scale: 1.05 }}
                className="flex flex-col items-center gap-5 cursor-pointer group"
              >
                <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full bg-white flex items-center justify-center text-[44px] md:text-[52px] shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] group-hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] transition-all border border-slate-100/80">
                  {prof.emoji}
                </div>
                <div className="text-[10px] md:text-[11px] font-black tracking-[0.05em] text-center text-slate-800 leading-tight">
                  {prof.title.split('\n').map((line, idx) => (
                    <span key={idx} className="block">{line}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── BROAD CATEGORIES ─────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-[3px] h-5 bg-purple-600 rounded-full" />
              <h2 className="text-[18px] md:text-[20px] font-black text-slate-900 tracking-tight">
                Broad Categories
              </h2>
            </div>
            <div className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-900 cursor-pointer hover:text-purple-600 transition-colors flex items-center gap-1">
              See More <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {dbCategories.map((cat: any, i) => {
              const Icon = cat.icon || getCategoryIcon(cat.name || cat.title);
              return (
                <div
                  key={cat.id || cat.title}
                  className="group relative cursor-pointer bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-purple-600 overflow-hidden flex flex-col items-start justify-between min-h-[160px] transition-colors duration-300"
                >
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-purple-50/70 transition-colors duration-300 pointer-events-none group-hover:bg-purple-100/50" />
                  
                  <Icon className="w-[18px] h-[18px] text-purple-600 mb-6 z-10" />
                  
                  <div className="flex flex-col gap-2 z-10 w-full mt-auto">
                    <h3 className="text-[11px] font-black text-slate-900 tracking-wide leading-tight">
                      {cat.name || cat.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed truncate w-full">
                      {cat.description || cat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── GUIDE & PACKAGES ─────────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Guide & Packages" sub="Multiple prompts bundled under one topic" />
          <div className="grid md:grid-cols-3 gap-8">
            {guides.map((guide, i) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card bg-card border border-border/60 hover:border-primary rounded-[2.5rem] p-7 group hover:shadow-2xl hover:shadow-primary/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">{guide.tag}</span>
                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground mt-3">{guide.title}</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {guide.seeds.map((seed, j) => (
                    <div key={j} className="aspect-square rounded-2xl overflow-hidden relative">
                      <img src={`https://picsum.photos/seed/${seed}/300`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-secondary text-foreground group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  Explore Package
                </button>
              </motion.div>
            ))}
          </div>
        </section>



        {/* ── WHAT PEOPLE ARE BUYING ─────────────────────────────────────────── */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="heading-h2">What People are Buying</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "text", "image", "code", "agent"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border",
                    activeFilter === f 
                      ? "bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-600/20" 
                      : "bg-white text-slate-500 border-slate-200 hover:border-purple-300 hover:text-purple-600"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pb-2">
            <AnimatePresence mode="popLayout">
              {displayPrompts
                .filter(p => activeFilter === "all" || p.category === activeFilter)
                .slice(0, 10)
                .map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <ExplorePromptCard
                      id={p.id.toString()}
                      title={p.title}
                      description={p.title}
                      image={p.image}
                      rating={p.rating || 4.8}
                      usageCount={p.sales || 2100}
                      tags={[p.category || "General"]}
                      creator={p.author || "Creator Pro"}
                      price={p.price || 24}
                      category={p.category}
                      platform={p.platform || "Midjourney"}
                      mode="grid"
                      initialWishlisted={false}
                viewsCount={0}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </section>

        {/* ── TRENDING TOPICS ──────────────────────────────────────────────────── */}
        <section className="space-y-12">
          <SectionHeader title="Trending Topics" sub="Explore trending prompts by category" more={false} />
          <div className="bg-card border border-border/60 rounded-[3rem] p-10 space-y-16">
            {trendingGroups.map((group, gi) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{group.icon}</div>
                  <h4 className="text-[11px] font-black tracking-widest text-foreground">Trending in {group.label}</h4>
                  <Flame className="w-3.5 h-3.5 text-orange-500 ml-1" />
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x">
                  {trendingPrompts.slice(0, 12).map((p, j) => (
                    <TrendingCard key={j} seed={`${group.label}-${gi}`} idx={j} href={`/prompt/${p.id}`} title={p.title} price={p.price || 0} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOP CONTRIBUTORS ─────────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Top Contributors" more={false} />
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-6 snap-x -mx-2 px-2">
            {dbUsers.slice(0, 6).map((c: any) => (
              <ProfileCard key={c.seed} c={c} href={`/u/${c.name}`} />
            ))}
          </div>
        </section>

        {/* ── MOST LIKED PROMPTS (Favorite Section) ─────────────────────────────── */}
        <section className="bg-slate-50 border border-slate-200/60 rounded-[3rem] p-8 md:p-12">
          <SectionHeader title="Most Liked Prompts" sub="User favorites · Community picks" href="/explore?sort=featured" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pb-2">
            {mostLikedPrompts.slice(0, 5).map((p, i) => (
              <ExplorePromptCard
                key={`fave-${p.id}`}
                id={p.id.toString()}
                title={p.title}
                description={p.description || p.title}
                image={p.image}
                rating={p.rating || 4.8}
                usageCount={p.sales || 0}
                tags={p.category ? [p.category] : ["Architecture", "System Design"]}
                creator={p.author || "Creator"}
                price={p.price || 0}
                category={p.category || "Design"}
                platform={p.platform || "Platform"}
                mode="grid"
                initialWishlisted={false}
                viewsCount={p.viewsCount || 0}
              />
            ))}
          </div>
        </section>

      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/60 bg-card">
        <div className="max-w-[1440px] mx-auto px-10 py-20 grid md:grid-cols-4 gap-14">
          <div className="md:col-span-2 space-y-5">
            <span className="text-3xl font-black italic tracking-tighter text-primary block">PROMPTX</span>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-medium">
              The world's leading marketplace for AI prompts. High-quality outputs, verified engineers, and instant delivery for Midjourney, ChatGPT, Runway & more.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {dbUsers.slice(0, 6).map((c: any) => (
                  <img key={c.seed} src={c.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.seed}`} className="w-8 h-8 rounded-full border-2 border-card" alt="" />
                ))}
              </div>
              <div className="text-xs text-muted-foreground font-bold"><span className="text-foreground font-black">50K+</span> happy users</div>
            </div>
          </div>
          {[
            { title: "Marketplace", links: ["Explore All", "Trending Today", "Newest", "Featured"] },
            { title: "Company",     links: ["About",        "Sell Prompts",  "Contact", "Privacy"]  },
          ].map(col => (
            <div key={col.title} className="space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border/40 text-center py-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">© 2026 PROMPTX · Built with Excellence</p>
        </div>
      </footer>
    </div>
  );
}
