"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, Settings, Maximize, SkipBack, SkipForward } from "lucide-react";

type PromptItem = {
  title: string;
  images: string[];
  platform?: string;
  category?: string;
};

export function VideoOutput({ prompt, isPurchased }: { prompt: PromptItem; isPurchased: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);

  const thumbnail = prompt.images?.[0] || null;

  const toggle = () => {
    if (!isPurchased) return;
    setIsPlaying((p) => !p);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(interval); setIsPlaying(false); return 0; }
          return p + 0.4;
        });
      }, 100);
    }
  };

  const formatTime = (pct: number) => {
    const total = 225; // 3:45
    const secs = Math.floor((pct / 100) * total);
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };

  return (
    <div className="relative rounded-2xl border border-border/60 bg-black overflow-hidden group">
      {/* Video viewport */}
      <div
        className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onClick={toggle}
      >
        {/* Thumbnail / Background */}
        {thumbnail ? (
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className={`w-full h-full object-cover transition-all ${
              !isPurchased ? "blur-md brightness-75" : isPlaying ? "brightness-75" : "brightness-90"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <div className="text-zinc-600 text-sm">Video preview</div>
          </div>
        )}

        {/* Scanlines overlay for style */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)] pointer-events-none" />

        {/* Play button center */}
        {!isPlaying && isPurchased && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-full bg-black/60 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm"
            >
              <Play className="w-7 h-7 text-white ml-1 fill-white" />
            </motion.div>
          </div>
        )}

        {/* Lock overlay */}
        {!isPurchased && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
              <Play className="w-6 h-6 text-white/60 ml-1" />
            </div>
            <p className="text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-full">
              Unlock to watch video preview
            </p>
          </div>
        )}

        {/* Controls overlay */}
        <AnimatePresence>
          {showControls && isPurchased && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress bar */}
              <div className="mb-3 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <button className="hover:text-primary transition-colors">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button onClick={toggle} className="hover:text-primary transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>
                  <button className="hover:text-primary transition-colors">
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4" />
                    <div className="w-14 h-1 bg-white/20 rounded-full">
                      <div className="w-3/4 h-full bg-white rounded-full" />
                    </div>
                  </div>
                  <span className="text-xs font-mono ml-2 opacity-80">
                    {formatTime(progress)} / 3:45
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded border border-white/10">4K</div>
                  <button className="hover:text-primary transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="hover:text-primary transition-colors">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info bar */}
      <div className="px-4 py-3 bg-zinc-900 border-t border-white/5">
        <p className="text-sm font-semibold text-white line-clamp-1">{prompt.title}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{prompt.platform || "AI"} • Video output • 3:45</p>
      </div>
    </div>
  );
}
