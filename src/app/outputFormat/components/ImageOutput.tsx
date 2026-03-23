"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Download } from "lucide-react";

const IMAGE_MOCKS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", // Abstract landscape
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop", // Future UI
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop", // Dark minimal
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop"  // Circuit
];

export function ImageOutput() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full h-full min-h-[300px] flex flex-col md:flex-row gap-3 md:gap-4">
        {/* Main Image */}
        <motion.div 
          layoutId="image-main"
          className="relative flex-1 rounded-2xl overflow-hidden bg-secondary border border-border/40 group cursor-zoom-in min-h-[250px]"
          onClick={() => setIsModalOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIdx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={IMAGE_MOCKS[activeIdx]}
              alt={`Output variation ${activeIdx + 1}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </AnimatePresence>
          
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md p-2 rounded-lg text-foreground border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4" />
          </div>

          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-border/50 text-muted-foreground shadow-sm max-w-[80%] truncate">
            Midjourney v6 • Variation {activeIdx + 1}
          </div>
        </motion.div>

        {/* Thumbnails */}
        <div className="flex md:flex-col gap-2 md:gap-3 md:w-28 lg:w-36 flex-shrink-0 overflow-x-auto md:overflow-hidden scrollbar-hide pb-2 md:pb-0 h-full">
          {IMAGE_MOCKS.map((img, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => setActiveIdx(idx)}
              className={`relative cursor-pointer w-24 md:w-full md:flex-1 min-h-[64px] min-w-[64px] flex-shrink-0 aspect-[4/3] md:aspect-auto rounded-xl overflow-hidden border-2 transition-all ${
                activeIdx === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative max-w-5xl w-full h-[80vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-0 right-0 flex gap-4 z-10">
                 <button className="bg-card hover:bg-secondary p-3 rounded-full border border-border text-foreground transition-colors shadow-xl">
                   <Download className="w-5 h-5" />
                 </button>
                 <button onClick={() => setIsModalOpen(false)} className="bg-card hover:bg-secondary p-3 rounded-full border border-border text-foreground transition-colors shadow-xl">
                   <X className="w-5 h-5" />
                 </button>
              </div>
              
              <motion.img
                layoutId="image-main"
                src={IMAGE_MOCKS[activeIdx]}
                alt="Fullscreen output view"
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
