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

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} className={cn("w-3 h-3", s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
    ))}
    <span className="text-[10px] font-black text-muted-foreground ml-1">{rating}</span>
  </div>
);

const SectionHeader = ({ title, sub, more = true }: { title: string; sub?: string; more?: boolean }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <h2 className="heading-h2">{title}</h2>
      {sub && <p className="body-xs tracking-widest mt-2">{sub}</p>}
    </div>
    {more && (
      <button className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
        See all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    )}
  </div>
);

const ActionStrip = () => (
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
);

const SectionCard200 = ({
  p,
  href,
  category1,
  category2,
  imageOnly = false,
}: {
  p: any;
  href: string;
  category1: string;
  category2: string;
  imageOnly?: boolean;
}) => (
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
          <span className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-md z-10 transition-transform duration-300 group-hover:translate-x-1">
            {p.platform}
          </span>
          <ActionStrip />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/20 backdrop-blur-xl border-t border-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex items-center justify-between shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-white/90 tracking-wider">RATING</span>
              <div className="flex items-center gap-1">
                <span className="text-white text-[10px] tracking-tight">★★★★★</span>
                <span className="text-[11px] font-bold text-white">{Number(p.rating).toFixed(1)}</span>
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
            <ActionStrip />
          </div>
          <div className="p-4 flex flex-col h-full bg-white">
            <div className="flex gap-1.5 flex-wrap mb-2">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-border text-primary font-mono">{category1}</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-border text-primary font-mono">{category2}</span>
            </div>
            <div className="text-sm font-bold text-foreground leading-snug mb-3 line-clamp-2 min-h-[2.75rem]">{p.title}</div>
            <div className="flex items-center gap-3 mb-3 text-[11px]">
              <div className="flex items-center gap-0.5">
                <span className="text-primary tracking-widest">★★★★★</span>
                <span className="font-mono font-bold text-foreground">{Number(p.rating).toFixed(1)}</span>
              </div>
              <div className="h-3 w-px bg-border/60" />
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                <Eye className="w-3.5 h-3.5" /> {p.viewsCount?.toLocaleString() || 0}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
              <div 
                className="flex items-center gap-2 flex-1 cursor-pointer hover:opacity-80 transition-opacity z-20"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/u/${p.author}`; }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[8px] font-bold text-white shrink-0 uppercase">
                  {p.author?.charAt(0) || "C"}
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

const TrendingCard = ({ seed, idx, href, title, price }: { seed: string; idx: number; href: string; title: string, price: number }) => (
  <motion.div whileHover={{ y: -4, scale: 1.03 }} className="glass-card w-28 shrink-0 bg-card border border-border/60 hover:border-primary rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-primary/20 transition-all" onClick={() => { window.location.href = href; }}>
    <div className="aspect-square overflow-hidden relative">
      <img src={`https://picsum.photos/seed/${seed}-${idx}/200`} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    </div>
    <div className="p-2">
      <div className="text-[9px] font-black text-foreground truncate">{title}</div>
      <div className="text-[8px] text-muted-foreground font-bold mt-0.5">◈ {price}</div>
    </div>
  </motion.div>
);

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
          {["bg-blue-500", "bg-emerald-400", "bg-yellow-400", "bg-orange-400", "bg-rose-500"].map((c, i) => (
            <div key={i} className={cn("flex-1", c)} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border border-t border-border pt-4">
        {[
          { label: "Likes", value: c.likes, Icon: Heart },
          { label: "Posts", value: c.posts, Icon: MessageSquare },
          { label: "Views", value: c.views, Icon: Eye },
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

// ─── DATA ─────────────────────────────────────────────────────────────────────

const widePrompts = [
  { id: 6, title: "YouTube Thumbnail – Viral Energy", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&q=80", promptId: 1 },
  { id: 7, title: "Documentary B-Roll – Urban Decay", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80", promptId: 2 },
  { id: 8, title: "Cinematic Drone Shot – Coastal Cliffs", image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=700&q=80", promptId: 3 },
  { id: 9, title: "Product Reveal – Dark Studio Setup", image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=700&q=80", promptId: 4 },
];

const batchPrompts = [
  { title: "LinkedIn Prompt", img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80", promptId: 1 },
  { title: "SEO Strategy", img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80", promptId: 2 },
  { title: "Twitter Thread", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80", promptId: 3 },
  { title: "Content Plan", img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80", promptId: 4 },
  { title: "Email Campaign", img: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=80", promptId: 5 },
];

const platforms = [
  { name: "ChatGPT", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg", padding: "p-5 md:p-7" },
  { name: "Midjourney", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png", padding: "p-3.5 md:p-5" },
  { name: "Anthropic", icon: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg", padding: "p-[18px] md:p-[30px]" },
  { name: "Gemini", icon: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg", padding: "p-[18px] md:p-[28px]" },
  { name: "Meta", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", padding: "p-5 md:p-8" },
  { name: "GitHub", icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg", padding: "p-[22px] md:p-[32px]" },
  { name: "Notion", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg", padding: "p-6 md:p-10" },
  { name: "HuggingFace", icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg", padding: "p-[18px] md:p-[26px]" },
];

const trendingGroups = [
  { label: "Daily Hacks", icon: <Zap className="w-3.5 h-3.5" /> },
  { label: "Image Generation", icon: <ImageIcon className="w-3.5 h-3.5" /> },
  { label: "Video Generation", icon: <Video className="w-3.5 h-3.5" /> },
  { label: "Persona", icon: <Camera className="w-3.5 h-3.5" /> },
  { label: "Agents", icon: <Globe className="w-3.5 h-3.5" /> },
];

const professions = [
  { title: "CONTENT\nCREATORS", emoji: "🤳" },
  { title: "FOUNDERS &\nENTREPRENEURS", emoji: "👔" },
  { title: "DESIGNERS", emoji: "🎨" },
  { title: "LEGAL\nPROFESSIONALS", emoji: "⚖️" },
  { title: "WEBSITE\nDEVELOPERS", emoji: "💻" },
  { title: "MARKETERS &\nAGENCIES", emoji: "📈" },
];

const guides = [
  { title: "LinkedIn Hacks", tag: "🔗 LinkedIn", seeds: ["park", "city", "bridge", "office"] },
  { title: "SEO Hacks", tag: "🔍 SEO", seeds: ["mountain", "forest", "river", "road"] },
  { title: "Startup Ideas Hacks", tag: "💡 Startup", seeds: ["aurora", "desert", "coast", "lake"] },
];

const contributors = [
  { name: "Noah Thompson", role: "Prompt Engineer", likes: "72.9K", posts: "828", views: "342K", seed: "noah" },
  { name: "Sara Kim", role: "AI Art Director", likes: "58.3K", posts: "614", views: "220K", seed: "sara" },
  { name: "Luca Moretti", role: "Midjourney Expert", likes: "91.2K", posts: "1.2K", views: "480K", seed: "luca" },
  { name: "Ava Chen", role: "Brand Strategist", likes: "44.1K", posts: "399", views: "175K", seed: "ava" },
  { name: "James Wright", role: "Video Generationist", likes: "67.8K", posts: "755", views: "310K", seed: "james" },
  { name: "Mia Santos", role: "Content Creator", likes: "38.5K", posts: "520", views: "140K", seed: "mia" },
];


export default function HomeClient({ displayPrompts, dbCategories }: { displayPrompts: any[], dbCategories: any[] }) {
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('photo') || n.includes('image')) return ImageIcon;
    if (n.includes('video')) return Video;
    if (n.includes('code')) return Code;
    if (n.includes('seo') || n.includes('market')) return Globe;
    return Zap;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">

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
            <Link href="/explore">
              <button className="h-14 px-10 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:brightness-110 shadow-2xl shadow-primary/30 transition-all">
                Browse Prompts
              </button>
            </Link>
            <Link href="/upload">
              <button className="h-14 px-10 bg-secondary text-foreground text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-secondary/70 transition-all">
                Sell Prompts →
              </button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 pt-4"
          >
            {[["10K+", "Prompts"], ["4.9★", "Avg. Rating"], ["50K+", "Users"], ["200+", "Sellers"]].map(([v, l]) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {displayPrompts.slice(0, 5).map((p, i) => (
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
          <SectionHeader title="Instagram Prompts" sub="Reels · AI Avatars · Posts" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {displayPrompts.slice(0, 5).map((p, i) => (
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
          <SectionHeader title="Video & YouTube Prompts" sub="16:9 Widescreen · Cinematic" />
          <div className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide pb-2">
            {[...widePrompts, widePrompts[0]].slice(0, 5).map((p, i) => (
              <SectionCard200
                key={`${p.id}-${i}`}
                p={{
                  title: p.title,
                  image: p.image,
                  platform: "YouTube",
                  rating: 4.7,
                  author: "Creator Pro",
                  price: 24,
                }}
                href={`/prompt/${p.promptId}`}
                category1="Video"
                category2={i % 2 === 0 ? "YouTube" : "Cinematic"}
              />
            ))}
          </div>
        </section>

        {/* ── BATCH STACKED PROMPT CARDS ───────────────────────────────────────── */}
        <section>
          <SectionHeader title="Prompt Packs" sub="Bundled collections → stacked value" />
          <div className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide pb-2">
            {batchPrompts.slice(0, 5).map((b, i) => (
              <SectionCard200
                key={`${b.title}-${i}`}
                p={{
                  title: b.title,
                  image: b.img,
                  platform: "Bundle",
                  rating: 4.8,
                  author: displayPrompts[i % displayPrompts.length]?.author || "Creator",
                  price: displayPrompts[i % displayPrompts.length]?.price || 19,
                }}
                href={`/prompt/${b.promptId}`}
                category1="Prompt Pack"
                category2="Bundle"
              />
            ))}
          </div>
        </section>

        {/* ── BASED ON PROFESSION & INTEREST ─────────────────────────────────────── */}
        <section>
          <SectionHeader title="Based on Your Profession & Interest" sub="Single prompt cards · handpicked for you" />
          <div className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide pb-2">
            {displayPrompts.slice(0, 5).map((p) => (
              <SectionCard200
                key={`prof2-${p.id}`}
                p={p}
                href={`/prompt/${p.id}`}
                category1="Profession"
                category2="Interest"
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
              const Icon = getCategoryIcon(cat.name);
              return (
                <div
                  key={cat.id}
                  className="group relative cursor-pointer bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-purple-600 overflow-hidden flex flex-col items-start justify-between min-h-[160px] transition-colors duration-300"
                >
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-purple-50/70 transition-colors duration-300 pointer-events-none group-hover:bg-purple-100/50" />
                  
                  <Icon className="w-[18px] h-[18px] text-purple-600 mb-6 z-10" />
                  
                  <div className="flex flex-col gap-2 z-10 w-full mt-auto">
                    <h3 className="text-[11px] font-black text-slate-900 tracking-wide leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed truncate w-full">
                      {cat.description}
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

        {/* ── TRENDING ─────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Trending Topics" />
          <div className="bg-card border border-border/60 rounded-[3rem] p-10 space-y-10">
            {trendingGroups.map((group, gi) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{group.icon}</div>
                  <h4 className="text-[11px] font-black tracking-widest text-foreground">Trending in {group.label}</h4>
                  <Flame className="w-3.5 h-3.5 text-orange-500 ml-1" />
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x">
                  {displayPrompts.slice(0, 12).map((p, j) => (
                    <TrendingCard key={j} seed={`${group.label}-${gi}`} idx={j} href={`/prompt/${p.id}`} title={p.title} price={p.price} />
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
              <ProfileCard key={c.seed} c={c} href={`/u/${c.name}`} />
            ))}
          </div>
        </section>

        {/* ── MOST LIKED PROMPTS (Favorite Section) ─────────────────────────────── */}
        <section className="bg-slate-50 border border-slate-200/60 rounded-[3rem] p-8 md:p-12">
          <SectionHeader title="Most Liked Prompts" sub="User favorites · Community picks" />
          <div className="flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide pb-2">
            {displayPrompts.slice(0, 5).map((p, i) => (
              <SectionCard200
                key={`fave-${i}`}
                p={p}
                href={`/prompt/${p.id}`}
                category1="Architecture"
                category2="System Design"
              />
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t border-border/60 bg-card">
        <div className="max-w-[1440px] mx-auto px-10 py-20 grid md:grid-cols-4 gap-14 text-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                 <Zap className="w-5 h-5 text-white" />
               </div>
               <span className="text-lg font-black tracking-tighter uppercase">PromptStore</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The world's first and largest marketplace for premium AI prompts. Elevate your creative output with professional engineering.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-[11px]">Marketplace</h4>
            <ul className="space-y-2 text-muted-foreground font-medium">
              <li><Link href="/explore">Browse All</Link></li>
              <li><Link href="/explore?cat=Midjourney">Midjourney</Link></li>
              <li><Link href="/explore?cat=ChatGPT">ChatGPT</Link></li>
              <li><Link href="/upload">Sell Prompts</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-[11px]">Resources</h4>
            <ul className="space-y-2 text-muted-foreground font-medium">
              <li>Help Center</li>
              <li>Blog</li>
              <li>API Docs</li>
              <li>Community</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-[11px]">Company</h4>
            <ul className="space-y-2 text-muted-foreground font-medium">
              <li>About</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}
