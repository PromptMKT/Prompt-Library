
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Eye, Heart, X, Quote, Terminal, PlayCircle, Mic, FileText, Globe,
  ImageIcon, Code2, Database, Headphones, Video, Bot, Users, Shapes, Sparkles,
  LayoutDashboard, BrainCircuit, Mic2, Briefcase, Key, Compass, ArrowRight, VenetianMask
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ExplorePromptCardProps = {
  id: string;
  title: string;
  description?: string;
  image: string;
  rating: number;
  usageCount: number;
  tags: string[];
  creator: string;
  price: number;
  category?: string;
  platform?: string;
  mode?: "grid" | "list";
  promptPreview?: string;
};

function withPromptPrefix(rawTitle: string): string {
  const basePrefix = "prompt to";
  const oldPrefix = "prompt to generate";
  const trimmed = rawTitle.trim();
  const lowered = trimmed.toLowerCase();

  if (lowered.startsWith(oldPrefix)) {
    const rest = trimmed.slice(oldPrefix.length).trimStart();
    return rest ? `Prompt to ${rest}` : "Prompt to";
  }

  if (lowered.startsWith(basePrefix)) return trimmed;
  return `Prompt to ${trimmed}`;
}

function creatorInitials(name: string): string {
  return (name || "Unknown").split(" ").map((part) => part.slice(0, 1).toUpperCase()).join("").slice(0, 2);
}

function getCategoryDesign(category: string) {
  const lowered = category.toLowerCase();

  if (lowered.includes("text") || lowered.includes("copy") || lowered.includes("writing") || lowered.includes("email") || lowered.includes("article")) {
    return { type: "text", icon: FileText, color: "text-blue-600 dark:text-blue-400", bgBase: "bg-blue-50 dark:bg-blue-950/30", badgeGradient: "bg-blue-600 dark:bg-blue-700", borderColor: "border-blue-300 dark:border-blue-800" };
  }
  if (lowered.includes("image") || lowered.includes("visual") || lowered.includes("photo")) {
    return { type: "image", icon: ImageIcon, color: "text-purple-600 dark:text-purple-400", bgBase: "bg-purple-50 dark:bg-purple-950/30", badgeGradient: "bg-purple-600 dark:bg-purple-700", borderColor: "border-purple-300 dark:border-purple-800" };
  }
  if (lowered.includes("code") || lowered.includes("technical") || lowered.includes("developer") || lowered.includes("api")) {
    return { type: "code", icon: Code2, color: "text-emerald-500 dark:text-emerald-400", bgBase: "bg-emerald-50 dark:bg-emerald-950/30", badgeGradient: "bg-emerald-600 dark:bg-emerald-700", borderColor: "border-emerald-500 dark:border-emerald-800" };
  }
  if (lowered.includes("data") || lowered.includes("analysis") || lowered.includes("analytics") || lowered.includes("research")) {
    return { type: "data", icon: Database, color: "text-cyan-600 dark:text-cyan-400", bgBase: "bg-cyan-50 dark:bg-cyan-950/30", badgeGradient: "bg-cyan-600 dark:bg-cyan-700", borderColor: "border-cyan-300 dark:border-cyan-800" };
  }
  if (lowered.includes("strategy") || lowered.includes("planning") || lowered.includes("roadmap") || lowered.includes("gtm")) {
    return { type: "strategy", icon: Compass, color: "text-indigo-600 dark:text-indigo-400", bgBase: "bg-indigo-50 dark:bg-indigo-950/30", badgeGradient: "bg-indigo-600 dark:bg-indigo-700", borderColor: "border-indigo-300 dark:border-indigo-800" };
  }
  if (lowered.includes("learning") || lowered.includes("education") || lowered.includes("tutor") || lowered.includes("study")) {
    return { type: "learning", icon: Globe, color: "text-teal-600 dark:text-teal-400", bgBase: "bg-teal-50 dark:bg-teal-950/30", badgeGradient: "bg-teal-600 dark:bg-teal-700", borderColor: "border-teal-300 dark:border-teal-800" };
  }
  if (lowered.includes("audio") || lowered.includes("voice") || lowered.includes("music") || lowered.includes("podcast")) {
    return { type: "audio", icon: Mic, color: "text-amber-500 dark:text-amber-400", bgBase: "bg-amber-50 dark:bg-amber-950/30", badgeGradient: "bg-amber-500 dark:bg-amber-700", borderColor: "border-amber-300 dark:border-amber-800" };
  }
  if (lowered.includes("video") || lowered.includes("reel") || lowered.includes("short") || lowered.includes("youtube")) {
    return { type: "video", icon: PlayCircle, color: "text-rose-500 dark:text-rose-400", bgBase: "bg-rose-50 dark:bg-rose-950/30", badgeGradient: "bg-rose-500 dark:bg-rose-700", borderColor: "border-rose-300 dark:border-rose-800" };
  }
  if (lowered.includes("agent") || lowered.includes("automation") || lowered.includes("workflow") || lowered.includes("tool")) {
    return { type: "agentic", icon: Bot, color: "text-emerald-500 dark:text-emerald-400", bgBase: "bg-emerald-50 dark:bg-emerald-950/30", badgeGradient: "bg-emerald-600 dark:bg-emerald-700", borderColor: "border-emerald-300 dark:border-emerald-800" };
  }
  if (lowered.includes("role") || lowered.includes("persona") || lowered.includes("simulation") || lowered.includes("founder")) {
    return { type: "persona", icon: VenetianMask, color: "text-rose-600 dark:text-rose-400", bgBase: "bg-rose-50 dark:bg-rose-950/30", badgeGradient: "bg-rose-600 dark:bg-rose-700", borderColor: "border-rose-300 dark:border-rose-800" };
  }

  return { type: "domain", icon: Briefcase, color: "text-blue-600 dark:text-blue-400", bgBase: "bg-slate-50 dark:bg-slate-900", badgeGradient: "bg-slate-700 dark:bg-slate-600", borderColor: "border-slate-300 dark:border-slate-700" };
}

