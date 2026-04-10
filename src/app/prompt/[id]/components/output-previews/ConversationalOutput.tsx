"use client";

import { motion } from "framer-motion";
import { Bot, User, SendHorizontal, Sparkles } from "lucide-react";

type PromptItem = {
  title: string;
  promptText: string;
  platform?: string;
  category?: string;
};

function generateConversation(prompt: PromptItem) {
  const lines = (prompt.promptText || "")
    .split("\n")
    .filter((l) => l.trim().length > 20)
    .slice(0, 6);

  const userMsg =
    lines[0]?.trim() ||
    `I need help with: ${prompt.title || "this task"}`;

  const aiMsg =
    lines.slice(1, 3).join(" ").trim() ||
    `Sure! Based on your request, here's what I've prepared for you. This prompt is optimised for ${prompt.platform || "any AI model"} and will give you highly contextual, actionable output tailored to your needs.`;

  const followUp =
    lines[3]?.trim() ||
    "Can you make it more concise?";

  const aiFollowUp =
    lines[4]?.trim() ||
    "Absolutely! Here's the refined version with the core highlights only.";

  return [
    { role: "user", content: userMsg },
    { role: "ai", content: aiMsg },
    ...(lines.length > 2
      ? [
          { role: "user", content: followUp },
          { role: "ai", content: aiFollowUp },
        ]
      : []),
  ];
}

export function ConversationalOutput({ prompt, isPurchased }: { prompt: PromptItem; isPurchased: boolean }) {
  const messages = generateConversation(prompt);
  const visible = isPurchased ? messages : messages.slice(0, 2);

  return (
    <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-muted/40">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{prompt.platform || "AI Assistant"}</p>
          <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Online
          </p>
        </div>
        <div className="ml-auto">
          <Sparkles className="w-4 h-4 text-primary/60" />
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-4 min-h-[260px] relative">
        {visible.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
          >
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}

            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted/60 border border-border/40 text-foreground rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}

        {/* AI typing indicator */}
        {isPurchased && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: visible.length * 0.12 + 0.2 }}
            className="flex gap-2 items-center"
          >
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-muted/60 border border-border/40 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
              {[0, 0.15, 0.3].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, delay, duration: 0.6 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Blur overlay */}
        {!isPurchased && (
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-card via-card/80 to-transparent flex flex-col items-center justify-end pb-6 gap-1">
            <p className="text-xs text-muted-foreground font-semibold">Unlock to see the full conversation</p>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-border/40 bg-muted/30">
        <div className="flex items-center gap-3 bg-card border border-border/40 rounded-xl px-4 py-2.5 opacity-50 cursor-not-allowed">
          <input
            disabled
            placeholder={`Message ${prompt.platform || "AI"}...`}
            className="flex-1 bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/50"
          />
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <SendHorizontal className="w-3.5 h-3.5 text-primary/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
