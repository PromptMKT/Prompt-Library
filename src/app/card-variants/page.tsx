"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, X, Heart } from "lucide-react";

const dummyPrompt = {
  title: "Prompt to Generate Full Stack Architecture",
  platform: "Claude",
  platformColor: "bg-[#8b5cf6]",
  category1: "Architecture",
  category2: "System Design",
  price: 60,
  rating: 4.9,
  sales: 342,
  author: "Dev K.",
  authorAv: "DK",
  authorGradient: "from-[#0ea5e9] to-[#6366f1]",
  snippet: [
    "You are a senior solutions architect with 15 years at FAANG companies.",
    "Given this PRD, generate a complete system architecture.",
    "Cover: API design, database schema, caching strategy..."
  ],
  image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80"
};

const editorialCards = [
  {
    title: "Set up your AI workspace to match the way you ship",
    accent: "from-emerald-200/80 via-teal-100/70 to-background",
    category: "Workspace",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
  },
  {
    title: "Using Claude for architecture reviews and system planning",
    accent: "from-rose-200/80 via-fuchsia-100/70 to-background",
    category: "Engineering",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80",
  },
  {
    title: "Navigating prompt workflows across chat, cowork, and code",
    accent: "from-orange-200/80 via-amber-100/70 to-background",
    category: "Workflow",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80",
  },
  {
    title: "Ship clean prompt systems with reusable patterns and reviews",
    accent: "from-sky-200/80 via-indigo-100/70 to-background",
    category: "Systems",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
  },
];

