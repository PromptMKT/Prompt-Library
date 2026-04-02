"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCheck, Layers } from "lucide-react";

type PromptItem = {
  title: string;
  promptText: string;
  platform?: string;
};

const TONES = ["Professional", "Casual", "Persuasive", "Bold"];
const TONE_COLORS = [
  "border-blue-500/30 bg-blue-500/5",
  "border-emerald-500/30 bg-emerald-500/5",
  "border-purple-500/30 bg-purple-500/5",
  "border-amber-500/30 bg-amber-500/5",
];
const TONE_BADGE = [
  "bg-blue-500/15 text-blue-500",
  "bg-emerald-500/15 text-emerald-500",
  "bg-purple-500/15 text-purple-500",
  "bg-amber-500/15 text-amber-500",
];

function generateVariations(promptText: string): string[] {
  const lines = (promptText || "")
    .split("\n")
    .filter((l) => l.trim().length > 15);

  return TONES.map((_, i) => lines[i]?.trim() || `Variation ${i + 1} — optimised for ${TONES[i].toLowerCase()} tone with contextual fine-tuning.`);
}

export function MultipleOutputs({ prompt, isPurchased }: { prompt: PromptItem; isPurchased: boolean }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const variations = generateVariations(prompt.promptText);
  const visible = isPurchased ? variations : variations.slice(0, 1);

  const handleCopy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/40">
        <Layers className="w-4 h-4 text-violet-500" />
        <span className="text-[11px] font-mono text-muted-foreground">multiple_outputs.txt</span>
        <div className="ml-auto text-[10px] text-muted-foreground">
          {visible.length} / {variations.length} variations
        </div>
      </div>

      {/* Grid of variations */}
      <div className="relative p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[240px]">
        {visible.map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative group p-4 rounded-xl border transition-all ${TONE_COLORS[i]}`}
          >
            {/* Tone badge */}
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${TONE_BADGE[i]}`}>
                {TONES[i]}
              </span>
              {isPurchased && (
                <button
                  onClick={() => handleCopy(text, i)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
                >
                  {copiedIdx === i
                    ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                    : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Text */}
            <p className="text-sm text-foreground/85 leading-relaxed line-clamp-4">
              {text}
            </p>

            {/* Characters count */}
            <div className="mt-3 text-[10px] text-muted-foreground font-mono">
              {text.length} chars
            </div>
          </motion.div>
        ))}

        {/* Placeholder locked cards */}
        {!isPurchased && variations.slice(1).map((_, i) => (
          <div
            key={`locked-${i}`}
            className={`p-4 rounded-xl border ${TONE_COLORS[i + 1]} opacity-40 blur-[1px]`}
          >
            <div className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 ${TONE_BADGE[i + 1]}`}>
              {TONES[i + 1]}
            </div>
            <div className="space-y-1.5">
              {[100, 80, 90].map((w, j) => (
                <div key={j} className="h-2.5 rounded bg-current opacity-10" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        ))}

        {/* Blur overlay */}
        {!isPurchased && (
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/60 to-transparent flex flex-col items-center justify-end pb-6 gap-1">
            <p className="text-xs text-muted-foreground font-semibold">Unlock all {variations.length} tone variations</p>
          </div>
        )}
      </div>
    </div>
  );
}
