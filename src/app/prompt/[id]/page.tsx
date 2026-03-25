"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { CheckCircle, Flame, Image as ImageIcon, Type, Code2, Database, ListTree, Bot, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PromptHeader } from "./components/PromptHeader";
import { ImageGallery } from "./components/ImageGallery";
import { LogicEngine } from "./components/LogicEngine";
import { PurchaseSidebar } from "./components/PurchaseSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import exploreData from "@/app/explore/data/explore-data.json";

type PromptItem = {
  id: string;
  title: string;
  tagline: string;
  platform: string;
  category: string;
  price: number;
  promptText: string;
  images: string[];
  seller: { username: string; avatar?: string };
  outputType?: string;
  inputTypes?: string[];
  inputData?: Record<string, any[]>;
  promptFileUrls?: string[];
};

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

    // 1. Check raw type overrides
    if (rawType.includes("image") || rawType.includes("visual")) return "Image / Visual Output";
    if (rawType.includes("video") || rawType.includes("audio") || rawType.includes("film") || rawType.includes("music")) return "Audio / Video";
    if (rawType.includes("code")) return "Code Output";
    if (rawType.includes("json") || rawType.includes("yaml") || rawType.includes("csv") || rawType.includes("structured") || rawType.includes("data") || rawType.includes("tool") || rawType.includes("function")) return "Structured Data";
    if (rawType.includes("agent") || rawType.includes("autonomous")) return "Agent / System Prompt";
    if (rawType.includes("step") || rawType.includes("chain")) return "Multi-step / Chain";
    if (rawType.includes("text") || rawType.includes("copy") || rawType.includes("long-form") || rawType.includes("short copy")) return "Text Output";

    // 2. Classify based on category and textual content
    if (rawCategory.includes("image") || text.includes("image") || text.includes("generator") && text.includes("art")) return "Image / Visual Output";
    if (rawCategory.includes("video") || rawCategory.includes("audio") || text.includes("video") || text.includes("audio") || text.includes("podcast")) return "Audio / Video";
    if (rawCategory.includes("code") || text.includes("react") || text.includes("python") || text.includes("generate code") || text.includes("api integration")) return "Code Output";
    if (rawCategory.includes("agent") || text.includes("agent") || text.includes("autonomous") || text.includes("multi-step workflow")) return "Agent / System Prompt";
    if (rawCategory.includes("data") || text.includes("json") || text.includes("csv") || text.includes("schema") || text.includes("database") || text.includes("structured format")) return "Structured Data";
    if (text.includes("chain") || text.includes("step-by-step")) return "Multi-step / Chain";
    if (rawCategory.includes("text") || rawCategory.includes("copy") || rawCategory.includes("role") || text.includes("write") || text.includes("email") || text.includes("draft") || text.includes("report")) return "Text Output";

    return "Text Output"; // Default Fallback
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
              className="fixed top-[42%] left-1/2 -translate-x-1/2 md:-ml-[170px] -translate-y-1/2 z-[100] w-[90%] max-w-sm bg-card border border-border/60 shadow-2xl rounded-2xl overflow-hidden"
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
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
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

function mapFallbackPrompt(id: string): PromptItem | null {
  const fallback = (exploreData as any)?.prompts?.find((p: any) => String(p.id) === id);
  if (!fallback) return null;

  return {
    id,
    title: fallback.title || "Untitled Prompt",
    tagline: fallback.short_description || "Ready-to-use prompt",
    platform: fallback.platform || "AI",
    category: fallback.category || "Prompt",
    price: Number(fallback.price || 0),
    promptText: fallback.promptText || fallback.prompt_text || "No preview available.",
    images: Array.isArray(fallback.images) ? fallback.images : [],
    seller: {
      username: fallback.seller || "creator",
      avatar: "",
    },
    outputType: fallback.output_type || fallback.outputType || undefined,
  };
}

