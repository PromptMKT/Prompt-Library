"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

export function TextOutput() {
  const [activeTab, setActiveTab] = useState<"short" | "long">("short");
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-[380px] lg:h-[400px] flex flex-col gap-4">
      {/* Custom Tabs */}
      <div className="flex bg-card/50 rounded-xl border border-border/40 w-fit flex-shrink-0">
        <button
          onClick={() => setActiveTab("short")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "short" ? "bg-primary text-primary-foreground shadow-sm" : "hover:text-foreground text-muted-foreground"
            }`}
        >
          Short Copy
        </button>
        <button
          onClick={() => setActiveTab("long")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "long" ? "bg-primary text-primary-foreground shadow-sm" : "hover:text-foreground text-muted-foreground"
            }`}
        >
          Long-form
        </button>
      </div>

      <div className="relative flex-1 bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm group flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/20 border-b border-border/40 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="ml-2 text-xs font-mono text-muted-foreground">output.txt</span>
          </div>
          <button
            onClick={copyText}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            title="Copy Text"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-6 md:p-8 relative flex-1 overflow-y-auto min-h-0 text-sm md:text-base leading-relaxed text-foreground/90 font-serif">
          <AnimatePresence mode="wait">
            {activeTab === "short" ? (
              <motion.div
                key="short"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <p><span className="font-bold text-primary">Subject:</span> Quick question about [PAIN_POINT] at [COMPANY_NAME]</p>
                <p>Hi [FIRST_NAME],</p>
                <p>I noticed [COMPANY] recently [OBSERVATION].</p>
                <p>Most [ROLE]s I speak with are dealing with [PAIN_POINT] - which usually means [CONSEQUENCE].</p>
                <p>We helped [REFERENCE_COMPANY] solve this in 3 weeks. Worth a quick 10-min chat?</p>
                <p>Best,<br />[YOUR_NAME]</p>
              </motion.div>
            ) : (
              <motion.div
                key="long"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold mb-4">The Future of AI Formats</h2>
                <p>Artificial Intelligence has moved beyond simple text-in, text-out paradigms. Today's models can generate diverse outputs ranging from structured JSON data to fully composed music tracks and high-fidelity video.</p>
                <p>This multi-modal capability opens unprecedented opportunities for creators and developers alike. When you abstract the format away, the AI becomes a universal translation engine—converting pure intent into any digital medium required.</p>
                <div className="bg-secondary/20 p-4 border-l-2 border-primary mt-4 italic text-muted-foreground">
                  "The format is the medium, but the prompt is the message."
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
