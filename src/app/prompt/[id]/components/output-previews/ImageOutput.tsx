"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, ChevronLeft, ChevronRight, Download } from "lucide-react";

type PromptItem = {
  title: string;
  images: string[];
  category?: string;
};

export function ImageOutput({ prompt, isPurchased }: { prompt: PromptItem; isPurchased: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = prompt.images?.length
    ? prompt.images
    : ["/placeholder-image.png"];

  const visibleImages = isPurchased ? images : images.slice(0, 1);

  const handlePrev = () => setActiveIdx((p) => Math.max(0, p - 1));
  const handleNext = () => setActiveIdx((p) => Math.min(images.length - 1, p + 1));

  return (
    <>
      <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/40">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-[11px] font-mono text-muted-foreground">image_output.png</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {activeIdx + 1} / {visibleImages.length}
          </span>
        </div>

        <div className="p-4 space-y-3">
          {/* Main Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/40 border border-border/40 group">
            {visibleImages[activeIdx] ? (
              <img
                src={visibleImages[activeIdx]}
                alt={`Output image ${activeIdx + 1}`}
                className={`w-full h-full object-cover transition-all duration-300 ${!isPurchased ? "blur-md" : ""}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-muted-foreground text-sm">Image output preview</div>
              </div>
            )}

            {isPurchased && (
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <a
                  href={visibleImages[activeIdx]}
                  download
                  className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Navigation arrows */}
            {visibleImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={activeIdx === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={activeIdx === visibleImages.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {!isPurchased && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <p className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full">
                  Unlock to view HD output
                </p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {visibleImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {visibleImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeIdx ? "border-primary" : "border-border/40 hover:border-primary/50"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="absolute top-4 right-4 flex gap-3">
              <a
                href={visibleImages[activeIdx]}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              >
                <Download className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <motion.img
              layoutId="image-main"
              src={visibleImages[activeIdx]}
              alt="Fullscreen"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
