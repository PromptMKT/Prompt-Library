"use client";

import { ChevronLeft, ChevronRight, Maximize2, Cpu, Tags, X } from "lucide-react";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  platform?: string;
  category?: string;
}

export function ImageGallery({ images, platform, category }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasMultipleImages = images && images.length > 1;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="relative rounded-[1.25rem] overflow-hidden bg-card shadow-sm dark:shadow-none border border-border/40 mb-6 group">
        <div className="relative w-full aspect-[16/9] flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary to-background">
          {images?.[currentIndex] ? (
            <img src={images[currentIndex]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-zoom-in" alt="Main Preview" onClick={() => setIsFullscreen(true)} />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center overflow-hidden">
              <div className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-[spin_10s_linear_infinite]" />
              <div className="text-center relative z-10">
                <div className="text-4xl mb-2">✦</div>
                <div className="font-mono text-xs text-primary/70 font-bold uppercase tracking-widest">Output Preview</div>
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md border border-border/40 text-primary font-mono text-[11px] px-3 py-1.5 rounded-full font-bold">
            ⬡ Output {images?.length ? currentIndex + 1 : 1} of {images?.length || 3}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            {hasMultipleImages && (
              <>
                <button onClick={prevImage} className="bg-background/80 backdrop-blur-md border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary transition-colors p-2 rounded-lg flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextImage} className="bg-background/80 backdrop-blur-md border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary transition-colors p-2 rounded-lg flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            <button onClick={() => setIsFullscreen(true)} className="bg-background/80 backdrop-blur-md border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary transition-colors p-2 rounded-lg flex items-center justify-center">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {images && images.length > 0 && (
          <div className="flex gap-2 p-3 bg-secondary/10 border-t border-border/50 overflow-x-auto scrollbar-hide">
            {images.slice(0, 3).map((img, i) => (
              <div key={i} onClick={() => setCurrentIndex(i)} className={`w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${i === currentIndex ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}>
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
              </div>
            ))}
            
            {/* RELEVANT PLACEHOLDERS FOR 1 IMAGE */}
            {images.length === 1 && (
              <>
                <div className="w-16 h-12 flex-shrink-0 rounded-lg border-2 border-dashed border-border/50 flex flex-col items-center justify-center bg-card shadow-sm cursor-pointer" title={`Platform: ${platform || 'AI'}`}>
                  <Cpu className="w-4 h-4 text-primary/60 mb-0.5" />
                  <div className="text-[8px] font-mono text-muted-foreground uppercase opacity-70 truncate px-1 w-full text-center">{platform || 'AI'}</div>
                </div>
                <div className="w-16 h-12 flex-shrink-0 rounded-lg border-2 border-dashed border-border/50 flex flex-col items-center justify-center bg-card shadow-sm cursor-pointer" title={`Category: ${category || 'Prompt'}`}>
                  <Tags className="w-4 h-4 text-primary/60 mb-0.5" />
                  <div className="text-[8px] font-mono text-muted-foreground uppercase opacity-70 truncate px-1 w-full text-center">{category || 'Prompt'}</div>
                </div>
              </>
            )}

            {images.length > 3 && (
              <div onClick={() => setCurrentIndex(3)} className={`w-16 h-12 flex-shrink-0 rounded-lg border-2 border-dashed ${currentIndex >= 3 ? 'border-primary text-primary' : 'border-muted-foreground/30 text-muted-foreground hover:border-primary/50'} flex items-center justify-center cursor-pointer transition-all text-xs font-medium`}>
                +{images.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FIXED SIZE MODAL */}
      {isFullscreen && images?.[currentIndex] && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200" onClick={() => setIsFullscreen(false)}>
          <div className="relative w-full max-w-5xl bg-card border border-border/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-border/40 bg-secondary/10">
              <div className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Output {currentIndex + 1} of {images.length}
              </div>
              <button onClick={() => setIsFullscreen(false)} className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="relative w-full h-[65vh] bg-secondary/5 flex items-center justify-center p-2 md:p-6">
              {hasMultipleImages && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground p-2 md:p-3 rounded-full shadow-md transition-colors z-10 border border-border/40">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground p-2 md:p-3 rounded-full shadow-md transition-colors z-10 border border-border/40">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <img 
                src={images[currentIndex]} 
                className="max-w-full max-h-full object-contain drop-shadow-lg rounded-md" 
                alt={`Preview ${currentIndex + 1}`} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
