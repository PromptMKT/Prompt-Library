"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCheck, Terminal, ChevronDown } from "lucide-react";

type PromptItem = {
  title: string;
  promptText: string;
  platform?: string;
  category?: string;
};

const LANG_MAP: Record<string, string> = {
  python: "python",
  react: "tsx",
  javascript: "js",
  typescript: "ts",
  css: "css",
  html: "html",
  sql: "sql",
  bash: "bash",
};

function detectLang(text: string, platform?: string): string {
  const lower = (text + " " + platform).toLowerCase();
  for (const [key, val] of Object.entries(LANG_MAP)) {
    if (lower.includes(key)) return val;
  }
  return "txt";
}

function syntaxHighlight(code: string): string {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /\b(import|from|export|const|let|var|function|return|if|else|for|while|class|new|async|await|try|catch|def|print|SELECT|FROM|WHERE|UPDATE|INSERT|DELETE)\b/g,
      '<span class="text-[#c586c0]">$1</span>'
    )
    .replace(
      /\b(true|false|null|undefined|None|True|False)\b/g,
      '<span class="text-[#569cd6]">$1</span>'
    )
    .replace(
      /("[^"]*"|'[^']*'|`[^`]*`)/g,
      '<span class="text-[#ce9178]">$1</span>'
    )
    .replace(
      /(\/\/.*|#.*)/g,
      '<span class="text-[#6a9955]">$1</span>'
    );
}

export function CodeOutput({ prompt, isPurchased }: { prompt: PromptItem; isPurchased: boolean }) {
  const [copied, setCopied] = useState(false);
  const [lang] = useState(detectLang(prompt.promptText || "", prompt.platform));

  const fullCode = prompt.promptText || "# No code preview available";
  const displayCode = isPurchased ? fullCode : fullCode.split("\n").slice(0, 8).join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl border border-border/60 bg-[#1e1e1e] overflow-hidden text-white font-mono">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#2d2d2d] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-3 text-[11px] text-zinc-400">
            {prompt.title?.toLowerCase().replace(/\s+/g, "_").slice(0, 30) || "output"}.{lang}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-bold uppercase tracking-wider">
            {lang}
          </span>
          {isPurchased && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-[11px] text-zinc-300 hover:text-white transition-colors"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Line numbers + code area */}
      <div className="relative flex min-h-[260px] max-h-[380px] overflow-hidden">
        {/* Line numbers */}
        <div className="sticky left-0 w-10 text-right pr-3 py-4 text-[12px] text-zinc-600 select-none border-r border-white/5 bg-[#1e1e1e] leading-6 shrink-0">
          {displayCode.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code */}
        <AnimatePresence mode="wait">
          <motion.pre
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 py-4 px-4 text-[13px] leading-6 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10"
          >
            <code
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(displayCode) }}
            />
          </motion.pre>
        </AnimatePresence>

        {/* Blur overlay */}
        {!isPurchased && (
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#1e1e1e] via-[#1e1e1e]/90 to-transparent flex flex-col items-center justify-end pb-6 gap-2">
            <Terminal className="w-5 h-5 text-zinc-500" />
            <p className="text-xs text-zinc-400 font-semibold">Unlock to access the full code output</p>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-4 py-1.5 bg-[#007acc] text-white text-[10px] font-mono">
        <span>UTF-8</span>
        <span>{lang.toUpperCase()}</span>
        <span className="ml-auto">{displayCode.split("\n").length} lines</span>
      </div>
    </div>
  );
}
