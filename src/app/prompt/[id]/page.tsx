"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { CheckCircle, Flame, Image as ImageIcon, Type, Code2, Database, ListTree, Bot, Video, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PromptHeader } from "./components/PromptHeader";
import { ImageGallery } from "./components/ImageGallery";
import { LogicEngine } from "./components/LogicEngine";
import { PurchaseSidebar } from "./components/PurchaseSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { PromptController } from "@/backend/controllers/PromptController";
import { UserController } from "@/backend/controllers/UserController";
import { type PromptItem } from "@/backend/models/Prompt"; // I'll use the type defined in the file for now if it's there. Actually, I'll stick to the type in-file for now but use the controllers.
import { supabase } from "@/lib/supabase"; // Kept for other possible direct uses if any (check later)
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  detectPreviewType,
  TextOutput,
  ImageOutput,
  CodeOutput,
  ConversationalOutput,
  AudioOutput,
  VideoOutput,
  StructuredDataOutput,
  ToolCallOutput,
  MultiStepOutput,
  MultipleOutputs,
} from "./components/output-previews";

// PromptItem is now imported from @/backend/models/Prompt


const OUTPUT_TYPES = [
  { 
    id: "Image / Visual Output", icon: ImageIcon, color: "text-emerald-500",
    popup: {
      definition: "Generates photorealistic concepts, art, and visual representations.",
      checks: ["Prompt-to-Image Generation", "Maintains Stylistic Rules", "Requires visual capabilities"],
      models: "Midjourney v6, FLUX, DALL-E 3"
    } 
  },
  { 
    id: "Text Output", icon: Type, color: "text-blue-500",
    popup: {
      definition: "Generates human-readable sentences, formatted markdown, and copy-paste ready documentation.",
      checks: ["Formatted Markdown", "Ideal for emails, reports & copy", "0 Custom parsing needed"],
      models: "Claude 3.5 Sonnet, ChatGPT-4o, Gemini 1.5 Pro"
    } 
  },
  { 
    id: "Code Output", icon: Code2, color: "text-indigo-500",
    popup: {
      definition: "Generates production-ready scripts, components, or infrastructure-as-code.",
      checks: ["Formatted Codeblocks", "Syntax-checked Logic", "Inline Code Comments"],
      models: "Claude 3.7 Sonnet, GPT-4o, Gemini 1.5 Pro"
    } 
  },
  { 
    id: "Structured Data", icon: Database, color: "text-orange-500",
    popup: {
      definition: "Generates strict data schemas like JSON, YAML, or CSVs for API payloads or databases.",
      checks: ["Strict Formatting", "No Conversational Fillers", "Schema Validation"],
      models: "Claude 3.5 Sonnet, GPT-4o-mini"
    } 
  },
  { 
    id: "Multi-step / Chain", icon: ListTree, color: "text-purple-500",
    popup: {
      definition: "A series of sequential reasoning steps feeding into each other.",
      checks: ["Chain-of-Thought", "Multi-prompt chaining", "Complex Reasoning"],
      models: "OpenAI o1, Claude 3.5 Sonnet"
    } 
  },
  { 
    id: "Agent / System Prompt", icon: Bot, color: "text-amber-500",
    popup: {
      definition: "A robust reasoning prompt built for autonomous software loops.",
      checks: ["JSON Tool Calls", "Chain-of-Thought Reasoning", "Strict Output Schemas"],
      models: "Claude 3.7 Tool Use, OpenAI o1, GPT-4o"
    } 
  },
  { 
    id: "Audio / Video", icon: Video, color: "text-rose-500",
    popup: {
      definition: "Generates scripts, vocal parameters, or timeline-ready storyboards for generation.",
      checks: ["Rich Media Blueprints", "Voice Settings & Pitch", "Shot Transitions"],
      models: "Runway Gen-3, Sora, ElevenLabs"
    } 
  },
];

