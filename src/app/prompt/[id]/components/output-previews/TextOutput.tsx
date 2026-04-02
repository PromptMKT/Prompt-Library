"use client";

import { motion } from "framer-motion";
import { FileText, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";

type PromptItem = {
  title: string;
  promptText: string;
  category?: string;
  tags?: string[];
};

export function TextOutput({ prompt, isPurchased }: { prompt: PromptItem; isPurchased: boolean }) {
  const [copied, setCopied] = useState(false);

  const previewLines = (prompt.promptText || "")
    .split("\n")
    .filter(Boolean)
    .slice(0, isPurchased ? 20 : 4);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-[11px] font-mono text-muted-foreground">text_output.md</span>
        </div>
        {isPurchased && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      {/* Content area */}
      <div className="relative p-6 font-sans text-sm leading-relaxed space-y-3 min-h-[260px]">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary/70" />
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            {prompt.category || "Text"} Output
          </span>
        </div>

        {previewLines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="text-foreground/85 leading-relaxed"
          >
            {line}
          </motion.p>
        ))}

        {prompt.tags && prompt.tags.length > 0 && isPurchased && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40 mt-4">
            {prompt.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded-full border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Blur overlay for non-purchased */}
        {!isPurchased && (
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-card via-card/80 to-transparent flex flex-col items-center justify-end pb-8 gap-2">
            <p className="text-xs font-semibold text-muted-foreground">Unlock to see the full prompt output</p>
          </div>
        )}
      </div>
    </div>
  );
}