function Curtain({ isCurtainOpen, setIsCurtainOpen, promptPreview, hasImage }: any) {
  return (
    <div className={cn("curtain absolute inset-y-0 right-0 w-[100.5%] translate-x-[100%] z-50 flex flex-col transition-transform duration-500",
      hasImage ? "bg-transparent backdrop-blur-none border-transparent shadow-none" : "bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700 shadow-[-10px_0_20px_rgba(0,0,0,0.05)] dark:shadow-[-10px_0_40px_rgba(0,0,0,0.4)]",
      !isCurtainOpen && "group-hover:translate-x-[85%]", isCurtainOpen && "!translate-x-0 is-open")}>

      <div className={cn("peek-trigger absolute inset-y-0 left-0 w-[15%] h-full flex justify-center items-center cursor-pointer bg-gradient-to-r from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300", isCurtainOpen && "opacity-0 pointer-events-none")} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsCurtainOpen(true); }}>
        <button className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center transition-all duration-300 scale-90 -translate-x-1 group-hover:scale-100 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-110 outline-none border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">
          <Eye className="w-4 h-4" />
        </button>
      </div>

      <div className={cn("curtain-content w-full h-full p-6 flex flex-col pointer-events-none pl-[15%] opacity-0 transition-opacity duration-300 delay-100", isCurtainOpen && "opacity-100 pointer-events-auto")}>
        <div className={cn("flex justify-between items-center mb-4 pb-3 h-10 shrink-0", !hasImage && "border-b border-slate-200 dark:border-slate-700")}>
          <span className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5", hasImage ? "text-white/90 drop-shadow-md" : "text-indigo-600 dark:text-indigo-400")}>
            {hasImage ? <ImageIcon className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
            {hasImage ? "Image Preview" : "Details"}
          </span>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsCurtainOpen(false); }} className={cn("w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors pointer-events-auto shrink-0 shadow-sm border border-transparent dark:border-slate-600", hasImage ? "bg-black/40 hover:bg-black/60 text-white/90" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400")}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {!hasImage && (
          <div className="flex-1 w-full text-left font-mono text-[13px] leading-[1.8] text-slate-500 dark:text-slate-400 relative rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100/50 dark:bg-[#0f172a]/60 overflow-hidden shadow-inner flex flex-col">
            <div className="px-5 py-6 flex-1 w-full relative overflow-y-auto styled-scrollbar">
              {promptPreview ? (
                <p className="relative z-10 font-sans text-sm font-semibold text-slate-700 dark:text-slate-300 flex flex-col gap-2 drop-shadow-sm whitespace-pre-wrap">
                  {promptPreview}
                </p>
              ) : (
                <>
                  <div className="animate-pulse space-y-4 absolute inset-x-5">
                    <div className="h-2 w-[85%] bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-2 w-full bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-2 w-[90%] bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-2 w-[60%] bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                  </div>
                  <p className="mt-8 relative z-10 font-sans text-sm font-semibold text-slate-700 dark:text-slate-300 drop-shadow-sm opacity-50">
                    Prompt details unavailable.
                  </p>
                </>
              )}
            </div>
            <div className="w-full bg-white dark:bg-slate-800 px-5 py-3 border-t border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center shrink-0 shadow-sm z-10">
              <span className="font-sans font-bold text-slate-400 cursor-pointer pointer-events-auto hover:text-indigo-500 transition-colors">Expand</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function TextPromptCard({ props, design, displayTitle, isCurtainOpen, setIsCurtainOpen }: any) {
  return (
    <div
      className={cn("group relative w-full max-w-[340px] h-[320px] rounded-2xl bg-[#faf9f6] dark:bg-[#121210] border border-[#e8e6e1] dark:border-[#2a2825] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col font-serif select-none text-left", isCurtainOpen && "curtain-open")}>
      {props.image ? (
        <img src={props.image} alt={displayTitle} className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500",
          isCurtainOpen ? "opacity-100 z-40 mix-blend-normal dark:opacity-100 dark:mix-blend-normal" : "opacity-10 dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen z-0"
        )} />
      ) : null}
      <div
        className="absolute inset-x-0 top-12 bottom-0 bg-[linear-gradient(transparent_27px,#e5e7eb_28px)] dark:bg-[linear-gradient(transparent_27px,#2a2825_28px)] bg-[length:100%_28px] opacity-40 pointer-events-none">
      </div>
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 dark:bg-black/40 ring-1 ring-black/5 dark:ring-white/5 backdrop-blur-md rotate-[-2deg] opacity-70 shadow-sm">
      </div>
      <div className="p-5 flex flex-col h-full relative z-10 w-full shrink-0">
        <div className="flex justify-between items-center mb-5 shrink-0">
          <span
            className="bg-[#ebd9c8] dark:bg-[#3d3329] text-[#8c6b4a] dark:text-[#d3bc9c] font-sans font-bold uppercase tracking-widest text-[9px] px-2.5 py-1 rounded-full border-none">Text
            Generation</span>
          <div className="flex items-center gap-1.5 bg-[#f5e9dc] dark:bg-[#2a2825] px-2 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500 font-sans" />
            <span className="font-sans font-bold text-[10px] text-[#8c6b4a] dark:text-[#d3bc9c]">{props.rating.toFixed(1)}</span>
          </div>
        </div>
        <Quote className="w-8 h-8 text-blue-200 dark:text-blue-900/40 absolute right-4 top-14 opacity-40 -rotate-12 pointer-events-none" />
        <h3
          className="text-[17px] font-black text-[#2c2825] dark:text-[#f4f1eb] leading-[1.2] mb-3 line-clamp-2 relative z-10 pr-4">{displayTitle}</h3>
        <p
          className="text-[13px] text-[#7a746d] dark:text-[#a89f91] line-clamp-3 font-medium flex-1 italic relative z-10 font-sans">{props.description || "A brief description"}</p>
        <div
          className="mt-auto pt-4 flex justify-between items-end font-sans border-t border-transparent dark:border-[#2a2825]/50 shrink-0">
          <div className="flex flex-col">
            <span
              className="text-[9px] font-black uppercase text-[#a89f91] dark:text-[#7a746d] tracking-widest mb-0.5">Creator</span>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold text-[#5c564d] dark:text-[#c4bbb0] truncate max-w-[100px]">{props.creator}</span>
            </div>
          </div>
          <div className="text-right">
            <span
              className="font-mono text-blue-600 dark:text-blue-400 text-[15px] font-black bg-blue-50 dark:bg-blue-900/10 px-2 py-1 rounded">◈ {props.price}</span>
          </div>
        </div>
      </div>
      <Curtain promptPreview={props.promptPreview} isCurtainOpen={isCurtainOpen} setIsCurtainOpen={setIsCurtainOpen} hasImage={!!props.image} />
    </div>
  );
}

function ImageVisualPromptCard({ props, design, displayTitle, isCurtainOpen, setIsCurtainOpen }: any) {
  return (
    <div
      className={cn("group relative w-full max-w-[340px] h-[320px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50 dark:from-indigo-950/20 dark:via-purple-900/10 dark:to-fuchsia-950/20 border border-purple-100 dark:border-purple-900/30 text-left flex flex-col", isCurtainOpen && "curtain-open")}>
      {props.image ? (
        <img src={props.image} alt={displayTitle} className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500",
          isCurtainOpen ? "opacity-100 z-40 mix-blend-normal dark:opacity-100 dark:mix-blend-normal" : "opacity-10 dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen z-0"
        )} />
      ) : null}
      {/* Super subtle pattern overlay */}
      <div
        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 dark:opacity-[0.03] mix-blend-overlay pointer-events-none">
      </div>
      {/* Glows forming a soft palette */}
      <div
        className="absolute -right-10 -top-10 w-40 h-40 bg-fuchsia-300/30 dark:bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none">
      </div>
      <div
        className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-300/30 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none">
      </div>

      <div className="p-6 flex flex-col h-full relative z-10 w-full shrink-0">
        <div className="flex justify-between items-center mb-5 shrink-0 w-full">
          <span
            className="text-[9px] font-black uppercase tracking-widest text-purple-700 dark:text-purple-300 bg-white/60 dark:bg-black/30 backdrop-blur px-2.5 py-1 rounded-full border border-purple-200/50 dark:border-purple-800/50 shadow-sm">Image
            & Visual</span>
          <div
            className="flex items-center gap-1 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full border border-white/40 dark:border-white/5 shadow-sm">
            <Star className="w-2.5 h-2.5 text-purple-500 fill-purple-400" />
            <span
              className="text-[10px] font-bold text-purple-900 dark:text-purple-100 relative top-px">{props.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-[18px] font-black text-slate-800 dark:text-slate-100 leading-tight mb-2 w-full">{displayTitle}</h3>
        <p
          className="text-[13px] text-purple-900/60 dark:text-purple-200/50 font-medium line-clamp-3 leading-relaxed w-full min-h-[60px]">
          [A brief description illustrating the specific aesthetic or parameters this visual prompt
          produces.]</p>

        <div
          className="mt-auto pt-4 flex justify-between items-end border-t border-purple-200/50 dark:border-purple-900/40 w-full shrink-0">
          <div className="flex flex-col">
            <span
              className="text-[9px] font-black uppercase text-purple-600 dark:text-purple-500 tracking-widest mb-0.5">Creator</span>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-black text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{props.creator}</span>
            </div>
          </div>
          <span
            className="text-purple-700 dark:text-purple-300 font-mono font-black bg-white/60 dark:bg-black/40 border border-purple-200/50 dark:border-purple-800/40 px-2 py-1 rounded text-[15px] shadow-sm">◈ {props.price}</span>
        </div>
      </div>
      <Curtain promptPreview={props.promptPreview} isCurtainOpen={isCurtainOpen} setIsCurtainOpen={setIsCurtainOpen} hasImage={!!props.image} />
    </div>
  );
}

