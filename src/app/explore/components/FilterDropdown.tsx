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
    <div className="border-b border-border/60 bg-transparent">
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left bg-transparent hover:bg-transparent transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium tracking-[0.01em] text-foreground/90">{title}</span>
          {rightLabel ? <span className="text-[11px] text-muted-foreground font-semibold">{rightLabel}</span> : null}
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
            <div className="pb-4">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