export default function CardVariants() {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewImage, setQuickViewImage] = useState("");

  const openQuickView = (image: string) => {
    setQuickViewImage(image);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-8 lg:p-16 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        <div className="text-center mb-12">
          <h1 className="heading-h1 mb-3">Vertical Card Variations</h1>
          <p className="body-base">12 variations exploring dimensions, spacing, and layout configurations keeping the original aesthetic.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 items-start">

          {/* 1. THE CLASSIC */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">1. The Classic (Baseline)</h2>
            <div className="w-[280px]">
              <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 transition-all relative group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r z-10 from-primary via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="h-[120px] relative overflow-hidden bg-secondary">
                  <div className="absolute inset-0 p-3 flex flex-col pt-8">
                     {dummyPrompt.snippet.map((line, i) => (
                       <span key={i} className={cn("font-mono text-[9px] leading-[1.6] line-clamp-1", i === 0 ? "text-foreground font-semibold mb-1" : "text-muted-foreground")}>{line}</span>
                     ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold border border-border bg-primary/10 text-primary backdrop-blur-md z-10">{dummyPrompt.platform}</div>
                </div>
                <div className="p-4">
                  <div className="flex gap-1.5 flex-wrap mb-2">
                     <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-border text-primary font-mono">{dummyPrompt.category1}</span>
                     <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-border text-primary font-mono">{dummyPrompt.category2}</span>
                  </div>
                  <div className="text-sm font-bold text-foreground leading-snug mb-3">{dummyPrompt.title}</div>
                  <div className="flex items-center gap-1.5 mb-3 text-[11px]">
                    <span className="text-primary tracking-widest">★★★★★</span>
                    <span className="font-mono font-bold text-foreground">{dummyPrompt.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
                     <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white", dummyPrompt.authorGradient)}>{dummyPrompt.authorAv}</div>
                     <div className="text-[11px] text-muted-foreground flex-1 truncate">{dummyPrompt.author}</div>
                     <div className="text-sm font-bold font-mono text-primary">◈ {dummyPrompt.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. TALL MEDIA */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">2. Tall Media Window</h2>
            <div className="w-[280px]">
              <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 transition-all relative group">
                <div className="h-[180px] relative overflow-hidden bg-secondary">
                  <div className="absolute inset-0 p-4 flex flex-col pt-10">
                     {dummyPrompt.snippet.map((line, i) => (
                       <span key={i} className={cn("font-mono text-xs leading-[1.8] line-clamp-2", i === 0 ? "text-foreground font-semibold mb-2" : "text-muted-foreground")}>{line}</span>
                     ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full font-mono text-[10px] font-bold border border-border bg-primary/10 text-primary backdrop-blur-md z-10">{dummyPrompt.platform}</div>
                </div>
                <div className="p-4">
                  <div className="text-[15px] font-bold text-foreground leading-snug mb-2">{dummyPrompt.title}</div>
                  <div className="flex items-center gap-1.5 mb-3 text-[11px]">
                    <span className="text-primary tracking-widest">★★★★★</span>
                    <span className="font-mono font-bold text-foreground">{dummyPrompt.rating} <span className="text-muted-foreground italic font-sans font-normal">({dummyPrompt.sales})</span></span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                    <div className="flex gap-2">
                       <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-border text-primary font-mono">{dummyPrompt.category1}</span>
                    </div>
                     <div className="text-base font-bold font-mono text-primary">◈ {dummyPrompt.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. SQUARE COMPACT */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">3. Instagram Square 1:1</h2>
            <div className="w-[280px]">
              <div className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all group">
                <div className="h-[280px] relative overflow-hidden bg-secondary flex flex-col justify-end p-4">
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full font-mono text-[10px] font-bold bg-primary/20 text-primary backdrop-blur-md z-10">{dummyPrompt.platform}</div>
                  <div className="absolute inset-0 pt-16 px-4">
                     {dummyPrompt.snippet.map((line, i) => (
                       <span key={i} className={cn("font-mono text-xs leading-[2] block line-clamp-2", i === 0 ? "text-foreground font-semibold mb-2" : "text-muted-foreground")}>{line}</span>
                     ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card via-card/80 to-transparent z-0" />
                  <div className="relative z-10 pt-2">
                    <div className="text-[15px] font-extrabold text-foreground leading-snug mb-1">{dummyPrompt.title}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-medium">
                      <span>{dummyPrompt.author}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      <span className="text-primary font-mono font-bold text-[11px]">★ {dummyPrompt.rating}</span>
                    </div>
                    <div className="text-lg font-black font-mono text-primary">◈ {dummyPrompt.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. WIDE HEADER */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">4. WIDE / HORIZONTAL TOP</h2>
            <div className="w-[320px]">
              <div className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all">
                <div className="flex justify-between items-center p-3 border-b border-border bg-secondary/50">
                  <div className="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-primary/10 text-primary">{dummyPrompt.platform}</div>
                  <div className="text-sm font-bold font-mono text-primary">◈ {dummyPrompt.price}</div>
                </div>
                <div className="h-[90px] p-3 overflow-hidden bg-secondary/20 relative">
                   <div className="font-mono text-[10px] leading-[1.6] text-muted-foreground">
                      <span className="text-foreground font-medium block mb-1">{dummyPrompt.snippet[0]}</span>
                      {dummyPrompt.snippet[1]}
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent" />
                </div>
                <div className="p-4 pt-2">
                  <h3 className="font-bold text-foreground text-base mb-2">{dummyPrompt.title}</h3>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1.5">
                       <span className="text-[9px] bg-muted/50 text-muted-foreground px-2 py-1 rounded-md w-max font-mono uppercase">{dummyPrompt.category1}</span>
                       <div className="flex gap-2 items-center text-[11px] text-muted-foreground mt-1">
                         <span className="text-primary">★ {dummyPrompt.rating}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="text-[10px] text-muted-foreground">{dummyPrompt.authorAv}</div>
                      <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br text-white flex items-center justify-center text-[8px] font-bold", dummyPrompt.authorGradient)}>{dummyPrompt.authorAv}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. CENTERED ALIGNMENT */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">5. Centered Aesthetic</h2>
            <div className="w-[280px]">
              <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all">
                <div className="h-[100px] bg-secondary flex items-center justify-center px-6 relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold text-muted-foreground border border-border">{dummyPrompt.platform}</div>
                  <span className="font-mono text-[10px] text-center text-muted-foreground italic line-clamp-2">{`"${dummyPrompt.snippet[0]}"`}</span>
                </div>
                <div className="p-5 flex flex-col items-center text-center">
                  <div className="text-[10px] text-primary uppercase tracking-[0.15em] font-bold mb-2">{dummyPrompt.category1}</div>
                  <div className="text-base font-bold text-foreground leading-[1.2] mb-3">{dummyPrompt.title}</div>
                  <div className="flex items-center gap-1 text-[12px] mb-4">
                    <span className="text-primary">★ {dummyPrompt.rating}</span>
                    <span className="text-muted-foreground">/ 5.0</span>
                  </div>
                  <div className="w-full flex justify-between items-center pt-4 border-t border-border">
                     <div className="flex items-center gap-2">
                       <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br text-white flex items-center justify-center text-[8px]", dummyPrompt.authorGradient)}>{dummyPrompt.authorAv}</div>
                       <span className="text-[11px] text-muted-foreground">{dummyPrompt.author}</span>
                     </div>
                     <span className="font-mono font-bold text-primary">◈ {dummyPrompt.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. FLOATING INSET MEDIA */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">6. Floating Inset Media</h2>
            <div className="w-[280px]">
              <div className="bg-card border border-border rounded-3xl p-2 cursor-pointer hover:border-primary/40 transition-all">
                <div className="h-[130px] rounded-2xl relative overflow-hidden bg-secondary border border-border">
                  <div className="absolute inset-0 p-3 pt-8">
                     {dummyPrompt.snippet.map((line, i) => (
                       <span key={i} className={cn("font-mono text-[9px] leading-[1.6] line-clamp-1", i === 0 ? "text-foreground font-semibold mb-1" : "text-muted-foreground")}>{line}</span>
                     ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-secondary to-transparent" />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-primary text-primary-foreground shadow-lg">{dummyPrompt.platform}</div>
                </div>
                <div className="px-3 py-4">
                  <div className="text-[13px] font-extrabold text-foreground leading-snug mb-2">{dummyPrompt.title}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-2 mb-4">
                    <span>{dummyPrompt.category1}</span> &middot; 
                    <span className="text-primary font-bold">★ {dummyPrompt.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex gap-2 items-center">
                       <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br text-white flex items-center justify-center text-[9px]", dummyPrompt.authorGradient)}>{dummyPrompt.authorAv}</div>
                     </div>
                     <div className="px-3 py-1 bg-primary/10 text-primary font-mono font-bold text-xs rounded-xl">◈ {dummyPrompt.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. COMPACT SPACING */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">7. Compact / Dashboard</h2>
            <div className="w-[240px]">
              <div className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all">
                <div className="h-[80px] relative overflow-hidden bg-secondary">
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded font-mono text-[8px] bg-primary/10 text-primary">{dummyPrompt.platform}</div>
                  <div className="absolute inset-0 px-2 pt-6">
                     <span className="font-mono text-[8px] leading-[1.4] text-foreground font-semibold line-clamp-3">{dummyPrompt.snippet.join(" ")}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-card to-transparent" />
                </div>
                <div className="p-2.5">
                  <div className="text-[12px] font-bold text-foreground leading-tight mb-1.5 line-clamp-1">{dummyPrompt.title}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                     <span className="text-[8px] px-1.5 rounded bg-muted text-muted-foreground">{dummyPrompt.category2}</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                     <div className="text-[9px] text-primary">★ {dummyPrompt.rating}</div>
                     <div className="text-[10px] font-bold font-mono text-primary">◈ {dummyPrompt.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 8. OVERLAPPING TAGS */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">8. Overlapping Badges</h2>
            <div className="w-[280px]">
              <div className="bg-card border border-border rounded-xl cursor-pointer hover:-translate-y-1 transition-all mt-4">
                <div className="h-[110px] relative bg-secondary rounded-t-xl overflow-visible">
                  {/* Floating badge offset out of the box */}
                  <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow-md">{dummyPrompt.platform}</div>
                  
                  <div className="p-3 pt-6">
                     {dummyPrompt.snippet.map((line, i) => (
                       <span key={i} className={cn("font-mono text-[9px] leading-[1.5] line-clamp-1", i === 0 ? "text-foreground font-semibold mb-1" : "text-muted-foreground")}>{line}</span>
                     ))}
                  </div>
                  <div className="absolute bottom-0 h-20 left-0 right-0 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  
                  {/* Tags overlapping the border between media and body */}
                  <div className="absolute -bottom-3 left-4 flex gap-1">
                     <span className="text-[9px] px-2 py-0.5 rounded border border-border bg-card text-foreground font-mono shadow-sm">{dummyPrompt.category1}</span>
                  </div>
                </div>
                <div className="px-4 pt-6 pb-4">
                  <div className="text-sm font-bold text-foreground leading-snug mb-3">{dummyPrompt.title}</div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <div className={cn("w-4 h-4 rounded-full bg-gradient-to-br flex items-center justify-center text-[6px] text-white", dummyPrompt.authorGradient)}>{dummyPrompt.authorAv}</div>
                        {dummyPrompt.author}
                     </div>
                     <div className="font-mono text-[13px] font-extrabold text-primary">◈ {dummyPrompt.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 9. PROMINENT TITLE */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">9. Typography Focus</h2>
            <div className="w-[280px]">
              <div className="bg-card border border-border rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl transition-all">
                <div className="p-5 pb-3">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-0.5 rounded font-mono text-[9px] border border-border text-muted-foreground">{dummyPrompt.platform}</span>
                    <span className="text-[10px] text-primary font-bold">★ {dummyPrompt.rating}</span>
                  </div>
                  <h3 className="text-[17px] font-black leading-[1.1] mb-2 tracking-tight">{dummyPrompt.title}</h3>
                  <div className="text-[11px] text-muted-foreground font-medium mb-4">{dummyPrompt.author}</div>
                </div>
                <div className="h-[90px] relative bg-secondary mx-2 mb-2 rounded-2xl">
                  <div className="absolute inset-0 p-3 flex flex-col pt-3">
                     <span className="font-mono text-[9px] leading-[1.6] line-clamp-3 text-muted-foreground italic">{`"${dummyPrompt.snippet.join(" ")}"`}</span>
                  </div>
                </div>
                <div className="p-4 pt-2 flex justify-between items-center">
                  <div className="text-[9px] text-muted-foreground uppercase tracking-widest">{dummyPrompt.category1}</div>
                  <div className="text-sm font-black font-mono text-primary">◈ {dummyPrompt.price}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 10. SPLIT FOOTER COMPACT */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">10. Minimal Split Footer</h2>
            <div className="w-[280px]">
              <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all">
                <div className="h-[110px] relative overflow-hidden bg-secondary">
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold border border-border bg-background/50 backdrop-blur text-foreground">{dummyPrompt.platform}</div>
                  <div className="absolute inset-0 p-3 pt-8 pb-0">
                     <span className="font-mono text-[9px] leading-[1.6] text-muted-foreground line-clamp-3">{dummyPrompt.snippet.join(" ")}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent" />
                </div>
                <div className="px-4 py-3">
                  <div className="text-sm font-bold text-foreground line-clamp-2 mb-2">{dummyPrompt.title}</div>
                  <div className="text-[10px] text-muted-foreground mb-3">{dummyPrompt.category1} ◦ {dummyPrompt.category2}</div>
                  
                  <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
                    <div className="col-span-1">
                      <div className="text-[9px] text-muted-foreground mb-0.5 uppercase tracking-wide">Developer</div>
                      <div className="text-[11px] font-bold text-foreground truncate">{dummyPrompt.author}</div>
                    </div>
                    <div className="col-span-1 text-right">
                      <div className="text-[9px] text-muted-foreground mb-0.5 uppercase tracking-wide">License</div>
                      <div className="text-[11px] font-bold font-mono text-primary">◈ {dummyPrompt.price} / Life</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 11. LEFT ACCENT LINE */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">11. Left Neon Accent</h2>
            <div className="w-[280px]">
              <div className="bg-card border-y border-r border-l-4 border-l-primary/80 border-y-border border-r-border rounded-lg overflow-hidden cursor-pointer hover:translate-x-1 hover:shadow-lg transition-all focus:border-l-primary">
                <div className="h-[80px] bg-secondary p-3 flex flex-col justify-end relative">
                   <div className="absolute top-2 right-2 text-[10px] text-primary font-bold">★ {dummyPrompt.rating}</div>
                   <span className="font-mono text-[9px] leading-[1.6] text-muted-foreground line-clamp-2">{`"${dummyPrompt.snippet[0]}"`}</span>
                </div>
                <div className="p-3">
                  <div className="flex gap-1.5 flex-wrap mb-1.5">
                     <span className="text-[8px] bg-primary/10 text-primary uppercase font-bold px-1.5 py-0.5 rounded">{dummyPrompt.platform}</span>
                  </div>
                  <div className="text-xs font-bold text-foreground leading-snug mb-3">{dummyPrompt.title}</div>
                  
                  <div className="flex items-center justify-between mt-auto">
                     <div className="text-[10px] text-muted-foreground flex gap-1 items-center">
                       <div className={cn("w-3.5 h-3.5 rounded-sm bg-gradient-to-br text-white flex items-center justify-center text-[5px]", dummyPrompt.authorGradient)}>{dummyPrompt.authorAv}</div>
                       {dummyPrompt.author}
                     </div>
                     <div className="text-[11px] font-bold font-mono text-foreground">◈ {dummyPrompt.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 12. GHOST BORDER / HUGE PRICE */}
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">12. Ghost / Emphasized Info</h2>
            <div className="w-[280px]">
              <div className="bg-transparent border-2 border-border border-dashed rounded-3xl overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all p-1">
                <div className="rounded-2xl bg-card h-full flex flex-col shadow-sm">
                  <div className="h-[100px] relative overflow-hidden bg-secondary rounded-t-2xl">
                    <div className="absolute inset-0 p-3 pt-4">
                       {dummyPrompt.snippet.map((line, i) => (
                         <span key={i} className={cn("font-mono text-[9px] leading-[1.6] line-clamp-1", i === 0 ? "text-foreground opacity-80" : "text-muted-foreground")}>{line}</span>
                       ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[9px] font-mono border-b border-border pb-0.5">{dummyPrompt.platform}</span>
                       <span className="text-[14px] font-black text-primary font-mono tracking-tighter">◈{dummyPrompt.price}</span>
                    </div>
                    <div className="text-sm font-bold text-foreground line-clamp-2 mb-2">{dummyPrompt.title}</div>
                    
                    <div className="mt-auto flex justify-between items-end">
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <span className="text-primary">★ {dummyPrompt.rating}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium underline decoration-muted-foreground/30 underline-offset-2 hover:decoration-primary">{dummyPrompt.author}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold mb-4 opacity-70 uppercase tracking-widest">13. Custom Replica Design</h2>
            <div className="w-[280px]">
              <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 transition-all relative group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r z-10 from-primary via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="h-[120px] relative overflow-hidden bg-secondary">
                  <div className="absolute inset-0 p-3 flex flex-col pt-8">
                     {dummyPrompt.snippet.map((line, i) => (
                       <span key={i} className={cn("font-mono text-[9px] leading-[1.6] line-clamp-1", i === 0 ? "text-foreground font-semibold mb-1" : "text-muted-foreground")}>{line}</span>
                     ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold border border-border bg-primary/10 text-primary backdrop-blur-md z-10">{dummyPrompt.platform}</div>
                </div>
                <div className="p-4">
                  <div className="flex gap-1.5 flex-wrap mb-2">
                     <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-border text-primary font-mono">{dummyPrompt.category1}</span>
                     <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-border text-primary font-mono">{dummyPrompt.category2}</span>
                  </div>
                  <div className="text-sm font-bold text-foreground leading-snug mb-3">{dummyPrompt.title}</div>
                  <div className="flex items-center gap-1.5 mb-3 text-[11px]">
                    <span className="text-primary tracking-widest">★★★★★</span>
                    <span className="font-mono font-bold text-foreground">{dummyPrompt.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
                     <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white", dummyPrompt.authorGradient)}>{dummyPrompt.authorAv}</div>
                     <div className="text-[11px] text-muted-foreground flex-1 truncate">{dummyPrompt.author}</div>
                     <div className="text-sm font-bold font-mono text-primary">◈ {dummyPrompt.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- REPLICA CARD SECTION --- */}
        <div className="pt-12 mt-12 border-t border-border/60">
          <div className="mb-10 text-center">
            <h2 className="heading-h2 mb-3">Custom Replica Design</h2>
            <p className="body-base">Permanent glass-morphism icons, solid crisp image edges (no fade), and clean spacing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-start">
            <div className="w-full bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:shadow-xl hover:border-purple-500 transition-all duration-300 flex flex-col cursor-pointer group">
              
              {/* ── IMAGE SECTION ── */}
              <div className="h-[200px] w-full relative overflow-hidden bg-slate-100">
                <img 
                  src={dummyPrompt.image} 
                  alt={dummyPrompt.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />

                {/* Top-Left Platform Badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-md">
                  {dummyPrompt.platform}
                </span>

                {/* Top-Right Permanent Glass Icons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openQuickView(dummyPrompt.image); }}
                    className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition-colors shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:text-rose-400 hover:border-rose-400/50 transition-colors shadow-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── CONTENT SECTION ── */}
              <div className="p-3 flex flex-col h-full relative bg-white">
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-1.5 text-[10px]">
                  <span className="text-purple-600 tracking-widest">★★★★★</span>
                  <span className="font-mono font-bold text-slate-900">{dummyPrompt.rating}</span>
                </div>
                
                {/* Title */}
                <div className="text-xs font-bold leading-snug text-slate-900 mb-2 line-clamp-2">
                  {dummyPrompt.title}
                </div>
                
                {/* Categories / Tags */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-50 border border-purple-100/50 text-purple-600 font-bold">
                    {dummyPrompt.category1}
                  </span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-50 border border-purple-100/50 text-purple-600 font-bold">
                    {dummyPrompt.category2}
                  </span>
                </div>
                
                {/* Footer (Author & Price) */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 mt-auto">
                  <div className={cn("w-4 h-4 rounded-full bg-gradient-to-br flex items-center justify-center text-[7px] font-bold text-white shadow-sm", dummyPrompt.authorGradient)}>
                    {dummyPrompt.authorAv}
                  </div>
                  <div className="text-[10px] font-medium text-slate-700 flex-1 truncate">
                    {dummyPrompt.author}
                  </div>
                  <div className="text-xs font-bold font-mono text-purple-600">
                    ◈ {dummyPrompt.price}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* --- IMAGE ONLY VARIATION --- */}
        <div className="pt-12 mt-12 border-t border-border/60">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Image Only Variation</h2>
            <p className="text-muted-foreground">Minimalist design with hover-only icons and no content section.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-start">
            <div className="w-full bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:shadow-xl hover:border-purple-500 transition-all duration-300 flex flex-col cursor-pointer group">
              
              {/* ── IMAGE SECTION ── */}
              <div className="h-[200px] w-full relative overflow-hidden bg-slate-100">
                <img 
                  src={dummyPrompt.image} 
                  alt={dummyPrompt.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />

                {/* Top-Left Platform Badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-md">
                  {dummyPrompt.platform}
                </span>

                {/* Top-Right Glass Icons (Hover Only) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openQuickView(dummyPrompt.image); }}
                    className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition-colors shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:text-rose-400 hover:border-rose-400/50 transition-colors shadow-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 mt-12 border-t border-border/60">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Editorial Theme Cards</h2>
            <p className="text-muted-foreground">
              A tighter 4-card row using the same image-first rhythm as Custom Replica Design, but adapted from your reference style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
            {editorialCards.map((card, index) => (
              <div
                key={card.title}
                className="group bg-card border border-border/70 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/35 transition-all duration-300"
              >
                <div className={cn("relative h-[178px] overflow-hidden bg-gradient-to-br p-4", card.accent)}>
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full border border-white/30 bg-black/45 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-sm">
                    Guide {index + 1}
                  </div>
                  <div className="h-full w-full rounded-[18px] overflow-hidden border border-white/40 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="px-4 pt-4 pb-4 min-h-[182px] flex flex-col bg-card">
                  <div className="flex items-center gap-1.5 mb-3 text-[10px]">
                    <span className="text-primary tracking-[0.28em] font-black">★★★★★</span>
                    <span className="font-mono font-bold text-foreground">{dummyPrompt.rating}</span>
                  </div>

                  <h3 className="text-[18px] leading-[1.08] tracking-tight font-bold text-foreground line-clamp-3">
                    {card.title}
                  </h3>

                  <div className="mt-auto pt-5 flex items-center justify-between gap-3 border-t border-border/60">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white shadow-sm", dummyPrompt.authorGradient)}>
                        {dummyPrompt.authorAv}
                      </div>
                      <div className="text-[10px] font-medium text-muted-foreground truncate">
                        {card.category}
                      </div>
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                      {dummyPrompt.platform}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* --- CUSTOM REPLICA - LARGE TITLE / NO TAGS --- */}
        <div className="pt-12 mt-12 border-t border-border/60">
          <div className="mb-10 text-center">
            <h2 className="heading-h2 mb-3">Custom Replica - Large Title</h2>
            <p className="body-base">A variation with an 18px title and removed category tags for a cleaner typography focus.</p>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-start">
            <div className="w-full bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:shadow-xl hover:border-purple-500 transition-all duration-300 flex flex-col cursor-pointer group">
              
              {/* ── IMAGE SECTION ── */}
              <div className="h-[170px] w-full relative overflow-hidden bg-slate-100">
                <img 
                  src={dummyPrompt.image} 
                  alt={dummyPrompt.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
 
                {/* Top-Left Platform Badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-md">
                  {dummyPrompt.platform}
                </span>
 
                {/* Top-Right Glass Icons (Hover Only) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openQuickView(dummyPrompt.image); }}
                    className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-purple-600 hover:border-purple-500 transition-colors shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:text-rose-400 hover:border-rose-400/50 transition-colors shadow-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
 
              {/* ── CONTENT SECTION ── (Increased proportionate to image reduction) */}
              <div className="p-4 flex-1 flex flex-col relative bg-white">
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2 text-[10px]">
                  <span className="text-purple-600 tracking-widest">★★★★★</span>
                  <span className="font-mono font-bold text-slate-900">{dummyPrompt.rating}</span>
                </div>
                
                {/* Title - 18px per request */}
                <div className="text-[18px] font-bold leading-[1.15] text-slate-900 mb-6 line-clamp-3">
                  {dummyPrompt.title}
                </div>
                
                {/* Footer (Author & Price) */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
                  <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white shadow-sm", dummyPrompt.authorGradient)}>
                    {dummyPrompt.authorAv}
                  </div>
                  <div className="text-[11px] font-medium text-slate-700 flex-1 truncate">
                    {dummyPrompt.author}
                  </div>
                  <div className="text-sm font-bold font-mono text-purple-600">
                    ◈ {dummyPrompt.price}
                  </div>
                </div>
 
              </div>
            </div>
          </div>
        </div>

        {/* --- QUICK VIEW PORTAL (MODAL) --- */}
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
             {/* Backdrop */}
             <div 
               className="absolute inset-0 bg-black/60 backdrop-blur-md"
               onClick={() => setIsQuickViewOpen(false)}
             />
             
             {/* Modal Content */}
             <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                <div className="absolute top-4 right-4 z-10">
                   <button 
                     onClick={() => setIsQuickViewOpen(false)}
                     className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all"
                   >
                     <X className="w-5 h-5" />
                   </button>
                </div>

                <div className="aspect-square w-full sm:aspect-video bg-muted overflow-hidden">
                   <img src={quickViewImage} className="w-full h-full object-cover" alt="Quick View" />
                </div>

                <div className="p-8 border-t border-border">
                   <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-black text-foreground">{dummyPrompt.title}</h3>
                        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold opacity-60 mt-1">Output Verification ◈ Full Quality</p>
                      </div>
                      <div className="text-right">
                         <div className="text-2xl font-black text-primary">◈ {dummyPrompt.price}</div>
                         <div className="text-[10px] font-bold text-muted-foreground uppercase">Instant License</div>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 pt-4">
                      <button className="py-4 bg-secondary font-black rounded-2xl text-[11px] tracking-widest uppercase text-muted-foreground hover:bg-secondary/80 transition-all">Add to Wishlist</button>
                      <button className="py-4 bg-primary font-black rounded-2xl text-[11px] tracking-widest uppercase text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all">Buy Now ◈ {dummyPrompt.price}</button>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