function CodeTechnicalPromptCard({ props, design, displayTitle, isCurtainOpen, setIsCurtainOpen }: any) {
  return (
    <div
      className={cn("group relative w-full max-w-[340px] h-[320px] rounded-2xl bg-zinc-50 dark:bg-[#09090b] shadow-sm hover:shadow-emerald-900/20 hover:-translate-y-1 transition-all duration-300 flex flex-col font-mono cursor-pointer overflow-hidden border border-zinc-200 dark:border-[#27272a] text-left", isCurtainOpen && "curtain-open")}>
      {props.image ? (
        <img src={props.image} alt={displayTitle} className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500",
          isCurtainOpen ? "opacity-100 z-40 mix-blend-normal dark:opacity-100 dark:mix-blend-normal" : "opacity-10 dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen z-0"
        )} />
      ) : null}
      <div
        className="h-9 bg-zinc-100 dark:bg-[#18181b] border-b border-zinc-200 dark:border-[#27272a] flex items-center px-4 justify-between shrink-0 relative w-full">
        <div className="flex items-center gap-2 opacity-60 dark:opacity-40">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span
          className="text-[10px] text-zinc-500 tracking-widest uppercase font-bold text-center">Code &
          Technical</span></div>
      </div>
      <div
        className="p-5 flex flex-col h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/30 dark:from-emerald-950/30 via-transparent to-transparent">
        <div className="flex justify-between items-start mb-3">
          <div
            className="text-emerald-600 dark:text-[#10b981] text-[10px] font-bold tracking-widest flex items-center gap-1.5 uppercase bg-emerald-100 dark:bg-[#10b981]/10 px-2 py-0.5 rounded">
            <Code2 className="w-3.5 h-3.5" /> Platform
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 relative top-1">
            <Star className="w-2.5 h-2.5 text-zinc-400 fill-zinc-400" />
            <span className="text-[10px] font-bold">{props.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3
          className="text-zinc-900 dark:text-emerald-50 text-[16px] font-bold leading-snug mb-3 line-clamp-2 w-full">
          <span className="text-emerald-500 mr-2 opacity-70 cursor-text">//</span>[Title of the Technical
          Prompt]
        </h3>
        <div
          className="text-zinc-600 dark:text-zinc-400 text-[11px] font-medium leading-relaxed line-clamp-3 mb-4 opacity-80 pl-4 border-l-2 border-emerald-500/30 dark:border-zinc-800 w-full min-h-[50px]">
          A clear explanation of the code, scripts, or configurations this prompt is structured to
          produce.
        </div>
        <div
          className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex justify-between items-end w-full">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase text-zinc-400 mb-0.5">Maintainer</span>
            <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold">
              <span className="opacity-50">@</span><span className="truncate max-w-[80px]">{props.creator}</span>
            </div>
          </div>
          <div
            className="flex bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2 py-1 rounded text-[15px] border border-zinc-300 dark:border-zinc-700 shadow-sm relative -bottom-1">
            <span className="font-black">◈ {props.price}</span>
          </div>
        </div>
      </div>
      <Curtain promptPreview={props.promptPreview} isCurtainOpen={isCurtainOpen} setIsCurtainOpen={setIsCurtainOpen} hasImage={!!props.image} />
    </div>
  );
}

