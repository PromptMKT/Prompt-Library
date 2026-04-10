"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic, Music } from "lucide-react";

type PromptItem = {
  title: string;
  category?: string;
  platform?: string;
};

const WAVEFORM_BARS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.sin(i * 0.6) * 30 + Math.sin(i * 1.1) * 20 + 40;
  return Math.max(8, Math.min(70, h));
});

export function AudioOutput({ prompt, isPurchased }: { prompt: PromptItem; isPurchased: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (!isPurchased) return;
    setIsPlaying((p) => !p);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(interval); setIsPlaying(false); return 0; }
          return p + 0.5;
        });
      }, 100);
    }
  };

  return (
    <div className="relative rounded-2xl border border-border/60 bg-gradient-to-br from-indigo-950/60 via-card to-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Music className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground line-clamp-1">{prompt.title}</p>
          <p className="text-xs text-muted-foreground">{prompt.platform || "AI"} • Audio / TTS</p>
        </div>
      </div>

      {/* Waveform */}
      <div className="px-5 pt-6 pb-4">
        <div className={`flex items-center gap-0.5 h-20 relative ${!isPurchased ? "blur-sm" : ""}`}>
          {WAVEFORM_BARS.map((h, i) => {
            const isFilled = (i / WAVEFORM_BARS.length) * 100 <= progress;
            return (
              <motion.div
                key={i}
                initial={{ scaleY: 0.3 }}
                animate={{ scaleY: isPlaying ? [0.3, 1, 0.5, 0.8, 0.3][i % 5] : 1 }}
                transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0, delay: i * 0.02 }}
                className={`flex-1 rounded-full transition-colors ${
                  isFilled ? "bg-primary" : "bg-primary/20"
                }`}
                style={{ height: `${h}%`, transformOrigin: "center" }}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-primary/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Times */}
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1.5">
          <span>{Math.floor((progress / 100) * 185)}s</span>
          <span>3:05</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 py-5 border-t border-white/5">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={toggle}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 transition-all hover:scale-105 ${
            isPurchased ? "bg-primary text-primary-foreground" : "bg-primary/30 text-primary/50 cursor-not-allowed"
          }`}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-5 pb-5">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="w-3/4 h-full bg-muted-foreground rounded-full" />
        </div>
        <Mic className="w-4 h-4 text-muted-foreground" />
      </div>

      {!isPurchased && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[2px]">
          <p className="text-sm font-bold text-foreground bg-card/90 border border-border/60 px-5 py-2.5 rounded-full shadow-xl">
            Unlock to play audio preview
          </p>
        </div>
      )}
    </div>
  );
}