function OutputTypeBar({ prompt }: { prompt: PromptItem }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const getMappedOutputType = (p: PromptItem): string => {
    const rawCategory = (p.category || "").toLowerCase();
    const rawType = (p.outputType || "").toLowerCase();
    const text = (p.promptText || p.tagline || p.title || "").toLowerCase();

    if (rawType.includes("image") || rawType.includes("visual")) return "Image / Visual Output";
    if (rawType.includes("video") || rawType.includes("audio") || rawType.includes("film") || rawType.includes("music")) return "Audio / Video";
    if (rawType.includes("code")) return "Code Output";
    if (rawType.includes("json") || rawType.includes("yaml") || rawType.includes("csv") || rawType.includes("structured") || rawType.includes("data") || rawType.includes("tool") || rawType.includes("function")) return "Structured Data";
    if (rawType.includes("agent") || rawType.includes("autonomous")) return "Agent / System Prompt";
    if (rawType.includes("step") || rawType.includes("chain")) return "Multi-step / Chain";
    if (rawType.includes("text") || rawType.includes("copy") || rawType.includes("long-form") || rawType.includes("short copy")) return "Text Output";

    if (rawCategory.includes("image") || text.includes("image") || text.includes("generator") && text.includes("art")) return "Image / Visual Output";
    if (rawCategory.includes("video") || rawCategory.includes("audio") || text.includes("video") || text.includes("audio") || text.includes("podcast")) return "Audio / Video";
    if (rawCategory.includes("code") || text.includes("react") || text.includes("python") || text.includes("generate code") || text.includes("api integration")) return "Code Output";
    if (rawCategory.includes("agent") || text.includes("agent") || text.includes("autonomous") || text.includes("multi-step workflow")) return "Agent / System Prompt";
    if (rawCategory.includes("data") || text.includes("json") || text.includes("csv") || text.includes("schema") || text.includes("database") || text.includes("structured format")) return "Structured Data";
    if (text.includes("chain") || text.includes("step-by-step")) return "Multi-step / Chain";
    if (rawCategory.includes("text") || rawCategory.includes("copy") || rawCategory.includes("role") || text.includes("write") || text.includes("email") || text.includes("draft") || text.includes("report")) return "Text Output";

    return "Text Output";
  };

  const activeType = getMappedOutputType(prompt);
  const activeTypeData = OUTPUT_TYPES.find(t => t.id === activeType) || OUTPUT_TYPES[1];

  return (
    <div className="relative flex items-center gap-3 overflow-visible pb-6 mb-2">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
        Prompt Type:
      </span>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
        {OUTPUT_TYPES.map((type) => {
          const isActive = type.id === activeType;
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              onClick={() => isActive && setIsPopoverOpen(!isPopoverOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 cursor-pointer hover:bg-primary/90 hover:scale-[1.02] transform duration-200"
                  : "bg-card text-muted-foreground border-border/40"
                }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary-foreground" : type.color}`} />
              {type.id}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {isPopoverOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopoverOpen(false)}
              className="fixed inset-0 z-40 bg-black/5"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className="fixed top-[42%] left-1/2 -translate-x-1/2 md:-ml-42.5 -translate-y-1/2 z-100 w-[90%] max-w-sm bg-card border border-border/60 shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="p-4 bg-muted/40 border-b border-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-md bg-background shadow-xs`}>
                    <activeTypeData.icon className={`w-4 h-4 ${activeTypeData.color}`} />
                  </div>
                  <h4 className="font-bold text-base text-foreground">{activeTypeData.id}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeTypeData.popup?.definition}
                </p>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">What you receive</h5>
                  <ul className="space-y-2">
                    {activeTypeData.popup?.checks.map((check, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {check}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
                  <h5 className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">Recommended Models</h5>
                  <p className="text-xs font-semibold text-foreground">
                    {activeTypeData.popup?.models}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Removed redundant mapping and fallback functions; logic moved to PromptController.

export default function PromptDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [prompt, setPrompt] = useState<PromptItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState("prompt");
  const { user } = useAuth();

  const [relatedPrompts, setRelatedPrompts] = useState<PromptItem[]>([]);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const data = await PromptController.getPromptPageData(params.id, user?.id);
        if (data) {
          setPrompt(data.prompt as any);
          setRelatedPrompts(data.related as any);
          setIsPurchased(data.isPurchased);
        }
      } catch (err) {
        console.error("Error loading prompt details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [params.id, user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!prompt) {
    return null;
  }

  const handlePurchase = async () => {
    if (!isAuthenticated || !user) {
      router.push(`/sign-in?next=${encodeURIComponent(`/prompt/${params.id}`)}`);
      return;
    }

    if (isPurchasing) return;
    setIsPurchasing(true);

    try {
      // Record purchase in database
      const { error } = await supabase
        .from('purchases')
        .insert([{
          user_id: user.id,
          prompt_id: params.id,
          amount_paid: prompt?.price || 0,
          currency: 'USD',
          status: 'completed'
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation (already purchased)
           setIsPurchased(true);
           toast.success("You already own this prompt!");
           return;
        }
        throw error;
      }

      setIsPurchased(true);
      toast.success("Purchase successful! Content unlocked.");
    } catch (err: any) {
      console.error("Purchase error:", err);
      toast.error("Failed to complete purchase. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-300 mx-auto pt-8 pb-32 md:pb-16 px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <OutputTypeBar prompt={prompt} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start mt-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="backdrop-blur-md bg-card/60 border border-white/10 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/5">
              <ImageGallery images={prompt.images} platform={prompt.platform} category={prompt.category} />
            </div>

            <div className="flex flex-wrap gap-2 py-4">
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 font-mono text-[11px] rounded-full px-3 py-1.5 transition-all">
                {prompt.platform}
              </Badge>
              <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20 font-mono text-[11px] rounded-full px-3 py-1.5 transition-all">
                {prompt.category}
              </Badge>
              <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 font-mono text-[11px] rounded-full px-3 py-1.5 transition-all">
                Community
              </Badge>
              <Badge className="group relative overflow-visible bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 font-mono text-[11px] rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all">
                <CheckCircle className="w-3 h-3" /> Verified Output
              </Badge>
              <Badge className="group relative overflow-visible bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border-orange-500/20 font-mono text-[11px] rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all">
                <Flame className="w-3 h-3" /> Trending
              </Badge>
            </div>

            <div className="py-2">
              <PromptHeader platform={prompt.platform} category={prompt.category} title={prompt.title} tagline={prompt.tagline} />
            </div>

            <div className="flex items-center gap-6 mb-8 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg tracking-tighter font-serif">
                  {"★".repeat(Math.round(prompt.rating || 5)) + "☆".repeat(5 - Math.round(prompt.rating || 5))}
                </span>
                <span className="font-extrabold text-lg text-foreground mt-0.5">{prompt.rating}</span>
                <span className="text-muted-foreground text-sm font-medium mt-0.5">({prompt.review_count || 0})</span>
              </div>
              <div className="h-4 w-px bg-border/60" />
              <span className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                <span className="p-1 px-2 rounded-md bg-secondary/50 text-foreground font-mono text-xs">◈ SAVED {prompt.sales || 0} TIMES</span>
              </span>
            </div>

            <div className="flex gap-8 border-b border-border/40 mb-8 overflow-x-auto overflow-y-hidden scrollbar-hide select-none pt-2">
              <div onClick={() => setActiveTab("prompt")} className={`whitespace-nowrap pb-4 text-[14px] font-semibold cursor-pointer border-b-2 transition-all relative top-px ${activeTab === "prompt" ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>Prompt</div>
              <div onClick={() => setActiveTab("preview")} className={`whitespace-nowrap pb-4 text-[14px] font-semibold cursor-pointer border-b-2 transition-all relative top-px flex items-center gap-1.5 ${activeTab === "preview" ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>
                <Sparkles className="w-3.5 h-3.5" />
                Output Preview
              </div>
              {prompt.is_multi_step && <div onClick={() => setActiveTab("steps")} className={`whitespace-nowrap pb-4 text-[14px] font-semibold cursor-pointer border-b-2 transition-all relative top-px ${activeTab === "steps" ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>Steps ({prompt.steps?.length})</div>}
              <div onClick={() => setActiveTab("variables")} className={`whitespace-nowrap pb-4 text-[14px] font-semibold cursor-pointer border-b-2 transition-all relative top-px ${activeTab === "variables" ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>Variables Guide</div>
              <div onClick={() => setActiveTab("reviews")} className={`whitespace-nowrap pb-4 text-[14px] font-semibold cursor-pointer border-b-2 transition-all relative top-px ${activeTab === "reviews" ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>Reviews ({prompt.review_count})</div>
              <div onClick={() => setActiveTab("related")} className={`whitespace-nowrap pb-4 text-[14px] font-semibold cursor-pointer border-b-2 transition-all relative top-px ${activeTab === "related" ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>Related Prompts</div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "preview" && (() => {
                  const previewType = detectPreviewType({
                    title: prompt.title,
                    promptText: prompt.promptText,
                    images: prompt.images,
                    category: prompt.category,
                    subcategory: prompt.subcategory,
                    outputType: prompt.outputType,
                    platform: prompt.platform,
                    tags: prompt.tags,
                    steps: prompt.steps,
                    is_multi_step: prompt.is_multi_step,
                  });

                  const previewProps = {
                    prompt: {
                      title: prompt.title,
                      promptText: prompt.promptText,
                      images: prompt.images,
                      category: prompt.category,
                      subcategory: prompt.subcategory,
                      outputType: prompt.outputType,
                      platform: prompt.platform,
                      tags: prompt.tags,
                      steps: prompt.steps,
                      is_multi_step: prompt.is_multi_step,
                    },
                    isPurchased,
                  };

                  const typeLabel: Record<string, string> = {
                    text: "Text Output",
                    image: "Image / Visual Output",
                    code: "Code Output",
                    conversational: "Conversational",
                    audio: "Audio / TTS",
                    video: "Video Output",
                    structured: "Structured Data",
                    toolcall: "Agent / Tool Call",
                    multistep: "Multi-step / Chain",
                    multiple: "Multiple Variations",
                  };

                  return (
                    <div className="space-y-4 mb-10">
                      <div className="flex items-center gap-2">
                        <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono">
                          Output Preview
                        </div>
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {typeLabel[previewType] || "Text Output"}
                        </span>
                      </div>

                      {previewType === "image" && <ImageOutput {...previewProps} />}
                      {previewType === "code" && <CodeOutput {...previewProps} />}
                      {previewType === "conversational" && <ConversationalOutput {...previewProps} />}
                      {previewType === "audio" && <AudioOutput {...previewProps} />}
                      {previewType === "video" && <VideoOutput {...previewProps} />}
                      {previewType === "structured" && <StructuredDataOutput {...previewProps} />}
                      {previewType === "toolcall" && <ToolCallOutput {...previewProps} />}
                      {previewType === "multistep" && <MultiStepOutput {...previewProps} />}
                      {previewType === "multiple" && <MultipleOutputs {...previewProps} />}
                      {previewType === "text" && <TextOutput {...previewProps} />}
                    </div>
                  );
                })()}

                {activeTab === "prompt" && (
                  <div className="space-y-8 mb-10">
                    <div className="space-y-4">
                      <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono mb-3">Prompt Preview</div>
                      <LogicEngine isPurchased={isPurchased} promptText={prompt.promptText} price={prompt.price} handlePurchase={handlePurchase} />
                    </div>

                    {((prompt.inputTypes && prompt.inputTypes.length > 0) || (prompt.promptFileUrls && prompt.promptFileUrls.length > 0)) && (
                      <div className="pt-6 border-t border-border/40 space-y-6">
                        {prompt.inputTypes && prompt.inputTypes.length > 0 && (
                          <div className="space-y-4">
                            <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono">Required Inputs</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {prompt.inputTypes.map((type) => {
                                const items = prompt.inputData?.[type] || [];
                                const labelMap: Record<string, string> = {
                                  text: "Text / Variables", image: "Images", doc: "Documents / PDFs",
                                  audio: "Audio", url: "URLs", data: "Data (CSV/JSON)", code: "Code / Repos"
                                };
                                return (
                                  <div key={type} className="p-4 bg-muted/30 border border-border/40 rounded-xl space-y-2">
                                    <div className="text-[12px] font-bold text-foreground">{labelMap[type] || type}</div>
                                    {items.length > 0 ? (
                                      <ul className="space-y-1.5">
                                        {items.map((item: any, idx: number) => (
                                          <li key={idx} className="text-[11px] text-muted-foreground break-all">
                                            {typeof item === "string" && item.startsWith("http") ? (
                                              <a href={item} target="_blank" rel="noreferrer" className="text-primary hover:underline">View File / Link</a>
                                            ) : (
                                              <span>• {String(item)}</span>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <div className="text-[10px] text-muted-foreground">User requested this input type</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {prompt.promptFileUrls && prompt.promptFileUrls.length > 0 && (
                          <div className="space-y-4">
                            <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono">Attached Prompt Files</div>
                            <div className="flex flex-wrap gap-2">
                              {prompt.promptFileUrls.map((url, idx) => (
                                <a 
                                  key={idx} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors text-[11px] font-bold"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  Prompt File {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {isPurchased && (
                      <div className="pt-8 border-t border-border/40 space-y-10">
                        {/* User Guide Section */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                               <Bot className="w-4 h-4 text-primary" />
                             </div>
                             <h3 className="text-lg font-bold text-foreground">User Guide</h3>
                          </div>

                          {prompt.quick_setup && (
                            <div className="space-y-2">
                              <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono">Quick Setup</div>
                              <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/40">{prompt.quick_setup}</p>
                            </div>
                          )}

                          {prompt.guide_steps && prompt.guide_steps.length > 0 && (
                            <div className="space-y-4">
                              <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono">Instructions</div>
                              <div className="space-y-3">
                                {prompt.guide_steps.map((step, idx) => (
                                  <div key={idx} className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{idx + 1}</div>
                                    <p className="text-sm text-foreground">{step}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {prompt.what_to_expect && (
                            <div className="space-y-2">
                              <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono">What to expect</div>
                              <p className="text-sm text-foreground leading-relaxed">{prompt.what_to_expect}</p>
                            </div>
                          )}
                        </div>

                        {/* Seller Notes Section */}
                        {(prompt.pro_tips || prompt.common_mistakes || prompt.how_to_adapt || prompt.seller_note) && (
                          <div className="space-y-6 pt-8 border-t border-border/40">
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                                 <Flame className="w-4 h-4 text-amber-500" />
                               </div>
                               <h3 className="text-lg font-bold text-foreground">Seller Notes</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {prompt.pro_tips && (
                                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-600">Pro Tips</div>
                                  <p className="text-xs text-foreground leading-relaxed">{prompt.pro_tips}</p>
                                </div>
                              )}
                              {prompt.common_mistakes && (
                                <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-2">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-rose-600">Common Mistakes</div>
                                  <p className="text-xs text-foreground leading-relaxed">{prompt.common_mistakes}</p>
                                </div>
                              )}
                              {prompt.how_to_adapt && (
                                <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">How to Adapt</div>
                                  <p className="text-xs text-foreground leading-relaxed">{prompt.how_to_adapt}</p>
                                </div>
                              )}
                              {prompt.seller_note && (
                                <div className="p-5 rounded-2xl bg-muted/50 border border-border/40 space-y-2 col-span-full">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Seller Note</div>
                                  <p className="text-xs text-foreground leading-relaxed">{prompt.seller_note}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "variables" && (
                  <div className="space-y-4 mb-10">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono mb-3">Variables in this prompt</div>
                    <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Replace placeholder variables like [TARGET_PERSONA] and [PAIN_POINT] with your own context.
                      </p>
                      {prompt.fill_variables && (
                        <div className="pt-4 border-t border-border/40">
                          <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">How to fill</div>
                          <p className="text-sm text-foreground">{prompt.fill_variables}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "steps" && prompt.is_multi_step && (
                  <div className="space-y-6 mb-10">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono mb-3">Multi-step Workflow</div>
                    <div className="space-y-4">
                      {prompt.steps?.sort((a:any, b:any) => a.step_number - b.step_number).map((step: any, idx: number) => (
                        <div key={idx} className="bg-card border border-border/40 rounded-2xl p-6 relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                              {step.step_number}
                            </div>
                            <div className="space-y-1">
                              {step.title && <h4 className="font-bold text-foreground">{step.title}</h4>}
                              <Badge variant="outline" className="text-[10px] uppercase tracking-wider mb-2">{step.step_type}</Badge>
                              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{step.instruction}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-8 mb-10">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono mb-3">Verified Buyer Reviews</div>
                    <div className="grid grid-cols-1 gap-6">
                      {prompt.reviews && prompt.reviews.length > 0 ? (
                        prompt.reviews.map((rev: any, i: number) => (
                          <div key={rev.id || i} className="p-6 rounded-2xl border border-border/40 bg-card space-y-4 hover:border-primary/20 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="text-primary font-bold">{"★".repeat(rev.rating)}{"☆".repeat(5-rev.rating)}</div>
                              <div className="text-[10px] text-muted-foreground font-mono">{new Date(rev.created_at).toLocaleDateString()}</div>
                            </div>
                            {rev.title && <h5 className="font-bold text-foreground">{rev.title}</h5>}
                            <p className="text-sm text-muted-foreground leading-relaxed italic">"{rev.body}"</p>
                            <div className="flex items-center gap-2 pt-2">
                              <div className="w-5 h-5 rounded-full bg-secondary" />
                              <span className="text-[11px] font-bold text-muted-foreground">Verified Buyer</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 text-center border border-dashed border-border/60 rounded-3xl">
                           <p className="text-muted-foreground text-sm font-medium">No reviews yet for this prompt.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "related" && (
                  <div className="space-y-4 mb-10">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono mb-3">Similar prompts you might like</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {relatedPrompts.length > 0 ? (
                        relatedPrompts.map((p) => (
                           <Link key={p.id} href={`/prompt/${p.id}`} className="bg-card border border-border/40 rounded-xl overflow-hidden hover:border-primary/40 transition-colors block">
                            <div className="w-full h-24 bg-linear-to-br from-primary/10 to-transparent flex items-center justify-center text-3xl overflow-hidden">
                              {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : "✨"}
                            </div>
                            <div className="p-4">
                              <div className="text-sm font-semibold mb-1 text-foreground line-clamp-1">{p.title}</div>
                              <div className="text-[10px] text-primary font-bold">◈ {p.price}</div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        [1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-card border border-border/40 rounded-xl overflow-hidden opacity-50">
                            <div className="w-full h-24 bg-linear-to-br from-primary/10 to-transparent flex items-center justify-center text-3xl">✨</div>
                            <div className="p-4">
                              <div className="text-sm font-semibold mb-1 text-foreground">Loading...</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="lg:sticky lg:top-8"
          >
            <PurchaseSidebar 
              price={prompt.price}
              isPurchased={isPurchased}
              isPurchasing={isPurchasing}
              handlePurchase={handlePurchase}
              seller={prompt.seller}
              platform={prompt.platform}
              category={prompt.category}
              subcategory={prompt.subcategory}
              model={prompt.model}
              tags={prompt.tags}
              useCase={prompt.useCase}
              complexity={prompt.complexity}
              sales={prompt.sales}
              lastTested={prompt.lastTested}
              imageCount={prompt.images.length}
              review_count={prompt.review_count}
            />
          </motion.div>
        </div>
      </div>

      {!isPurchased && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 p-6 px-8 z-50 pointer-events-none">
          <div className="pointer-events-auto backdrop-blur-2xl bg-background/80 border border-white/20 p-4 rounded-3xl shadow-2xl">
            <Button 
              className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20" 
              onClick={handlePurchase}
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>Unlock • {prompt?.price || 0} Coins</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
