"use client";

import { motion } from "framer-motion";
import { Bot, Zap, CheckCheck, Clock, Terminal } from "lucide-react";

type PromptItem = {
  title: string;
  promptText: string;
  platform?: string;
};

function extractToolCalls(text: string) {
  const lines = (text || "")
    .split("\n")
    .filter((l) => l.trim().length > 5);

  const tools = [
    {
      name: "search_web",
      args: { query: lines[0]?.trim().slice(0, 60) || "relevant information" },
      result: "Found 12 relevant results",
      status: "success" as const,
      elapsed: "0.4s",
    },
    {
      name: "extract_data",
      args: { source: "search_results", format: "json" },
      result: `{ "items": 8, "relevance": 0.94 }`,
      status: "success" as const,
      elapsed: "0.2s",
    },
    {
      name: "generate_response",
      args: { prompt: lines[1]?.trim().slice(0, 50) || "synthesize findings", style: "concise" },
      result: lines[2]?.trim().slice(0, 80) || "Output synthesized and ready for delivery.",
      status: "success" as const,
      elapsed: "1.1s",
    },
  ];

  return tools;
}

export function ToolCallOutput({ prompt, isPurchased }: { prompt: PromptItem; isPurchased: boolean }) {
  const tools = extractToolCalls(prompt.promptText);
  const visible = isPurchased ? tools : tools.slice(0, 1);

  return (
    <div className="relative rounded-2xl border border-border/60 bg-zinc-950 overflow-hidden text-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-zinc-900">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <span className="text-[11px] font-mono text-zinc-400">agent_trace.log</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-mono">Running</span>
        </div>
      </div>

      {/* Tool calls */}
      <div className="p-4 space-y-3 min-h-[260px] relative">
        {/* Model header */}
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono mb-4">
          <Bot className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary">agent</span>
          <span className="opacity-40">•</span>
          <span>{prompt.platform || "AI"}</span>
          <span className="opacity-40">•</span>
          <span>Task: {prompt.title?.slice(0, 40)}</span>
        </div>

        {visible.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="border border-white/10 rounded-xl overflow-hidden"
          >
            {/* Tool name */}
            <div className="flex items-center justify-between px-3 py-2 bg-white/5">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[12px] font-mono font-bold text-amber-300">{tool.name}()</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] text-zinc-500 font-mono">{tool.elapsed}</span>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Args */}
            <div className="px-3 py-2 bg-zinc-900/60 border-b border-white/5">
              <div className="text-[10px] text-zinc-600 font-mono mb-1">INPUT</div>
              <pre className="text-[11px] font-mono text-zinc-300 whitespace-pre-wrap">
                {JSON.stringify(tool.args, null, 2)}
              </pre>
            </div>

            {/* Result */}
            <div className="px-3 py-2 bg-emerald-950/30">
              <div className="text-[10px] text-emerald-600 font-mono mb-1">OUTPUT</div>
              <p className="text-[11px] font-mono text-emerald-300">{tool.result}</p>
            </div>
          </motion.div>
        ))}

        {/* Blur overlay */}
        {!isPurchased && (
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent flex flex-col items-center justify-end pb-6 gap-1">
            <p className="text-xs text-zinc-400 font-semibold">Unlock to view full agent trace</p>
          </div>
        )}
      </div>

      {isPurchased && (
        <div className="px-4 py-2.5 border-t border-white/5 bg-zinc-900 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span>3 tool calls</span>
          <span>Total: 1.7s</span>
          <span className="text-emerald-400">✓ All passed</span>
        </div>
      )}
    </div>
  );
}
