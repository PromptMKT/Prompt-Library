"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Download, Volume2, FastForward, Rewind } from "lucide-react";
import { motion } from "framer-motion";

export function AudioOutput() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35); // mock progress
  
  // Fake progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full">
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/50 shadow-xl relative overflow-hidden group">
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          
          {/* Cover Art Profile */}
          <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl relative border border-border/30">
            <img 
              src="https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=800&auto=format&fit=crop" 
              alt="Audio Cover" 
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1">
                <div className="flex items-end justify-center gap-[3px] h-8 overflow-hidden">
                   {[1,2,3,4,5].map((bar) => (
                     <motion.div 
                       key={bar}
                       className="w-1.5 bg-white rounded-t-full"
                       animate={{ height: [10, 30, 15, 25, 12] }}
                       transition={{ repeat: Infinity, duration: 1 + (bar * 0.1), ease: "easeInOut", repeatType: "mirror" }}
                     />
                   ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 w-full space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                  Generated Voice
                </span>
                <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <h4 className="text-2xl font-bold tracking-tight text-foreground">Epic Corporate Voiceover</h4>
              <p className="text-muted-foreground text-sm mt-1">ElevenLabs • Deep Voice model</p>
            </div>

            {/* Simulated Waveform (Static SVG or CSS blocks) */}
            <div className="h-10 w-full flex items-center gap-0.5 opacity-60">
              {Array.from({ length: 50 }).map((_, i) => {
                const height = Math.random() * 80 + 20; // random height
                const isPassed = i < (progress / 100) * 50;
                return (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-colors duration-300 ${isPassed ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    style={{ height: `${height}%` }}
                  />
                )
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                00:{Math.floor(progress * 0.45).toString().padStart(2, '0')}
              </span>
              
              <div className="flex items-center gap-4">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Rewind className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <FastForward className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-muted-foreground rounded-full"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