function DataAnalysisPromptCard({ props, design, displayTitle, isCurtainOpen, setIsCurtainOpen }: any) {
  return (
    <div
      className={cn("group relative w-full max-w-[340px] h-[320px] rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-left hover:shadow-xl hover:-translate-y-1 hover:border-cyan-500/30 dark:hover:border-cyan-500/50 transition-all duration-300", isCurtainOpen && "curtain-open")}>
      {props.image ? (
        <img src={props.image} alt={displayTitle} className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500",
          isCurtainOpen ? "opacity-100 z-40 mix-blend-normal dark:opacity-100 dark:mix-blend-normal" : "opacity-10 dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen z-0"
        )} />
      ) : null}
      {/* Grid bg */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none">
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 dark:bg-cyan-500/10 blur-3xl rounded-full">
      </div>

      <div className="p-5 flex flex-col h-full relative z-10 w-full">
        <div className="flex justify-between items-center mb-5 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/40 border border-cyan-100 dark:border-cyan-800/50 px-2.5 py-1 rounded-full">Data
              & Analysis</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Star className="w-2.5 h-2.5 text-cyan-500 fill-cyan-500" />
            <span className="text-[10px] font-bold">{props.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="text-[17px] font-black text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2">{displayTitle}</h3>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 min-h-[40px]">{props.description || "A brief description"}</p>

        <div className="mt-4 mb-4 flex gap-2 h-8 items-end w-2/3">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-sm relative">
            <div
              className="absolute bottom-0 w-full bg-cyan-300 dark:bg-cyan-700 rounded-sm h-[30%] group-hover:h-[60%] transition-all duration-500">
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-sm relative">
            <div
              className="absolute bottom-0 w-full bg-cyan-400 dark:bg-cyan-600 rounded-sm h-[50%] group-hover:h-[40%] transition-all duration-500">
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-sm relative">
            <div
              className="absolute bottom-0 w-full bg-cyan-500 dark:bg-cyan-500 rounded-sm h-[80%] group-hover:h-[90%] transition-all duration-500">
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-sm relative">
            <div
              className="absolute bottom-0 w-full bg-blue-500 dark:bg-blue-400 rounded-sm h-[40%] group-hover:h-[75%] transition-all duration-500">
            </div>
          </div>
        </div>

        <div
          className="mt-auto pt-4 flex justify-between items-end border-t border-slate-100 dark:border-slate-800 shrink-0 w-full">
          <div className="flex flex-col">
            <span
              className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Analyst</span>
            <span
              className="text-xs font-black text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{props.creator}</span>
          </div>
          <span
            className="font-mono text-cyan-600 dark:text-cyan-400 font-black bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm px-2 py-1 rounded text-[15px]">◈ {props.price}</span>
        </div>
      </div>
      <Curtain promptPreview={props.promptPreview} isCurtainOpen={isCurtainOpen} setIsCurtainOpen={setIsCurtainOpen} hasImage={!!props.image} />
    </div>
  );
}

