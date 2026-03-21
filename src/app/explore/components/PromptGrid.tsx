"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { PromptCard } from "@/components/prompt/PromptCard";

interface PromptGridProps {
  prompts: any[];
  loading: boolean;
}

export function PromptGrid({ prompts, loading }: PromptGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[400px] rounded-[2.5rem] bg-secondary animate-pulse border border-border" />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center space-y-4">
        <Search className="w-16 h-16 text-muted-foreground/20" />
        <div className="space-y-1">
          <p className="text-2xl font-black text-foreground">No matches found</p>
          <p className="text-muted-foreground font-medium">Try broadening your search or resetting filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {prompts.map((prompt: any, index: number) => (
        <motion.div 
          key={prompt._id || prompt.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
        >
          <PromptCard 
            id={prompt._id || prompt.id}
            title={prompt.title || "Untitled Prompt"}
            tagline={prompt.short_description || prompt.tagline || ""}
            price={prompt.price || 0}
            rating={prompt.rating || 5}
            platform={prompt.platform || "Unknown"}
            author={{
              username: typeof prompt.seller === 'object' ? (prompt.seller.name || prompt.seller.username || "anonymous") : (prompt.seller || "anonymous"),
              avatar: (prompt.seller && typeof prompt.seller === 'object' && prompt.seller.avatar) 
                ? prompt.seller.avatar 
                : `https://avatar.iran.liara.run/public/boy?username=${typeof prompt.seller === 'object' ? (prompt.seller.name || prompt.seller.username || "anonymous") : (prompt.seller || "anonymous")}`
            }}
            previewImage={prompt.images?.[0] || ""}
            promptPreview={prompt.promptText?.substring(0, 80) || ""}
          />
        </motion.div>
      ))}
    </div>
  );
}
