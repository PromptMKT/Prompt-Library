"use client";

import * as React from "react";
import { useState } from "react";
import { CheckCircle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PromptHeader } from "@/app/prompt/[id]/components/PromptHeader";
import { LogicEngine } from "@/app/prompt/[id]/components/LogicEngine";
import { PurchaseSidebar } from "@/app/prompt/[id]/components/PurchaseSidebar";
import { motion, AnimatePresence } from "framer-motion";

// Output format components
import { TextOutput } from "../components/TextOutput";
import { CodeOutput } from "../components/CodeOutput";
import { ImageOutput } from "../components/ImageOutput";
import { StructuredDataOutput } from "../components/StructuredDataOutput";
import { AudioOutput } from "../components/AudioOutput";
import { VideoOutput } from "../components/VideoOutput";
import { ConversationalOutput } from "../components/ConversationalOutput";
import { ToolCallOutput } from "../components/ToolCallOutput";
import { MultipleOutputs } from "../components/MultipleOutputs";
import { MultiStepOutput } from "../components/MultiStepOutput";
import { NoOutput } from "../components/NoOutput";

/* ─── Format metadata & mock prompt data per format ─── */
const FORMAT_CONFIG: Record<string, {
  component: React.ReactNode;
  title: string;
  tagline: string;
  platform: string;
  category: string;
  price: number;
  promptText: string;
  outputLabel: string;
  badgePlatform: string;
  badgeCategory: string;
}> = {
  "text-output": {
    component: <TextOutput />,
    title: "Cold Email Copywriter – B2B Outreach",
    tagline: "Generate high-converting cold email copy tailored to any B2B persona and pain point.",
    platform: "ChatGPT",
    category: "Email Copy",
    price: 35,
    promptText: `You are an elite B2B copywriter who has written cold emails\nfor companies like HubSpot, Notion, and Stripe.\n\nWrite a cold email to [TARGET_PERSONA] at [COMPANY_TYPE].\nOpen with a specific observation about [PAIN_POINT] that shows\nyou have done your research. Do not use generic openers like\n"I hope this finds you well" or "My name is..."\n\nYour value proposition should be a single concrete sentence...\nReference [METRIC] as social proof. Keep total length under 90\nwords. End with a low-friction CTA that asks for permission,\nnot a meeting.`,
    outputLabel: "Text Output",
    badgePlatform: "ChatGPT",
    badgeCategory: "Email Copy",
  },
  "code-output": {
    component: <CodeOutput />,
    title: "React Component Generator – Production Ready",
    tagline: "Generate production-ready React components with TypeScript, proper types, and clean architecture.",
    platform: "Claude",
    category: "Code Generation",
    price: 45,
    promptText: `You are a senior React engineer with expertise in TypeScript and modern React patterns.\n\nGenerate a fully typed React component for [COMPONENT_NAME] that:\n- Uses React.forwardRef for proper ref forwarding\n- Implements variant patterns using cva or cn utility\n- Follows the compound component pattern for complex UIs\n- Includes proper aria attributes for accessibility\n- Uses [STYLING_APPROACH] for styling\n\nThe component should handle these states: [STATES_LIST].\nInclude JSDoc comments and usage examples.`,
    outputLabel: "Code Output",
    badgePlatform: "Claude",
    badgeCategory: "Code Generation",
  },
  "image-output": {
    component: <ImageOutput />,
    title: "Fantasy Portrait – Oil Painting Realism",
    tagline: "Character portrait prompts for high-fidelity fantasy art.",
    platform: "Midjourney",
    category: "Image & Visual",
    price: 35,
    promptText: `A breathtaking fantasy portrait of [CHARACTER_DESCRIPTION],\npainted in the style of classical oil painting with\nrich warm lighting and dramatic chiaroscuro.\n\nThe subject should have [FEATURES] with intricate\ndetail on armor/clothing textures.\n\nStyle: oil painting realism, concept art, detailed\nLighting: Rembrandt lighting, golden hour\nAspect ratio: 2:3\nQuality: --q 2 --v 6`,
    outputLabel: "Image / Visual Output",
    badgePlatform: "Midjourney",
    badgeCategory: "Image & Visual",
  },
  "structured-data": {
    component: <StructuredDataOutput />,
    title: "Project Data Extractor – JSON Schema Builder",
    tagline: "Extract structured project data into clean JSON schemas or formatted tables from any description.",
    platform: "GPT-4o",
    category: "Data Extraction",
    price: 30,
    promptText: `You are a data architect specializing in schema design.\n\nGiven the following project description: [PROJECT_DESCRIPTION]\n\nExtract all entities and their relationships into a strict JSON schema.\nEach entity must have: id (number), name (string), status (enum: Active|Completed|Pending|In Progress), priority (enum: High|Medium|Low).\n\nOutput ONLY valid JSON. No markdown, no explanations.\nThe root should be an array of objects.\nInclude a minimum of [MIN_ENTRIES] entries.`,
    outputLabel: "Structured Data",
    badgePlatform: "GPT-4o",
    badgeCategory: "Data Extraction",
  },
  "audio-output": {
    component: <AudioOutput />,
    title: "Corporate Voiceover – Deep TTS Generation",
    tagline: "Generate professional voiceover scripts with precise vocal parameters for text-to-speech engines.",
    platform: "ElevenLabs",
    category: "Audio / TTS",
    price: 40,
    promptText: `Generate a professional voiceover script for [BRAND_NAME].\n\nTone: [TONE] (e.g., authoritative, warm, energetic)\nPace: [PACE] words per minute\nVoice model: Deep Voice\nTarget duration: [DURATION] seconds\n\nThe script should:\n- Hook the listener in the first 3 seconds\n- Mention the key value proposition clearly\n- End with a compelling call-to-action\n- Use natural pauses marked with [PAUSE:0.5s]\n\nOutput the script with SSML markup for pitch and emphasis.`,
    outputLabel: "Audio / Music",
    badgePlatform: "ElevenLabs",
    badgeCategory: "Audio / TTS",
  },
  "video-output": {
    component: <VideoOutput />,
    title: "Cinematic Product Reveal – Video Generation",
    tagline: "Create stunning cinematic product reveal videos with dynamic camera movements and VFX.",
    platform: "Runway Gen-3",
    category: "Video Generation",
    price: 50,
    promptText: `Create a cinematic product reveal video for [PRODUCT_NAME].\n\nScene description:\n- Opening: Slow dolly-in through [ENVIRONMENT] with volumetric fog\n- Reveal: Product materializes with [PARTICLE_EFFECT] particles\n- Hero shot: 360° orbit around product with shallow DOF\n- Close-up: Detail shots of [KEY_FEATURES] with macro lens\n- Ending: Logo reveal with [TRANSITION_STYLE]\n\nLighting: Studio three-point with [COLOR_TEMPERATURE]K\nResolution: 4K\nFPS: 24\nDuration: 15 seconds\nAspect ratio: 16:9`,
    outputLabel: "Video Generation",
    badgePlatform: "Runway Gen-3",
    badgeCategory: "Video Generation",
  },
  "conversational-output": {
    component: <ConversationalOutput />,
    title: "AI Design Mentor – Interactive Chat Tutor",
    tagline: "An interactive conversational AI that teaches UI/UX design principles through Socratic dialogue.",
    platform: "GPT-4 Turbo",
    category: "Conversational",
    price: 25,
    promptText: `You are an expert UI/UX design mentor with 15+ years of experience.\n\nYour teaching style is Socratic — ask clarifying questions before giving full answers.\nUse real-world examples from companies like Apple, Stripe, and Linear.\n\nRules:\n- Always break complex topics into numbered steps\n- Bold key terms on first mention\n- If the user asks about [TOPIC], start with the foundational principle\n- Keep responses under 200 words unless explicitly asked for detail\n- Use analogies from [DOMAIN] to explain abstract concepts\n\nStart by greeting the user and asking what design topic they want to explore.`,
    outputLabel: "Conversational",
    badgePlatform: "GPT-4 Turbo",
    badgeCategory: "Conversational",
  },
  "tool-call": {
    component: <ToolCallOutput />,
    title: "Weather API Agent – Function Calling",
    tagline: "An AI agent that uses structured function calling to fetch real-time weather data from any location.",
    platform: "GPT-4o",
    category: "Tool Call / Function",
    price: 35,
    promptText: `You are an AI assistant with access to the following tools:\n\n1. get_current_weather(location: string, unit: "celsius" | "fahrenheit")\n   - Returns current temperature, condition, humidity, and wind speed\n\n2. get_forecast(location: string, days: number)\n   - Returns daily forecast for up to 7 days\n\nWhen the user asks about weather:\n- Extract the location from their query\n- Default to celsius unless specified\n- Call the appropriate function with strict JSON arguments\n- Present the response in a friendly, concise format\n\nAlways use tool calls. Never hallucinate weather data.`,
    outputLabel: "Tool Call / Function",
    badgePlatform: "GPT-4o",
    badgeCategory: "Tool Call / Function",
  },
  "multiple-outputs": {
    component: <MultipleOutputs />,
    title: "Tone Variant Generator – Multi-Style Copy",
    tagline: "Generate multiple tone variations of the same message for A/B testing and audience targeting.",
    platform: "Claude",
    category: "Multiple Variations",
    price: 30,
    promptText: `Generate [NUM_VARIATIONS] variations of the following message:\n"[ORIGINAL_MESSAGE]"\n\nEach variation should use a distinctly different tone:\n1. Professional — formal, corporate-appropriate\n2. Casual — friendly, approachable, uses contractions\n3. Enthusiastic — high-energy, uses emojis sparingly\n\nRules:\n- Keep the core message identical across all variations\n- Each variation should be under [MAX_WORDS] words\n- Label each with "Option X: [Tone Name]"\n- Do not add explanations — output only the variations`,
    outputLabel: "Multiple Variations",
    badgePlatform: "Claude",
    badgeCategory: "Multiple Variations",
  },
  "multi-step": {
    component: <MultiStepOutput />,
    title: "GTM Strategy Pipeline – 5-Step Chain",
    tagline: "A multi-step prompt chain that builds a complete go-to-market strategy, each step feeding the next.",
    platform: "Claude",
    category: "Multi-step / Chain",
    price: 55,
    promptText: `This is a 5-step sequential prompt chain for GTM strategy.\n\nStep 1 — ICP Definition:\nDefine the ideal customer profile for [PRODUCT]. Include target market, company size, key pain points, and buying triggers.\n\nStep 2 — Positioning Statement:\nUsing the ICP from Step 1, craft a positioning statement following the format: "For [target] who [need], [product] provides [benefit] unlike [alternative]."\n\nStep 3 — Channel Strategy:\nBased on Step 1 & 2, recommend top 3 acquisition channels with estimated CPM and campaign duration.\n\nStep 4 — Messaging Framework:\nCreate headline, subhead, and 3 bullet points for each channel.\n\nStep 5 — Launch Checklist:\nGenerate a week-by-week launch timeline with owners and deliverables.`,
    outputLabel: "Multi-step / Chain",
    badgePlatform: "Claude",
    badgeCategory: "Multi-step / Chain",
  },
  "no-output": {
    component: <NoOutput />,
    title: "Database Migration Agent – Silent Executor",
    tagline: "Trigger background database migrations, data syncs, and system commands without visible text output.",
    platform: "GPT-4o",
    category: "Action Only",
    price: 20,
    promptText: `You are a database migration agent. When triggered, execute the following:\n\n1. Connect to [DATABASE_URL] using the provided credentials\n2. Run migration: ALTER TABLE [TABLE_NAME] ADD COLUMN [COLUMN_SPEC]\n3. Backfill existing rows with [DEFAULT_VALUE]\n4. Verify row count matches pre-migration count\n5. Log results to [LOG_ENDPOINT]\n\nRules:\n- Do NOT return any text to the user\n- All output goes to the system log\n- If migration fails, rollback and log error\n- Return only a status code: 200 (success) or 500 (failure)`,
    outputLabel: "No Output (Action Only)",
    badgePlatform: "GPT-4o",
    badgeCategory: "Action Only",
  },
};