function StrategyPlanningPromptCard({ props, design, displayTitle, isCurtainOpen, setIsCurtainOpen }: any) {
  return (
    <div
      className={cn("group relative w-full max-w-[340px] h-[320px] rounded-2xl bg-gradient-to-br from-indigo-50/50 to-white dark:from-[#0f172a] dark:to-[#1e293b] border border-indigo-100 dark:border-indigo-900/40 shadow-sm hover:shadow-xl hover:shadow-indigo-900/10 dark:hover:shadow-indigo-900/30 hover:-translate-y-1 transition-all duration-300 flex flex-col text-left overflow-hidden", isCurtainOpen && "curtain-open")}>
      {props.image ? (
        <img src={props.image} alt={displayTitle} className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500",
          isCurtainOpen ? "opacity-100 z-40 mix-blend-normal dark:opacity-100 dark:mix-blend-normal" : "opacity-10 dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen z-0"
        )} />
      ) : null}
      <div
        className="absolute top-0 py-6 px-1 rounded-full right-6 w-1 h-[80%] bg-indigo-100/50 dark:bg-indigo-900/20 pointer-events-none transition-transform duration-700 flex flex-col justify-between items-center z-0">
        <div
          className="w-2 h-2 rounded-full border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-900 relative">
        </div>
        <div
          className="w-2 h-2 rounded-full bg-indigo-500 mx-auto relative group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(99,102,241,0.5)]">
        </div>
        <div
          className="w-2 h-2 rounded-full border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-900 relative">
        </div>
      </div>
      <div className="p-6 flex flex-col h-full relative z-10 w-full pr-12">
        <div className="flex justify-between items-center w-full mb-4 shrink-0">
          <span
            className="inline-flex w-fit text-[9px] uppercase tracking-widest font-black px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">Strategy
            & Planning</span>
          <div
            className="flex items-center gap-1 bg-white/50 dark:bg-black/20 rounded-full px-1.5 py-0.5 border border-indigo-100/50 dark:border-indigo-900/30">
            <Star className="w-2 h-2 text-indigo-500 fill-indigo-500" />
            <span className="text-[9px] font-bold text-slate-500">{props.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="text-[17px] font-black text-slate-900 dark:text-slate-100 leading-tight mb-2 w-[110%]">{displayTitle}</h3>
        <p className="text-[13px] text-slate-600 dark:text-slate-400 line-clamp-3 font-medium min-h-[60px]">
          [Description defining the long-term plan, roadmap, or operational structure this prompt
          outputs.]</p>
        <div
          className="mt-auto pt-4 border-t border-indigo-100 dark:border-indigo-900/50 w-[110%] flex justify-between items-end shrink-0">
          <div className="flex flex-col">
            <span
              className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-0.5">Strategist</span>
            <span
              className="text-xs font-black text-slate-700 dark:text-slate-300 truncate max-w-[80px]">{props.creator}</span>
          </div>
          <span
            className="font-mono text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded text-[15px] font-black border border-indigo-200 dark:border-indigo-800">◈ {props.price}</span>
        </div>
      </div>
      <Curtain promptPreview={props.promptPreview} isCurtainOpen={isCurtainOpen} setIsCurtainOpen={setIsCurtainOpen} hasImage={!!props.image} />
    </div>
  );
}

function LearningEducationPromptCard({ props, design, displayTitle, isCurtainOpen, setIsCurtainOpen }: any) {
  return (
    <div
      className={cn("group relative w-full max-w-[340px] h-[320px] rounded-2xl bg-[#fdfaf5] dark:bg-[#111816] border border-[#e2e8f0] dark:border-[#1e2e2b] shadow-sm hover:shadow-xl hover:shadow-teal-900/10 dark:hover:shadow-teal-900/30 hover:-translate-y-1 transition-all duration-300 flex flex-col text-left overflow-hidden", isCurtainOpen && "curtain-open")}>
      {props.image ? (
        <img src={props.image} alt={displayTitle} className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500",
          isCurtainOpen ? "opacity-100 z-40 mix-blend-normal dark:opacity-100 dark:mix-blend-normal" : "opacity-10 dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen z-0"
        )} />
      ) : null}
      <div
        className="absolute top-0 right-4 w-6 h-12 bg-teal-500/10 dark:bg-teal-500/5 rounded-b border-x border-b border-teal-500/20 group-hover:h-16 transition-all duration-500 flex justify-center items-end pb-2 overflow-hidden shadow-inner">
        <div className="w-2 h-2 rounded-full bg-teal-600/50 dark:bg-teal-400/50"></div>
      </div>
      <div className="p-6 flex flex-col h-full relative z-10 w-full shrink-0">
        <div className="flex justify-between items-center mb-4 shrink-0 w-[85%]">
          <span
            className="text-[9px] uppercase tracking-widest font-black text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded border border-teal-100 dark:border-teal-800">Learning
            & Edu</span>
          <div className="flex items-center gap-1">
            <Star className="w-2.5 h-2.5 text-teal-500 fill-teal-500" />
            <span className="text-[10px] font-bold text-slate-500 relative top-px">{props.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3
          className="text-[18px] font-black font-serif text-[#2c3330] dark:text-[#ebf2f0] leading-snug mb-2 pr-4 w-full">{displayTitle}</h3>
        <p
          className="text-[13px] text-[#5c6e68] dark:text-[#a0b0ab] leading-relaxed line-clamp-3 w-full font-medium min-h-[60px]">{props.description || "A brief description"}</p>
        <div
          className="mt-auto flex justify-between items-end border-t border-[#e2e8f0] dark:border-[#1e2e2b] pt-4 w-full shrink-0">
          <div className="flex flex-col">
            <span
              className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-0.5">Educator</span>
            <span
              className="text-xs font-black text-teal-900 dark:text-teal-100 truncate max-w-[100px]">{props.creator}</span>
          </div>
          <span
            className="font-mono text-[15px] font-black text-teal-600 dark:text-teal-400 bg-slate-100 dark:bg-[#1a2422] px-2 py-1 rounded shadow-sm border border-[#e2e8f0] dark:border-[#2a3b37]">◈ {props.price}</span>
        </div>
      </div>
      <Curtain promptPreview={props.promptPreview} isCurtainOpen={isCurtainOpen} setIsCurtainOpen={setIsCurtainOpen} hasImage={!!props.image} />
    </div>
  );
}

