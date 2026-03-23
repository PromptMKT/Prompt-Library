"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Code, Image as ImageIcon, Database, 
  Music, Video, MessageSquare, TerminalSquare, 
  Layers, Ghost, Search, ListTree
} from "lucide-react";
import { OutputCard } from "./components/OutputCard";

// Import all specific output format components
import { TextOutput } from "./components/TextOutput";
import { CodeOutput } from "./components/CodeOutput";
import { ImageOutput } from "./components/ImageOutput";
import { StructuredDataOutput } from "./components/StructuredDataOutput";
import { AudioOutput } from "./components/AudioOutput";
import { VideoOutput } from "./components/VideoOutput";
import { ConversationalOutput } from "./components/ConversationalOutput";
import { ToolCallOutput } from "./components/ToolCallOutput";
import { MultipleOutputs } from "./components/MultipleOutputs";
import { MultiStepOutput } from "./components/MultiStepOutput";
import { NoOutput } from "./components/NoOutput";

const OUTPUT_FORMATS = [
  {
    id: "text-output",
    title: "Text Output",
    description: "Generate beautifully formatted text content like marketing copy, blog posts, emails, and comprehensive reports.",
    icon: <FileText className="w-6 h-6" />,
    category: "Text",
    component: <TextOutput />
  },
  {
    id: "code-output",
    title: "Code Output",
    description: "Produce production-ready code blocks spanning multiple files, complete with syntax highlighting and easy-copy features.",
    icon: <Code className="w-6 h-6" />,
    category: "Text",
    component: <CodeOutput />
  },
  {
    id: "image-output",
    title: "Image / Visual Output",
    description: "Render high-quality image generations with intuitive gallery views, thumbnail navigation, and high-res modal popups.",
    icon: <ImageIcon className="w-6 h-6" />,
    category: "Media",
    component: <ImageOutput />
  },
  {
    id: "structured-data",
    title: "Structured Data",
    description: "Output machine-readable JSON or neatly formatted tables, perfect for data extraction, lists, and schema definitions.",
    icon: <Database className="w-6 h-6" />,
    category: "Data",
    component: <StructuredDataOutput />
  },
  {
    id: "audio-output",
    title: "Audio / Music",
    description: "Generate lifelike TTS voices, sound effects, or full musical compositions. Includes an in-browser audio player.",
    icon: <Music className="w-6 h-6" />,
    category: "Media",
    component: <AudioOutput />
  },
  {
    id: "video-output",
    title: "Video Generation",
    description: "Create stunning motion outputs using models like Sora or Runway, embedded directly with full video playback controls.",
    icon: <Video className="w-6 h-6" />,
    category: "Media",
    component: <VideoOutput />
  },
  {
    id: "conversational-output",
    title: "Conversational",
    description: "Engage in multi-turn dialogues with dynamic chat interfaces mimicking popular LLM chat applications.",
    icon: <MessageSquare className="w-6 h-6" />,
    category: "Interactive",
    component: <ConversationalOutput />
  },
  {
    id: "tool-call",
    title: "Tool Call / Function",
    description: "Execute API calls and function executions. View the underlying JSON requests juxtaposed with system responses.",
    icon: <TerminalSquare className="w-6 h-6" />,
    category: "Interactive",
    component: <ToolCallOutput />
  },
  {
    id: "multiple-outputs",
    title: "Multiple Variations",
    description: "Generate and review several different variations or styles of an output in a single generation step.",
    icon: <Layers className="w-6 h-6" />,
    category: "Interactive",
    component: <MultipleOutputs />
  },
  {
    id: "multi-step",
    title: "Multi-step / Chain",
    description: "Chain together multiple AI prompts. The output of one step seamlessly feeds into the next, automating complex multi-stage tasks.",
    icon: <ListTree className="w-6 h-6" />,
    category: "Interactive",
    component: <MultiStepOutput />
  },
  {
    id: "no-output",
    title: "No Output (Action Only)",
    description: "Trigger background side-effects like database updates, email dispatching, or system commands without visible text generation.",
    icon: <Ghost className="w-6 h-6" />,
    category: "Data",
    component: <NoOutput />
  }
];

const CATEGORIES = [
  "All", 
  ...OUTPUT_FORMATS.map(f => f.title)
];

export default function OutputFormatPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFormats = useMemo(() => {
    return OUTPUT_FORMATS.filter(format => {
      const matchesCategory = activeCategory === "All" || format.category === activeCategory || format.title === activeCategory;
      const matchesSearch = format.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            format.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-24">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] hero-gradient opacity-60 pointer-events-none -z-10" />
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10 pt-32 pb-16">
        
        {/* Hero Section Removed per user request */}

        {/* Filters & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center bg-card border border-border/50 p-2.5 rounded-2xl shadow-sm mb-16 backdrop-blur-xl sticky top-20 z-50 w-full"
        >
          <div className="flex items-center gap-2 overflow-x-auto w-full scrollbar-hide py-0.5 px-0.5">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === category 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Outputs Grid */}
        <div className="flex flex-col gap-12 lg:gap-24 relative">
          
          {/* Vertical connecting line */}
          <div className="absolute left-6 lg:left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />

          <AnimatePresence mode="popLayout">
            {filteredFormats.length > 0 ? (
              filteredFormats.map((format, index) => (
                <motion.div
                  key={format.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 w-full flex justify-center"
                >
                  <div className="w-full">
                     <OutputCard
                       id={format.id}
                       title={format.title}
                       description={format.description}
                       icon={format.icon}
                     >
                       {format.component}
                     </OutputCard>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="py-32 text-center text-muted-foreground flex flex-col items-center col-span-full w-full"
              >
                <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6 border border-border/50">
                  <Search className="w-10 h-10 opacity-50" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No formats found</h3>
                <p>We couldn't find any output formats matching your current search and filters.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="mt-6 text-primary hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
