"use client";

import React, { useState } from "react";
import { Play, Pause, Maximize, Volume2, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function VideoOutput() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls simulation
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  return (
    <div className="w-full flex items-center justify-center">
      <div 
        className="relative w-full max-w-[600px] xl:max-w-[720px] aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group border border-border/20 cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onMouseMove={() => setShowControls(true)}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {/* Mock Video Content (Image + overlay) */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1621640786029-220e988dd76c?q=80&w=2574&auto=format&fit=crop" 
            alt="Video Preview"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Big Center Play Button (only when paused) */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-2xl transition-transform hover:scale-110">
                <Play className="w-10 h-10 ml-2" fill="white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Bar Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicking controls from toggling video
              className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex flex-col gap-4 z-20 bg-gradient-to-t from-black/90 pb-4 pt-12"
            >
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/30 rounded-full relative overflow-hidden group/bar cursor-pointer">
                <div 
                  className={`absolute left-0 top-0 h-full bg-primary rounded-full ${isPlaying ? "w-1/3" : "w-[12%]"}`}
                  style={{ transition: isPlaying ? 'width 10s linear' : 'none' }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-6">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-primary transition-colors">
                    {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6" fill="currentColor" />}
                  </button>
                  <div className="flex items-center gap-2 group/vol">
                    <Volume2 className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                    <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                      <div className="w-20 h-1 bg-white/30 rounded-full mt-2">
                        <div className="w-1/2 h-full bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-sm opacity-80 hidden sm:block">01:14 / 03:45</span>
                </div>

                <div className="flex items-center gap-5">
                  <div className="bg-white/10 px-2 py-0.5 rounded textxs font-medium border border-white/20">4K</div>
                  <button className="hover:text-primary transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="hover:text-primary transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