function AudioVoicePromptCard({ props, design, displayTitle, isCurtainOpen, setIsCurtainOpen }: any) {
  return (
    <div
      className={cn("group relative w-full max-w-[340px] h-[320px] rounded-3xl bg-amber-50 dark:bg-amber-950/20 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden transition-all duration-500 border border-amber-200/50 dark:border-amber-900/30 text-left flex flex-col", isCurtainOpen && "curtain-open")}>
      {props.image ? (
        <img src={props.image} alt={displayTitle} className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500",
          isCurtainOpen ? "opacity-100 z-40 mix-blend-normal dark:opacity-100 dark:mix-blend-normal" : "opacity-10 dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen z-0"
        )} />
      ) : null}
      <div
        className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-300/40 dark:from-amber-600/20 via-amber-200/20 dark:via-amber-800/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70 inset-0 pointer-events-none">
      </div>
      <div className="p-6 flex flex-col h-full relative z-10 w-full shrink-0">
        <div className="flex justify-between items-start mb-5 w-full shrink-0">
          <span
            className="bg-white/80 dark:bg-black/40 backdrop-blur-md text-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-800/50 px-2.5 py-1 rounded-full uppercase text-[9px] font-black tracking-widest shadow-sm">Audio
            & Voice</span>
          <div
            className="flex items-center gap-1 bg-amber-100/50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
            <Star className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-100">{props.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3
          className="text-[18px] font-black text-amber-950 dark:text-amber-50 mb-2 line-clamp-2 leading-tight tracking-tight">{displayTitle}</h3>
        <p
          className="text-amber-800/80 dark:text-amber-200/60 text-[13px] font-semibold line-clamp-2 min-h-[40px] w-full">{props.description || "A brief description"}</p>

        <div
          className="mt-auto mb-4 flex items-end justify-between h-8 w-[80%] opacity-60 dark:opacity-40 gap-1 shrink-0">
          <div className="flex-1 audio-bar bg-gradient-to-t from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-600 rounded-sm"
            style={{ "height": "40%", "animationDelay": "0.1s" }}></div>
          <div className="flex-1 audio-bar bg-gradient-to-t from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-600 rounded-sm"
            style={{ "height": "70%", "animationDelay": "0.2s" }}></div>
          <div className="flex-1 audio-bar bg-gradient-to-t from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-600 rounded-sm"
            style={{ "height": "30%", "animationDelay": "0.3s" }}></div>
          <div className="flex-1 audio-bar bg-gradient-to-t from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-600 rounded-sm"
            style={{ "height": "90%", "animationDelay": "0.4s" }}></div>
          <div className="flex-1 audio-bar bg-gradient-to-t from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-600 rounded-sm"
            style={{ "height": "50%", "animationDelay": "0.5s" }}></div>
        </div>

        <div
          className="flex justify-between items-end pt-4 border-t border-amber-200/70 dark:border-amber-900/50 w-full shrink-0">
          <div className="flex flex-col">
            <span
              className="text-[9px] font-black text-amber-700/60 dark:text-amber-300/50 uppercase tracking-widest mb-0.5">Sound
              Designer</span>
            <span
              className="text-xs font-black text-amber-950 dark:text-amber-100 truncate max-w-[100px]">{props.creator}</span>
          </div>
          <span
            className="font-mono text-orange-600 dark:text-orange-400 font-black text-[15px] bg-white/50 dark:bg-black/50 px-2 py-1 rounded shadow-sm border border-amber-200/50 dark:border-amber-900/30">◈ {props.price}</span>
        </div>
      </div>
      <Curtain promptPreview={props.promptPreview} isCurtainOpen={isCurtainOpen} setIsCurtainOpen={setIsCurtainOpen} hasImage={!!props.image} />
    </div>
  );
}

