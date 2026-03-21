"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PLATFORMS = ["ChatGPT", "Midjourney", "Claude", "Stable Diffusion"];

interface FilterPanelProps {
  show: boolean;
  priceRange: number[];
  setPriceRange: (val: number[]) => void;
  selectedPlatforms: string[];
  togglePlatform: (p: string) => void;
  minRating: number | null;
  setMinRating: (r: number | null) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
}

export function FilterPanel({ 
  show, priceRange, setPriceRange, selectedPlatforms, togglePlatform, minRating, setMinRating, sortBy, setSortBy 
}: FilterPanelProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden bg-secondary p-8 rounded-2xl border border-border"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Platform</label>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map((platform) => (
              <Button
                key={platform}
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-lg h-9 border-border/40 font-bold text-[10px] uppercase tracking-wider transition-all",
                  selectedPlatforms.includes(platform) ? "bg-primary text-white border-primary" : "bg-background hover:bg-muted"
                )}
                onClick={() => togglePlatform(platform)}
              >
                {platform}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Price Range</label>
          <Slider value={priceRange} max={1000} step={10} onValueChange={setPriceRange} className="py-2" />
          <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Min Rating</label>
          <div className="flex gap-2">
            {[4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-lg h-9 flex-grow border-border/40 font-bold text-xs",
                  minRating === rating ? "bg-primary text-white border-primary" : "bg-background hover:bg-muted"
                )}
                onClick={() => setMinRating(minRating === rating ? null : rating)}
              >
                {rating}★
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Sort Direction</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 w-full rounded-lg bg-background border-border/40 gap-2 font-bold px-4 text-[10px] uppercase tracking-wider">
                {sortBy} <ChevronDown className="w-3 h-3 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 rounded-lg border-border/40 min-w-[200px]">
              {["Newest First", "Price: Low to High", "Price: High to Low", "Most Purchased"].map((option) => (
                <DropdownMenuItem key={option} className="text-[10px] font-bold uppercase tracking-wider p-2 cursor-pointer" onClick={() => setSortBy(option)}>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
