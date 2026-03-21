"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterDropdownProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  rightLabel?: string;
};

export function FilterDropdown({ title, isOpen, onToggle, children, rightLabel }: FilterDropdownProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-foreground/85">{title}</span>
          {rightLabel ? <span className="text-[10px] text-muted-foreground font-bold">{rightLabel}</span> : null}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