function mapDefaultFallbackPrompt(id: string): PromptItem {
  const firstPrompt = (exploreData as any)?.prompts?.[0];

  if (!firstPrompt) {
    return {
      id,
      title: "Demo Prompt",
      tagline: "Ready-to-use prompt",
      platform: "AI",
      category: "Prompt",
      price: 0,
      promptText: "No preview available.",
      images: [],
      seller: {
        username: "creator",
        avatar: "",
      },
      outputType: undefined,
    };
  }

  return {
    id,
    title: firstPrompt.title || "Demo Prompt",
    tagline: firstPrompt.short_description || "Ready-to-use prompt",
    platform: firstPrompt.platform || "AI",
    category: firstPrompt.category || "Prompt",
    price: Number(firstPrompt.price || 0),
    promptText: firstPrompt.promptText || firstPrompt.prompt_text || "No preview available.",
    images: Array.isArray(firstPrompt.images) ? firstPrompt.images : [],
    seller: {
      username: firstPrompt.seller || "creator",
      avatar: "",
    },
    outputType: firstPrompt.output_type || firstPrompt.outputType || undefined,
  };
}

function mapDbPrompt(row: any, images: any[] = [], steps: any[] = []): PromptItem {
  // Use the first image from prompt_images if available, otherwise fallback to cover_image_url
  const allImages = images.length > 0 
    ? images.map(img => img.image_url) 
    : (row.cover_image_url ? [row.cover_image_url] : []);

  // Handle both aliased and unaliased versions from Supabase
  const profile = row.users || row.creator;
  const platformData = row.platforms || row.platform;
  const categoryData = row.categories || row.category;

  return {
    id: String(row.id),
    title: row.title || "Untitled Prompt",
    tagline: row.tagline || row.short_description || "Ready-to-use prompt",
    platform: platformData?.name || (typeof platformData === 'string' ? platformData : "AI"),
    category: categoryData?.name || (typeof categoryData === 'string' ? categoryData : "Prompt"),
    price: Number(row.price || 0),
    promptText: row.prompt_text || (steps.length > 0 ? steps[0].content : "No preview available."),
    images: allImages,
    seller: {
      username: profile?.display_name || profile?.username || "creator",
      avatar: profile?.avatar_url || "",
    },
    outputType: row.output_type || undefined,
    inputTypes: row.input_types || [],
    inputData: row.input_data || {},
    promptFileUrls: row.prompt_file_urls || [],
  };
}

