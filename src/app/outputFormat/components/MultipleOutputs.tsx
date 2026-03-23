"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const VARIATIONS = [
  {
    id: 1,
    tone: "Professional",
    content: "We are thrilled to announce our latest product update, designed to streamline your workflow and boost productivity significantly."
  },
  {
    id: 2,
    tone: "Casual",
    content: "Hey everyone! Check out our new update—we've packed it with awesome features to make your day-to-day work way easier."
  },
  {
    id: 3,
    tone: "Enthusiastic",
    content: "BIG news! 🚀 Our most exciting update ever is live! Get ready for game-changing tools that will supercharge your workflow!"
  }
];

export function MultipleOutputs() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        {VARIATIONS.map((variant, idx) => (
          <button
            key={variant.id}
            onClick={() => setActiveIdx(idx)}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeIdx === idx 
                ? "bg-primary/10 border-primary ring-1 ring-primary/30" 
                : "bg-card border-border/50 hover:border-primary/50"
            }`}
          >
            <div className={`text-sm font-bold mb-1 ${activeIdx === idx ? "text-primary" : "text-foreground"}`}>
              Option {idx + 1}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              Tone: {variant.tone}
            </div>
          </button>
        ))}
      </div>

      <motion.div 
        key={activeIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm relative min-h-[150px] flex items-center justify-center text-center"
      >
        <div className="absolute top-4 left-4 text-xs font-mono font-bold text-muted-foreground opacity-50">
          SELECTED_{VARIATIONS[activeIdx].id}
        </div>
        <p className="text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
          "{VARIATIONS[activeIdx].content}"
        </p>
      </motion.div>
    </div>
  );
}