function AgenticWorkflowPromptCard({ props, design, displayTitle, isCurtainOpen, setIsCurtainOpen }: any) {
  return (
    <div
      className={cn("group relative w-full max-w-[340px] h-[320px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 dark:hover:shadow-emerald-900/20 hover:-translate-y-1 transition-all duration-300 flex flex-col text-left overflow-hidden", isCurtainOpen && "curtain-open")}>
      {props.image ? (
        <img src={props.image} alt={displayTitle} className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500",
          isCurtainOpen ? "opacity-100 z-40 mix-blend-normal dark:opacity-100 dark:mix-blend-normal" : "opacity-10 dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen z-0"
        )} />
      ) : null}
      <div className="p-6 flex flex-col h-full relative z-10 w-full">
        <div className="flex justify-between items-center mb-5 shrink-0 w-full">
          <span
            className="text-emerald-700 dark:text-emerald-400 font-bold tracking-widest uppercase text-[9px] border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded w-fit">Agentic
            & Workflow</span>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Star className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />
            <span
              className="text-[10px] font-bold text-slate-700 dark:text-slate-300 relative top-px">{props.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="text-[17px] font-black text-slate-900 dark:text-white leading-tight mb-2 w-full">[Title
          for Multi-Step Prompt]</h3>
        <p
          className="text-[13px] text-slate-500 dark:text-slate-400 font-mono line-clamp-2 w-full min-h-[40px] opacity-80">{props.description || "A brief description"}</p>

        <div
          className="mt-[15px] space-y-2 shrink-0 border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-950/40 rounded-lg p-3 w-full shadow-inner relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20 pointer-events-none"
            viewBox="0 0 100 40" preserveAspectRatio="none">
            <line x1="10" y1="20" x2="90" y2="20" className="stroke-emerald-500 pipeline-dash"
              strokeWidth="2" />
          </svg>
          <div
            className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 font-mono uppercase font-black relative z-10">
            <span
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded shadow-sm relative text-emerald-700 dark:text-emerald-300">
              <div
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 blur-[2px] shadow-[0_0_5px_rgba(52,211,153,0.5)]">
              </div>[Step 1]
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded shadow-sm relative">[Step
              2]</span>
            <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded shadow-sm relative">[Step
              3]</span>
          </div>
        </div>

        <div
          className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 w-full flex justify-between items-end shrink-0">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase text-slate-500 mb-0.5">Architect</span>
            <span
              className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">{props.creator}</span>
          </div>
          <span
            className="font-mono font-black text-[15px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2 py-1 rounded shadow-sm">◈ {props.price}</span>
        </div>
      </div>
      <Curtain promptPreview={props.promptPreview} isCurtainOpen={isCurtainOpen} setIsCurtainOpen={setIsCurtainOpen} hasImage={!!props.image} />
    </div>
  );
}

function RolePersonaPromptCard({ props, design, displayTitle, isCurtainOpen, setIsCurtainOpen }: any) {
  return (
    <div
      className={cn("group relative w-full max-w-[340px] h-[320px] rounded-[1.25rem] bg-rose-50 dark:bg-[#1a1114] border border-rose-200 dark:border-rose-950/50 shadow-sm hover:shadow-xl hover:shadow-rose-900/20 hover:-translate-y-1 transition-all duration-300 flex flex-col text-left overflow-hidden", isCurtainOpen && "curtain-open")}>
      {props.image ? (
        <img src={props.image} alt={displayTitle} className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500",
          isCurtainOpen ? "opacity-100 z-40 mix-blend-normal dark:opacity-100 dark:mix-blend-normal" : "opacity-10 dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen z-0"
        )} />
      ) : null}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 mix-blend-multiply dark:mix-blend-overlay pointer-events-none"
        style={{ "backgroundImage": "repeating-linear-gradient(45deg, #e11d48 0, #e11d48 1px, transparent 1px, transparent 16px)" }}>
      </div>
      <div className="p-6 flex flex-col h-full relative z-10 w-full shrink-0">
        <div className="flex justify-between items-center w-full mb-6 shrink-0">
          <span
            className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-500 px-3 py-1 bg-white/50 dark:bg-black/50 backdrop-blur rounded-full border border-rose-200/50 dark:border-rose-900/50 shadow-sm">Role
            & Persona</span>
          <VenetianMask className="w-6 h-6 text-rose-300 dark:text-rose-800 group-hover:scale-110 transition-transform" />
        </div>
        <h3 className="text-[17px] font-black text-slate-950 dark:text-rose-100 leading-tight mb-2 w-full">{displayTitle}</h3>
        <p
          className="text-[13px] text-rose-900/70 dark:text-rose-200/60 font-medium leading-relaxed italic border-l-2 border-rose-300 dark:border-rose-800 pl-3 w-full min-h-[50px]">
          "[A brief description highlighting the constraints, backstory, and behaviors of the simulated
          persona.]"</p>

        <div
          className="mt-auto w-full pt-4 shrink-0 flex items-end justify-between border-t border-rose-200/50 dark:border-rose-900/50">
          <div className="flex flex-col">
            <span
              className="text-[9px] font-black uppercase tracking-widest text-rose-500 dark:text-rose-800 mb-0.5">Creator</span>
            <div className="flex items-center gap-1 text-slate-500">
              <Star className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-300">{props.rating.toFixed(1)}</span>
              <span className="mx-1 opacity-50 dark:text-slate-500 text-slate-300">•</span>
              <span
                className="text-xs font-black text-slate-800 dark:text-slate-300 truncate max-w-[60px]">{props.creator}</span>
            </div>
          </div>
          <span
            className="font-mono text-rose-600 dark:text-rose-400 font-black text-[15px] bg-white/50 dark:bg-black/50 px-2 py-1 rounded border border-rose-200/30 dark:border-rose-900/30 shadow-sm">◈ {props.price}</span>
        </div>
      </div>
      <Curtain promptPreview={props.promptPreview} isCurtainOpen={isCurtainOpen} setIsCurtainOpen={setIsCurtainOpen} hasImage={!!props.image} />
    </div>
  );
}