export default function OutputFormatDetailPage({ params: paramsPromise }: { params: Promise<{ formatId: string }> }) {
  const params = React.use(paramsPromise);
  const [isPurchased, setIsPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState("prompt");

  const config = FORMAT_CONFIG[params.formatId];

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h2 className="text-2xl font-bold text-foreground">Format Not Found</h2>
          <p className="text-muted-foreground">The output format "{params.formatId}" does not exist.</p>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    setIsPurchased(true);
    toast.success("Prompt unlocked for preview mode");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-300 mx-auto pt-8 pb-32 md:pb-8 px-6 lg:px-6">

        {/* Output type label */}
        <div className="relative flex items-center gap-3 overflow-visible pb-6 mb-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
            Prompt Type:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 border">
              {config.outputLabel}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-0 items-start">
          <div className="md:pr-10">

            {/* ─── Output Preview Area (replaces ImageGallery) ─── */}
            <div className="relative rounded-[1.25rem] overflow-hidden bg-card shadow-sm dark:shadow-none border border-border/40 mb-6">
              <div className="relative w-full flex flex-col overflow-hidden bg-gradient-to-br from-secondary/30 to-background">
                {/* Subtle grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20" />

                <div className="relative z-20 px-4 pt-4 lg:px-8 lg:pt-6">
                  <div className="bg-background/80 backdrop-blur-md border border-border/40 text-primary font-mono text-[11px] px-3 py-1.5 rounded-full font-bold w-fit">
                    ⬡ Output 1 of 1
                  </div>
                </div>

                <div className="w-full max-w-4xl relative z-10 p-4 lg:p-8 mx-auto">
                  {config.component}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 font-mono text-[11px] rounded-full px-3 py-1">
                {config.badgePlatform}
              </Badge>
              <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20 font-mono text-[11px] rounded-full px-3 py-1">
                {config.badgeCategory}
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

            {/* Title & Tagline */}
            <PromptHeader
              platform={config.platform}
              category={config.category}
              title={config.title}
              tagline={config.tagline}
            />

            {/* Rating bar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/40">
              <span className="text-primary text-base tracking-widest">★★★★★</span>
              <span className="font-bold text-sm">4.9</span>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground text-sm">127 reviews</span>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground text-sm flex items-center gap-1">🛒 489 purchases</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-border/40 mb-8 overflow-x-auto overflow-y-hidden scrollbar-hide select-none pt-2">
              {["prompt", "variables", "reviews", "related"].map((tab) => {
                const labels: Record<string, string> = {
                  prompt: "Prompt",
                  variables: "Variables Guide",
                  reviews: "Reviews (127)",
                  related: "Related Prompts",
                };
                return (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap pb-4 text-[14px] font-semibold cursor-pointer border-b-2 transition-all relative top-px ${
                      activeTab === tab
                        ? "text-primary border-primary"
                        : "text-muted-foreground hover:text-foreground border-transparent"
                    }`}
                  >
                    {labels[tab]}
                  </div>
                );
              })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "prompt" && (
                  <div className="space-y-4 mb-10">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground font-mono mb-3">Prompt Preview</div>
                    <LogicEngine
                      isPurchased={isPurchased}
                      promptText={config.promptText}
                      price={config.price}
                      handlePurchase={handlePurchase}
                    />
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

          {/* Purchase Sidebar */}
          <PurchaseSidebar
            price={config.price}
            isPurchased={isPurchased}
            handlePurchase={handlePurchase}
            seller={{ username: "Riya Iyer", avatar: "" }}
          />
        </div>
      </div>

      {/* Mobile purchase bar */}
      {!isPurchased && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-2xl border-t border-border/40 z-50 shadow-2xl">
          <Button className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest bg-primary text-white" onClick={handlePurchase}>
            Unlock • {config.price} Coins
          </Button>
        </div>
      )}
    </div>
  );
}
