"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { FilterDropdown } from "./FilterDropdown";
import {
  CATEGORY_SECTION,
  OUTPUT_FORMAT_SECTION,
  PLATFORM_SECTION,
  TARGET_AUDIENCE_SECTION,
} from "./filter-config";

type OpenSections = Record<string, boolean>;
type SelectedFilters = Record<string, string[]>;

type ExploreFilterSidebarProps = {
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
  dynamicSections?: { id: string; title: string; options: string[] }[];
  categorySubcategoryMap?: Record<string, string[]>;
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
            "w-4 h-4 rounded-md border transition-colors shrink-0 inline-flex items-center justify-center",
            checked ? "border-primary text-primary" : "border-border/70 text-transparent"
          )}
        >
          <Check className="w-3 h-3" />
        </span>
        <span className="text-[13px] text-foreground/90 group-hover:text-foreground truncate">{label}</span>
      </div>
      <span className="text-[11px] text-muted-foreground font-bold shrink-0">{count ?? 0}</span>
    </button>
  );
}

function SidebarBody({
  selectedFilters,
  openSections,
  toggleSection,
  toggleFilterOption,
  optionCounts,
  priceRange,
  setPriceRange,
  isMobile = false,
  dynamicSections = [],
  categorySubcategoryMap = {},
}: SidebarBodyProps) {
  const sections = useMemo(() => {
    if (dynamicSections && dynamicSections.length > 0) return dynamicSections;
    return [PLATFORM_SECTION, CATEGORY_SECTION, OUTPUT_FORMAT_SECTION, TARGET_AUDIENCE_SECTION];
  }, [dynamicSections]);

  const titleMap: Record<string, string> = {
    platform: "Platform",
    category: "Category",
    subcategory: "Subcategory",
    outputFormat: "Output type",
    targetAudience: "Audience",
  };

  return (
    <div className={cn("space-y-1 pr-1 pb-0", isMobile && "overflow-y-auto max-h-[calc(100vh-15rem)]")}>
      {sections.map((section: any) => {
        if (section.id === "category") {
          return (
            <FilterDropdown
              key={section.id}
              title={titleMap[section.id] || section.title}
              isOpen={Boolean(openSections[section.id])}
              onToggle={() => toggleSection(section.id)}
            >
              <div className="space-y-0.5">
                {(section.options || []).map((option: string) => {
                  const isCategoryChecked = selectedFilters.category?.includes(option) ?? false;
                  const subcategories = categorySubcategoryMap[option] || [];

                  return (
                    <div key={option} className="space-y-1">
                      <OptionRow
                        checked={isCategoryChecked}
                        label={option}
                        count={optionCounts[`category:${option}`]}
                        onToggle={() => toggleFilterOption("category", option)}
                      />

                      {isCategoryChecked && subcategories.length > 0 ? (
                        <div className="ml-6 space-y-0.5 border-l border-border/60 pl-3">
                          {subcategories.map((subcategory) => (
                            <OptionRow
                              key={`${option}:${subcategory}`}
                              checked={selectedFilters.subcategory?.includes(subcategory) ?? false}
                              label={subcategory}
                              count={optionCounts[`subcategory:${subcategory}`]}
                              onToggle={() => toggleFilterOption("subcategory", subcategory)}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </FilterDropdown>
          );
        }

        return (
          <FilterDropdown
            key={section.id}
            title={titleMap[section.id] || section.title}
            isOpen={Boolean(openSections[section.id])}
            onToggle={() => toggleSection(section.id)}
          >
            <div className="space-y-0.5">
              {(section.options || []).map((option: any) => (
                <OptionRow
                  key={option}
                  checked={selectedFilters[section.id]?.includes(option) ?? false}
                  label={option}
                  count={optionCounts[`${section.id}:${option}`]}
                  onToggle={() => toggleFilterOption(section.id, option)}
                />
              ))}
            </div>
          </FilterDropdown>
        );
      })}

      <FilterDropdown
        title="Pricing"
        rightLabel={`₹${priceRange[0]} - ₹${priceRange[1]}`}
        isOpen={Boolean(openSections.priceRange)}
        onToggle={() => toggleSection("priceRange")}
      >
        <div className="pt-3 pb-1 space-y-4">
          <Slider
            min={0}
            max={500}
            step={5}
            value={priceRange}
            onValueChange={(value) => setPriceRange([value[0], value[1]])}
            className="py-1"
          />
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>₹ {priceRange[0]}</span>
            <span>Up to ₹ {priceRange[1]}</span>
          </div>
        </div>
      </FilterDropdown>
    </div>
  );
}

export function ExploreFilterSidebar(props: ExploreFilterSidebarProps) {
  return (
    <>
      <aside className="hidden lg:block self-start">
        <div className="mb-3 px-1 pb-3 border-b border-border/60">
          <h2 className="text-4xl font-medium text-foreground">Filter</h2>
        </div>

        <SidebarBody {...props} />
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
              <div className="h-full bg-background p-4">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/60">
                  <h2 className="text-2xl font-semibold text-foreground">Filter</h2>
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