function DomainSpecificPromptCard({ props, design, displayTitle, isCurtainOpen, setIsCurtainOpen }: any) {
  return (
    <div
      className={cn("group relative w-full max-w-[340px] h-[320px] rounded bg-white dark:bg-[#070b14] border-t-4 border-t-blue-800 dark:border-t-blue-700 border-x border-b border-slate-200 dark:border-[#1e293b] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left overflow-hidden flex flex-col", isCurtainOpen && "curtain-open")}>
      {props.image ? (
        <img src={props.image} alt={displayTitle} className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500",
          isCurtainOpen ? "opacity-100 z-40 mix-blend-normal dark:opacity-100 dark:mix-blend-normal" : "opacity-10 dark:opacity-[0.05] mix-blend-multiply dark:mix-blend-screen z-0"
        )} />
      ) : null}
      <div
        className="p-6 flex flex-col h-full relative z-10 w-full bg-[linear-gradient(135deg,transparent_90px,rgba(30,58,138,0.03)_90px)]">
        <div className="flex justify-between items-start mb-5">
          <span
            className="text-[10px] font-mono tracking-widest text-blue-800 dark:text-blue-500 uppercase font-black bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-100 dark:border-blue-900/50">Domain-Specific</span>
          <div className="flex items-center gap-1 text-slate-500">
            <Star className="w-2h-2 text-slate-400 fill-slate-400" />
            <span
              className="text-[10px] font-bold text-slate-600 dark:text-slate-400 relative top-px">{props.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3
          className="text-[18px] font-serif font-black text-slate-900 dark:text-white leading-tight mb-3 w-full">{displayTitle}</h3>
        <p
          className="text-[13px] font-medium text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed w-full min-h-[60px]">
          [Description focusing on industry compliance, terminology, and structural standards this prompt
          ensures.]</p>

        <div
          className="mt-auto pt-4 w-full shrink-0 flex justify-between items-end border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-0.5 text-slate-500">
            <span className="text-[9px] uppercase tracking-widest font-black">Certified Provider</span>
            <span
              className="text-[12px] font-sans font-bold text-slate-800 dark:text-slate-300 truncate max-w-[100px]">{props.creator}</span>
          </div>
          <span
            className="font-mono font-black text-[15px] text-white bg-blue-800 dark:bg-blue-700 px-2 py-1 rounded shadow-sm">◈ {props.price}</span>
        </div>
      </div>
      <Curtain promptPreview={props.promptPreview} isCurtainOpen={isCurtainOpen} setIsCurtainOpen={setIsCurtainOpen} hasImage={!!props.image} />
    </div>
  );
}


export function ExplorePromptCard(props: ExplorePromptCardProps) {
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);

  const {
    id, title, description, image, rating, usageCount, tags, creator,
    price, category = "Prompt", platform = "AI", mode = "grid", promptPreview
  } = props;

  const displayTitle = withPromptPrefix(title);
  const listDescription = (description || title || "Untitled prompt").trim();
  const design = getCategoryDesign(category || tags?.[0] || "");
  const IconComponent = design.icon;

  if (mode === "list") {
    return (
      <motion.article transition={{ duration: 0.2, ease: "easeOut" }} className="w-full">
        <Link href={`/prompt/${id}`} className="block w-full py-5 hover:bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_180px_160px] gap-3 md:gap-6 items-start text-left">
            <div className="min-w-0 flex items-start gap-4">
              <div className={cn("w-12 h-12 shrink-0 rounded-xl flex items-center justify-center border shadow-sm dark:border-border/30", design.bgBase, design.borderColor)}>
                <IconComponent className={cn("w-6 h-6", design.color)} />
              </div>
              <p className="text-[15px] md:text-[16px] leading-6 font-bold text-foreground truncate pt-0.5">{listDescription}</p>
            </div>
            <div className="min-w-0 flex flex-col justify-center h-12">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold md:hidden mb-1">Category</p>
              <div className="flex items-center gap-1.5">
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase text-white shadow-sm", design.badgeGradient)}>
                  {category || tags?.[0] || "Prompt"}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex flex-col justify-center h-12">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold md:hidden mb-1">Product</p>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-muted border border-slate-200 dark:border-border text-slate-700 dark:text-foreground text-[10px] font-black tracking-wider uppercase shadow-sm">
                  {platform || "AI"}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  const cardProps = { props, design, displayTitle, isCurtainOpen, setIsCurtainOpen };

  return (
    <motion.div whileHover={{ y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="w-full relative">
      <Link href={`/prompt/${id}`} className="block w-full h-full" onClick={(e) => {
        if (isCurtainOpen) {
          e.preventDefault();
        }
      }}>
        {design.type === "text" && <TextPromptCard {...cardProps} />}
        {design.type === "image" && <ImageVisualPromptCard {...cardProps} />}
        {design.type === "code" && <CodeTechnicalPromptCard {...cardProps} />}
        {design.type === "data" && <DataAnalysisPromptCard {...cardProps} />}
        {design.type === "strategy" && <StrategyPlanningPromptCard {...cardProps} />}
        {design.type === "learning" && <LearningEducationPromptCard {...cardProps} />}
        {design.type === "audio" && <AudioVoicePromptCard {...cardProps} />}
        {design.type === "agentic" && <AgenticWorkflowPromptCard {...cardProps} />}
        {design.type === "persona" && <RolePersonaPromptCard {...cardProps} />}
        {design.type === "domain" && <DomainSpecificPromptCard {...cardProps} />}
      </Link>
    </motion.div>
  );
}
