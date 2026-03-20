"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, ImageIcon, Video, Code, Search, Star,
  MessageSquare, Heart, Eye, Layers, Camera, PenTool,
  LayoutTemplate, Briefcase, ChevronRight, Play, Sparkles,
  Flame, TrendingUp, Zap, Globe, ArrowRight, BadgeCheck, Share2
} from "lucide-react";

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────

const prompts = [
  { id: 1, title: "Neon Cyberpunk City at Midnight", price: 29, rating: 4.9, sales: 3204, author: "AlphaDesigner", platform: "Midjourney", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80" },
  { id: 2, title: "Ethereal Portrait – Bioluminescent Skin", price: 19, rating: 4.7, sales: 1850, author: "VisionX",       platform: "DALL-E",      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80" },
  { id: 3, title: "Street Photography in Rainy Tokyo", price: 14, rating: 4.8, sales: 2100, author: "Kinora",           platform: "Stable-D",    image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&q=80" },
  { id: 4, title: "Abstract Fluid Art – Gold & Indigo", price: 24, rating: 4.6, sales: 987,  author: "ArtFlux",         platform: "Midjourney",  image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80" },
  { id: 5, title: "Cinematic Landscape – Golden Hour", price: 35, rating: 5.0, sales: 4100, author: "FrameForge",      platform: "Runway ML",   image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" },
];

const widePrompts = [
  { id: 6, title: "YouTube Thumbnail – Viral Energy",        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&q=80" },
  { id: 7, title: "Documentary B-Roll – Urban Decay",        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80" },
  { id: 8, title: "Cinematic Drone Shot – Coastal Cliffs",   image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=700&q=80" },
  { id: 9, title: "Product Reveal – Dark Studio Setup",      image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=700&q=80" },
];

const batchPrompts = [
  { title: "LinkedIn Prompt", img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80" },
  { title: "SEO Strategy",    img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80" },
  { title: "Twitter Thread",  img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80" },
  { title: "Content Plan",    img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80" },
  { title: "Email Campaign",  img: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80" },
];

const platforms = [
  { name: "Midjourney",       initial: "MJ", color: "bg-black text-white" },
  { name: "ChatGPT",          initial: "GP", color: "bg-emerald-600 text-white" },
  { name: "DALL-E",           initial: "DE", color: "bg-rose-600 text-white" },
  { name: "Claude",           initial: "CL", color: "bg-amber-500 text-white" },
  { name: "Stable Diffusion", initial: "SD", color: "bg-blue-600 text-white" },
  { name: "Gemini",           initial: "GM", color: "bg-sky-500 text-white" },
  { name: "Leonardo AI",      initial: "LN", color: "bg-purple-600 text-white" },
  { name: "Runway ML",        initial: "RM", color: "bg-pink-600 text-white" },
  { name: "Kling AI",         initial: "KL", color: "bg-orange-600 text-white" },
  { name: "Sora",             initial: "SO", color: "bg-indigo-600 text-white" },
];

const trendingGroups = [
  { label: "Daily Hacks",       icon: <Zap className="w-3.5 h-3.5" /> },
  { label: "Image Generation",  icon: <ImageIcon className="w-3.5 h-3.5" /> },
  { label: "Video Generation",  icon: <Video className="w-3.5 h-3.5" /> },
  { label: "Persona",           icon: <Camera className="w-3.5 h-3.5" /> },
  { label: "Agents",            icon: <Globe className="w-3.5 h-3.5" /> },
];

const categories = [
  { title: "Photography & Imaging", desc: "Image gen, transformation, editing", icon: ImageIcon,    gradient: "from-blue-500 to-cyan-400",    count: "4.2K" },
  { title: "Video Generation",      desc: "Reels, Shorts, cinematic sequences", icon: Video,         gradient: "from-purple-500 to-violet-400", count: "1.8K" },
  { title: "Coding & Technical",    desc: "Architecture, debugging, logic",     icon: Code,          gradient: "from-emerald-500 to-teal-400",  count: "3.1K" },
  { title: "SEO & Content",         desc: "Blogs, articles, social strategy",   icon: LayoutTemplate, gradient: "from-orange-500 to-amber-400",  count: "2.7K" },
  { title: "Research & Strategy",   desc: "Market analysis, startup ideas",     icon: Briefcase,     gradient: "from-rose-500 to-pink-400",     count: "1.4K" },
];

const professions = [
  { title: "Content Creators",       emoji: "🎬", color: "from-pink-500 to-rose-500" },
  { title: "Founders & Entrepreneurs", emoji: "🚀", color: "from-violet-500 to-purple-500" },
  { title: "Designers",              emoji: "🎨", color: "from-blue-500 to-cyan-500" },
  { title: "Developers",             emoji: "💻", color: "from-emerald-500 to-teal-500" },
  { title: "Marketers",              emoji: "📈", color: "from-amber-500 to-orange-500" },
];

const guides = [
  { title: "LinkedIn Hacks",      tag: "🔗 LinkedIn",  seeds: ["park", "city", "bridge", "office"] },
  { title: "SEO Hacks",           tag: "🔍 SEO",       seeds: ["mountain", "forest", "river", "road"] },
  { title: "Startup Ideas Hacks", tag: "💡 Startup",   seeds: ["aurora", "desert", "coast", "lake"] },
];

const contributors = [
  { name: "Noah Thompson",   role: "Prompt Engineer",   likes: "72.9K", posts: "828", views: "342K", seed: "noah" },
  { name: "Sara Kim",        role: "AI Art Director",   likes: "58.3K", posts: "614", views: "220K", seed: "sara" },
  { name: "Luca Moretti",    role: "Midjourney Expert", likes: "91.2K", posts: "1.2K", views: "480K", seed: "luca" },
  { name: "Ava Chen",        role: "Brand Strategist",  likes: "44.1K", posts: "399", views: "175K", seed: "ava"  },
  { name: "James Wright",    role: "Video Generationist", likes: "67.8K", posts: "755", views: "310K", seed: "james" },
  { name: "Mia Santos",      role: "Content Creator",   likes: "38.5K", posts: "520", views: "140K", seed: "mia"  },
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

const SectionHeader = ({ title, sub, more = true }: { title: string; sub?: string; more?: boolean }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <h2 className="text-2xl font-black uppercase tracking-tight text-foreground leading-none">{title}</h2>
      {sub && <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2">{sub}</p>}
    </div>
    {more && (
      <button className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
        See all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    )}
  </div>
);

const ActionStrip = () => (
  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-6 group-hover:translate-x-0 z-30 duration-200">
    <button className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-primary flex items-center justify-center shadow-xl hover:bg-primary hover:text-white transition-all transform hover:scale-110">
      <Eye className="w-4 h-4" />
    </button>
    <button className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-slate-500 flex items-center justify-center shadow-xl hover:text-rose-500 transition-all transform hover:scale-110">
      <Heart className="w-4 h-4" />
    </button>
    <button className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-slate-500 flex items-center justify-center shadow-xl hover:text-blue-500 transition-all transform hover:scale-110">
      <Share2 className="w-4 h-4" />
    </button>
  </div>
);

// Portrait card (9:16)
const PortraitCard = ({ image, badge, title, price, rating, author }: { image: string; badge?: string; title?: string; price?: number; rating?: number; author?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -6 }}
    className="glass-card group cursor-pointer rounded-3xl overflow-hidden bg-card border border-border/60 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 flex flex-col"
  >
    <div className="aspect-[9/16] relative overflow-hidden">
      <img src={image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <ActionStrip />
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
const PromptCard = ({ p }: { p: typeof prompts[0] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -6 }}
    className="glass-card group cursor-pointer rounded-3xl overflow-hidden bg-card border border-border/60 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300"
  >
    <div className="aspect-square relative overflow-hidden">
      <img src={p.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <ActionStrip />
      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-md text-white border border-white/10">
        {p.platform}
      </span>
    </div>
    <div className="p-4 space-y-3">
      <div className="text-[13px] font-black text-foreground line-clamp-2 leading-snug">{p.title}</div>
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

// Stacked batch card
const BatchCard = ({ title, img }: { title: string; img: string }) => (
  <motion.div whileHover={{ y: -6 }} className="relative group cursor-pointer">
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
const TrendingCard = ({ seed, idx }: { seed: string; idx: number }) => (
  <motion.div whileHover={{ y: -4, scale: 1.03 }} className="glass-card w-28 shrink-0 bg-card border border-border/60 hover:border-primary rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-primary/20 transition-all">
    <div className="aspect-square overflow-hidden relative">
      <img src={`https://picsum.photos/seed/${seed}-${idx}/200`} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    </div>
    <div className="p-2">
      <div className="text-[9px] font-black text-foreground truncate">Prompt #{idx+1}</div>
      <div className="text-[8px] text-muted-foreground font-bold mt-0.5">◈ {12 + idx}</div>
    </div>
  </motion.div>
);

// Contributor profile card
const ProfileCard = ({ c }: { c: typeof contributors[0] }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="glass-card w-60 shrink-0 bg-card border border-border/60 hover:border-primary rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer"
  >
    <div className="h-20 bg-gradient-to-br from-primary/80 to-violet-600/80 relative overflow-hidden">
      <img src={`https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80&seed=${c.seed}`} className="w-full h-full object-cover opacity-30 mix-blend-overlay" alt="" />
      <button className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur text-[9px] font-black text-primary rounded-full flex items-center gap-1 shadow-lg hover:scale-105 transition-transform">
        Follow <Plus className="w-2.5 h-2.5" />
      </button>
    </div>
    <div className="px-5 pb-5 relative">
      <div className="absolute -top-7 left-5 w-14 h-14 rounded-full border-4 border-card overflow-hidden shadow-lg">
        <img src={`https://i.pravatar.cc/150?u=${c.seed}`} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="mt-9 mb-3">
        <div className="flex items-center gap-1.5 mb-1">
          <h4 className="text-sm font-black text-foreground tracking-tight">{c.name}</h4>
          <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
        </div>
        <p className="text-[10px] text-muted-foreground font-medium leading-snug">{c.role}</p>
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

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function HomeV4() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">

      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-border/40 bg-background/80 backdrop-blur-2xl">
        <div className="max-w-[1440px] mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="text-2xl font-black italic tracking-tighter text-primary select-none">PROMPTX</span>
            <div className="hidden lg:flex items-center gap-8">
              {["Explore", "Categories", "Professionals", "Guides", "Trending"].map(l => (
                <a key={l} href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ width: searchFocused ? 320 : 240 }}
              className="relative hidden md:block overflow-hidden"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <input
                type="text"
                placeholder="Search 10,000+ prompts..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full h-11 pl-11 pr-4 bg-secondary/60 border border-border/60 rounded-2xl text-xs font-bold placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
              />
            </motion.div>
            <button className="h-11 px-6 bg-secondary text-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-secondary/80 transition-all">
              Sign In
            </button>
            <button className="h-11 px-6 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:brightness-110 shadow-lg shadow-primary/30 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-10 pt-32 pb-40 space-y-28">

        {/* ── HERO ─────────────────────────────────────────────────────────────── */}
        <section className="text-center space-y-6 pt-8">
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
            className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase text-foreground"
          >
            The Prompt<br />
            <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">Marketplace</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl mx-auto text-sm font-medium leading-relaxed"
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
            <button className="h-14 px-10 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:brightness-110 shadow-2xl shadow-primary/30 transition-all">
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
          <SectionHeader title="Image Transformation" sub="Instagram · Story · Portrait · 9:16 Format" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {prompts.map((p, i) => (
              <PortraitCard key={p.id} image={p.image} badge={i === 0 ? "AI Avatar" : i === 1 ? "Reel" : "Post"} title={p.title} price={p.price} rating={p.rating} author={p.author} />
            ))}
          </div>
        </section>

        {/* ── INSTAGRAM PROMPTS ────────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Instagram Prompts" sub="Reels · AI Avatars · Posts" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {prompts.map((p, i) => (
              <PortraitCard key={`ig-${p.id}`} image={p.image} badge={["Reel","AI Avatar","Post","Story","Reel"][i]} />
            ))}
          </div>
        </section>

        {/* ── PLATFORMS ────────────────────────────────────────────────────────── */}
        <section className="rounded-[3rem] bg-secondary/30 border border-border p-12">
          <SectionHeader title="Supported Platforms" more={false} />
          <div className="flex flex-wrap gap-4 justify-center">
            {platforms.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, y: -4 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-black shadow-lg group-hover:shadow-xl transition-all", p.color)}>
                  {p.initial}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{p.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 16:9 VIDEO PROMPTS ───────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Video & YouTube Prompts" sub="16:9 Widescreen · Cinematic" />
          <div className="grid md:grid-cols-4 gap-5">
            {widePrompts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="glass-card group cursor-pointer rounded-3xl overflow-hidden bg-card border border-border/60 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={p.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-2xl">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <ActionStrip />
                </div>
                <div className="p-4">
                  <div className="text-xs font-black text-foreground line-clamp-2">{p.title}</div>
                  <div className="flex items-center justify-between mt-3">
                    <Stars rating={4.7} />
                    <span className="text-xs font-black text-primary">$24</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── BATCH STACKED PROMPT CARDS ───────────────────────────────────────── */}
        <section>
          <SectionHeader title="Prompt Packs" sub="Bundled collections → stacked value" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {batchPrompts.map((b, i) => (
              <BatchCard key={i} title={b.title} img={b.img} />
            ))}
          </div>
        </section>

        {/* ── BASED ON PROFESSION ──────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Based on Your Profession & Interest" sub="Single prompt cards · handpicked for you" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-12">
            {prompts.map((p) => <PromptCard key={`prof-${p.id}`} p={p} />)}
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {professions.map((prof, i) => (
              <motion.div
                key={prof.title}
                whileHover={{ y: -8, scale: 1.05 }}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className={cn("w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center text-4xl shadow-xl group-hover:shadow-2xl transition-all border-4 border-white/10", prof.color)}>
                  {prof.emoji}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-center text-muted-foreground group-hover:text-foreground transition-colors max-w-[100px] leading-tight">{prof.title}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── BROAD CATEGORIES ─────────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Broad Categories" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="glass-card group cursor-pointer bg-card border border-border/60 hover:border-primary rounded-3xl p-7 hover:shadow-2xl hover:shadow-primary/20 transition-all flex flex-col"
              >
                <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-6 transition-transform group-hover:scale-110 shadow-lg", cat.gradient)}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <div className="text-sm font-black text-foreground uppercase tracking-wide leading-tight mb-2">{cat.title}</div>
                <div className="text-[10px] text-muted-foreground font-medium leading-relaxed flex-1">{cat.desc}</div>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                  <span className="text-xs font-black text-primary">{cat.count} prompts</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
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

        {/* ── TRENDING ─────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Trending Topics" />
          <div className="bg-card border border-border/60 rounded-[3rem] p-10 space-y-10">
            {trendingGroups.map((group, gi) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{group.icon}</div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Trending in {group.label}</h4>
                  <Flame className="w-3.5 h-3.5 text-orange-500 ml-1" />
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x">
                  {[...Array(12)].map((_, j) => (
                    <TrendingCard key={j} seed={`${group.label}-${gi}`} idx={j} />
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
            {contributors.map((c) => (
              <ProfileCard key={c.seed} c={c} />
            ))}
          </div>
        </section>

        {/* ── MOST LIKED PROMPTS ───────────────────────────────────────────────── */}
        <section className="bg-secondary/30 border border-border rounded-[3rem] p-12">
          <SectionHeader title="Most Liked Prompts" sub="User favorites · Community picks" />
          <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
            {[...prompts, ...prompts.slice(0,1)].map((p, i) => (
              <PromptCard key={`liked-${i}`} p={{ ...p, id: i + 100 }} />
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
                {contributors.map(c => (
                  <img key={c.seed} src={`https://i.pravatar.cc/32?u=${c.seed}`} className="w-8 h-8 rounded-full border-2 border-card" alt="" />
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
