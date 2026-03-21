"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterDropdown } from "./FilterDropdown";
import {
  CATEGORY_SECTION,
  COMPLEXITY_OPTIONS,
  MIN_RATING_OPTIONS,
  OUTPUT_FORMAT_SECTION,
  PLATFORM_FILTER_SECTIONS,
  TARGET_AUDIENCE_SECTION,
} from "./filter-config";

type OpenSections = Record<string, boolean>;
type SelectedFilters = Record<string, string[]>;

type ExploreFilterSidebarProps = {
  sidebarSearch: string;
  onSidebarSearchChange: (value: string) => void;
  selectedFilters: SelectedFilters;
  openSections: OpenSections;
  toggleSection: (sectionId: string) => void;
  toggleFilterOption: (sectionId: string, option: string) => void;
  optionCounts: Record<string, number>;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  minRating: number | null;
  setMinRating: (value: number | null) => void;
  complexity: string;
  setComplexity: (value: string) => void;
  clearAll: () => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

type SidebarBodyProps = Omit<ExploreFilterSidebarProps, "mobileOpen" | "setMobileOpen"> & {
  isMobile?: boolean;
};

function OptionRow({
  checked,
  label,
  count,
  onToggle,
}: {
  checked: boolean;
  label: string;
  count?: number;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-2 py-1.5 text-left group"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={cn(
            "w-4 h-4 rounded-md border transition-colors shrink-0",
            checked ? "bg-primary border-primary" : "border-border/70 bg-transparent"
          )}
        />
        <span className="text-[13px] text-foreground/90 group-hover:text-foreground truncate">{label}</span>
      </div>
      <span className="text-[11px] text-muted-foreground font-bold shrink-0">{count ?? 0}</span>
    </button>
  );
}

function SidebarBody({
  sidebarSearch,
  onSidebarSearchChange,
  selectedFilters,
  openSections,
  toggleSection,
  toggleFilterOption,
  optionCounts,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  complexity,
  setComplexity,
  clearAll,
  isMobile = false,
}: SidebarBodyProps) {
  const searchableSections = useMemo(
    () => [...PLATFORM_FILTER_SECTIONS, CATEGORY_SECTION, TARGET_AUDIENCE_SECTION, OUTPUT_FORMAT_SECTION],
    []
  );

  const query = sidebarSearch.trim().toLowerCase();

  const visibleSections = useMemo(() => {
    if (!query) return searchableSections;

    return searchableSections
      .map((section) => ({
        ...section,
        options: section.options.filter((option) => option.toLowerCase().includes(query)),
      }))
      .filter((section) => section.options.length > 0 || section.title.toLowerCase().includes(query));
  }, [query, searchableSections]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border/60 bg-card/80 p-3 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={sidebarSearch}
            onChange={(e) => onSidebarSearchChange(e.target.value)}
            placeholder="Search filters..."
            className="w-full h-10 rounded-xl border border-border/60 bg-background/70 pl-9 pr-3 text-sm outline-none focus:border-primary/50"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={clearAll}
          className="mt-2 w-full justify-center text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground hover:text-primary"
        >
          Clear all filters
        </Button>
      </div>

      <div className={cn("space-y-3 pr-1 pb-8", isMobile && "overflow-y-auto max-h-[calc(100vh-15rem)]")}>
        {visibleSections.map((section) => (
          <FilterDropdown
            key={section.id}
            title={section.title}
            isOpen={Boolean(openSections[section.id])}
            onToggle={() => toggleSection(section.id)}
          >
            <div className="space-y-0.5">
              {section.options.length === 0 ? (
                <p className="text-xs text-muted-foreground py-1">No matches</p>
              ) : (
                section.options.map((option) => (
                  <OptionRow
                    key={option}
                    checked={selectedFilters[section.id]?.includes(option) ?? false}
                    label={option}
                    count={optionCounts[`${section.id}:${option}`]}
                    onToggle={() => toggleFilterOption(section.id, option)}
                  />
                ))
              )}
            </div>
          </FilterDropdown>
        ))}

        <FilterDropdown
          title="Price Range"
          rightLabel={`₹${priceRange[0]} - ₹${priceRange[1]}`}
          isOpen={Boolean(openSections.priceRange)}
          onToggle={() => toggleSection("priceRange")}
        >
          <div className="pt-2 space-y-4">
            <Slider
              min={10}
              max={500}
              step={5}
              value={priceRange}
              onValueChange={(value) => setPriceRange([value[0], value[1]])}
            />
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>₹ {priceRange[0]}</span>
              <span>Up to ₹ {priceRange[1]}</span>
            </div>
          </div>
        </FilterDropdown>

        <FilterDropdown
          title="Minimum Rating"
          isOpen={Boolean(openSections.minRating)}
          onToggle={() => toggleSection("minRating")}
        >
          <div className="space-y-2">
            {MIN_RATING_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setMinRating(option.value)}
                className={cn(
                  "w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors",
                  minRating === option.value
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-background/50 border-border/60 text-foreground/80 hover:bg-muted/40"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown
          title="Complexity"
          isOpen={Boolean(openSections.complexity)}
          onToggle={() => toggleSection("complexity")}
        >
          <div className="flex flex-wrap gap-2">
            {COMPLEXITY_OPTIONS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setComplexity(level)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-black tracking-wide transition-colors",
                  complexity === level
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </FilterDropdown>
      </div>
    </div>
  );
}

export function ExploreFilterSidebar(props: ExploreFilterSidebarProps) {
  return (
    <>
      <aside className="hidden lg:block self-start">
        <div className="rounded-3xl border border-border/50 bg-card/70 p-4 backdrop-blur-md shadow-[0_20px_40px_rgba(13,15,40,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-foreground/85">Filters</h2>
            </div>
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </div>

          <SidebarBody {...props} />
        </div>
      </aside>

      <AnimatePresence>
        {props.mobileOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => props.setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.aside
              initial={{ x: -340, opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -340, opacity: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden fixed left-0 top-16 bottom-0 w-[86vw] max-w-85 z-50 p-3"
            >
              <div className="h-full rounded-3xl border border-border/60 bg-card/95 p-4 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-black uppercase tracking-[0.16em] text-foreground/85">Filters</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => props.setMobileOpen(false)}
                    className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted/50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <SidebarBody {...props} isMobile />
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