export default function PromptDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const [prompt, setPrompt] = useState<PromptItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState("prompt");

  useEffect(() => {
    const fetchPromptData = async () => {
      try {
        console.log("Fetching prompt for ID:", params.id, "Type:", typeof params.id);
        
        // 1. Fetch main prompt data WITHOUT joins first to isolate the issue
        const { data: mainData, error: mainError } = await supabase
          .from("prompts")
          .select("*")
          .eq("id", params.id)
          .maybeSingle();

        if (mainError) {
          console.error("Supabase Error [Main]:", {
            message: mainError.message,
            code: mainError.code,
            details: mainError.details,
            hint: mainError.hint
          });
          throw mainError;
        }

        console.log("Main prompt data fetched:", mainData);

        if (mainData) {
          // 2. Fetch joins separately to be safer
          const [userRes, platformRes, categoryRes, imagesRes, stepsRes] = await Promise.all([
            supabase.from("users").select("*").eq("id", mainData.creator_id).maybeSingle(),
            supabase.from("platforms").select("*").eq("id", mainData.platform_id).maybeSingle(),
            supabase.from("categories").select("*").eq("id", mainData.category_id).maybeSingle(),
            supabase.from("prompt_images").select("*").eq("prompt_id", params.id).order('sort_order'),
            supabase.from("prompt_steps").select("*").eq("prompt_id", params.id).order('step_number')
          ]);

          // Combine data
          const enrichedData = {
            ...mainData,
            creator: userRes.data,
            platforms: platformRes.data,
            categories: categoryRes.data
          };

          setPrompt(mapDbPrompt(enrichedData, imagesRes.data || [], stepsRes.data || []));
          return;
        }

        console.warn("No prompt found in database for ID:", params.id);
        // Fallback for demo IDs or non-existent database entries
        const fallbackPrompt = mapFallbackPrompt(params.id);
        if (fallbackPrompt) {
          setPrompt(fallbackPrompt);
          return;
        }

        setPrompt(mapDefaultFallbackPrompt(params.id));
      } catch (err: any) {
        console.error("Critical error fetching prompt detail:", err);
        const fallbackPrompt = mapFallbackPrompt(params.id);
        setPrompt(fallbackPrompt || mapDefaultFallbackPrompt(params.id));
      } finally {
        setLoading(false);
      }
    };

    fetchPromptData();
  }, [params.id]);

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
    setIsPurchased(true);
    toast.success("Prompt unlocked for preview mode");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-300 mx-auto pt-8 pb-32 md:pb-8 px-6 lg:px-6">
        <OutputTypeBar prompt={prompt} />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-0 items-start">
          <div className="md:pr-10">
            <ImageGallery images={prompt.images} platform={prompt.platform} category={prompt.category} />

            <div className="flex flex-wrap gap-2 mb-5">
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 font-mono text-[11px] rounded-full px-3 py-1">
                {prompt.platform}
              </Badge>
              <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20 font-mono text-[11px] rounded-full px-3 py-1">
                {prompt.category}
              </Badge>
              <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 font-mono text-[11px] rounded-full px-3 py-1">
                Community
              </Badge>
              <Badge className="group relative overflow-visible bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 font-mono text-[11px] rounded-full px-3 py-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Verified Output
              </Badge>
              <Badge className="group relative overflow-visible bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border-orange-500/20 font-mono text-[11px] rounded-full px-3 py-1 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Trending
              </Badge>
            </div>

            <PromptHeader platform={prompt.platform} category={prompt.category} title={prompt.title} tagline={prompt.tagline} />

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/40">
              <span className="text-primary text-base tracking-widest">★★★★★</span>
              <span className="font-bold text-sm">4.9</span>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
              <span className="text-muted-foreground text-sm">127 reviews</span>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
              <span className="text-muted-foreground text-sm flex items-center gap-1">🛒 489 purchases</span>
            </div>

            <div className="flex gap-8 border-b border-border/40 mb-8 overflow-x-auto overflow-y-hidden scrollbar-hide select-none pt-2">
              <div onClick={() => setActiveTab("prompt")} className={`whitespace-nowrap pb-4 text-[14px] font-semibold cursor-pointer border-b-2 transition-all relative top-px ${activeTab === "prompt" ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>Prompt</div>
              <div onClick={() => setActiveTab("variables")} className={`whitespace-nowrap pb-4 text-[14px] font-semibold cursor-pointer border-b-2 transition-all relative top-px ${activeTab === "variables" ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>Variables Guide</div>
              <div onClick={() => setActiveTab("reviews")} className={`whitespace-nowrap pb-4 text-[14px] font-semibold cursor-pointer border-b-2 transition-all relative top-px ${activeTab === "reviews" ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}>Reviews (127)</div>
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
                  </div>
                )}

                {activeTab === "variables" && (
                  <div className="space-y-4 mb-10">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono mb-3">Variables in this prompt</div>
                    <div className="bg-card border border-border/40 rounded-xl p-6">
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        Replace placeholder variables like [TARGET_PERSONA] and [PAIN_POINT] with your own context.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-6 rounded-2xl border border-border/40 bg-card space-y-4">
                          <div className="h-3.5 w-24 bg-secondary rounded" />
                          <div className="h-2.5 w-full bg-secondary/60 rounded" />
                          <div className="h-2.5 w-2/3 bg-secondary/60 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "related" && (
                  <div className="space-y-4 mb-10">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono mb-3">Similar prompts you might like</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card border border-border/40 rounded-xl overflow-hidden">
                          <div className="w-full h-24 bg-linear-to-br from-primary/10 to-transparent flex items-center justify-center text-3xl">✨</div>
                          <div className="p-4">
                            <div className="text-sm font-semibold mb-1 text-foreground">Related Prompt {i}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <PurchaseSidebar
            price={prompt.price}
            isPurchased={isPurchased}
            handlePurchase={handlePurchase}
            seller={prompt.seller}
          />
        </div>
      </div>

      {!isPurchased && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-2xl border-t border-border/40 z-50 shadow-2xl">
          <Button className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest bg-primary text-white" onClick={handlePurchase}>
            Unlock • {prompt.price} Coins
          </Button>
        </div>
      )}
    </div>
  );
}
