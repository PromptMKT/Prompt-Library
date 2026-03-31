"use client";

import { useMemo, useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Grid3X3, List, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  getWishlistedIds 
} from "@/app/actions/wishlist";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ExploreFilterSidebar } from "./components/ExploreFilterSidebar";
import { ExplorePromptCard } from "./components/ExplorePromptCard";
import { TopCreatorsRow } from "./components/TopCreatorsRow";
import {
  AUDIENCE_TABS,
  CATEGORY_SECTION,
  OUTPUT_FORMAT_SECTION,
  PLATFORM_SECTION,
  TARGET_AUDIENCE_SECTION,
} from "./components/filter-config";
type PromptRecord = {
  id: string;
  title: string;
  short_description?: string;
  images?: string[];
  rating?: number;
  sales?: number;
  tags?: string[];
  seller?: string;
  price?: number;
  platform?: string;
  category?: string;
  subcategory?: string;
  promptText?: string;
  prompt_text?: string;
  output_type?: string;
  difficulty?: string;
  full_description?: string;
  models?: string[];
  targetAudience?: string[];
  createdAt?: string;
};

type ExploreDataset = {
  topCreators: { name: string; prompts: number; sales: number; score: number }[];
  trendingTags: string[];
  prompts: PromptRecord[];
};

type FilterSelections = Record<string, string[]>;
type OpenSections = Record<string, boolean>;

const EMPTY_DATASET: ExploreDataset = {
  topCreators: [],
  trendingTags: ["All"],
  prompts: [],
};

const PLATFORM_SECTION_IDS = new Set([
  "platform",
  "textMultimodal",
  "imageGeneration",
  "videoGeneration",
  "audioVoice",
  "codingAgentic",
]);

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Text generation": ["text", "email", "script", "copy", "article", "thread", "linkedin"],
  "Image & visual": ["image", "midjourney", "flux", "stable diffusion", "dall-e", "visual", "render"],
  "Code & technical": ["code", "technical", "developer", "api", "react", "next", "python"],
  "Data & analysis": ["data", "analysis", "analytics", "research", "report", "sql", "risk"],
  "Audio & voice": ["audio", "voice", "podcast", "music", "interview"],
  "Video generation": ["video", "short", "reel", "youtube", "runway", "storyboard"],
  "Agentic & workflow": ["agent", "automation", "workflow", "tool", "task"],
  "Role & persona simulation": ["persona", "customer", "support", "founder", "marketer", "designer", "developer"],
  "Strategy & planning": ["strategy", "planning", "roadmap", "prioritization", "gtm", "go to market"],
  "Learning & education": ["learning", "education", "tutor", "lesson", "curriculum", "study", "exam"],
};

const OUTPUT_KEYWORDS: Record<string, string[]> = {
  "Long-form text": ["long", "article", "guide", "essay", "document"],
  "Short copy": ["short", "tweet", "headline", "hook", "copy"],
  "Structured data": ["json", "yaml", "schema", "structured", "xml", "table"],
  Code: ["code", "typescript", "python", "react", "script"],
  "Image / visual": ["image", "render", "visual", "midjourney", "flux"],
  "Audio / music": ["audio", "music", "voice", "podcast"],
  Video: ["video", "reel", "youtube", "shorts"],
  Conversational: ["conversation", "chat", "dialogue", "assistant"],
  "Tool call / function": ["function", "tool", "api", "agent"],
  "Multiple outputs": ["multiple", "bundle", "variations"],
};

function normalize(input: string): string {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function getPromptText(prompt: PromptRecord): string {
  return normalize(
    [
      prompt.title,
      prompt.short_description,
      prompt.full_description,
      prompt.prompt_text,
      prompt.promptText,
      prompt.platform,
      prompt.category,
      prompt.subcategory,
      prompt.output_type,
      prompt.difficulty,
      ...(prompt.tags || []),
      ...(prompt.targetAudience || []),
      prompt.seller,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function matchesOption(sectionId: string, option: string, prompt: PromptRecord, promptText: string): boolean {
  const value = normalize(option);
  const platform = normalize(prompt.platform || "");
  const category = normalize(prompt.category || "");
  const outputType = normalize(prompt.output_type || "");

  if (PLATFORM_SECTION_IDS.has(sectionId)) {
    return platform.includes(value) || promptText.includes(value);
  }

  if (sectionId === "category") {
    const words = CATEGORY_KEYWORDS[option] || [];
    return words.some((word) => promptText.includes(word)) || category.includes(value) || outputType.includes(value);
  }

  if (sectionId === "targetAudience") {
    const audience = value.endsWith("s") ? value.slice(0, -1) : value;
    return (prompt.targetAudience || []).some((item) => normalize(item).includes(audience)) || promptText.includes(value);
  }

  if (sectionId === "outputFormat") {
    const words = OUTPUT_KEYWORDS[option] || [];
    if (words.length > 0) return words.some((word) => promptText.includes(word));
    return outputType.includes(value) || promptText.includes(value);
  }

  if (sectionId === "subcategory") {
    const subcategory = normalize(prompt.subcategory || "");
    return subcategory === value || promptText.includes(value);
  }

  return promptText.includes(value);
}

function ExploreAppleMark() {
  return (
    <svg
      width="74"
      height="74"
      viewBox="0 0 74 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-[#2F2F2F]"
    >
      <path
        d="M37.1 24.6C32.8 20.4 25 20.8 21.2 26.6C17.9 31.7 19.3 41.4 24.4 45.7C27.1 48 30.7 48.3 33.7 47.1C35.8 46.3 38.2 46.3 40.3 47.1C43.3 48.3 46.9 48 49.6 45.7C54.7 41.4 56.1 31.7 52.8 26.6C49 20.8 41.2 20.4 37.1 24.6Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41.4 17.2C42 13.8 44.4 11.2 47.8 10.5"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M31.4 15.3C34.6 14.7 37.4 16.4 38.9 19.3"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M8.8 55.1C8.8 51.7 11.5 49 14.9 49H59.1C62.5 49 65.2 51.7 65.2 55.1C65.2 58 63 60.3 60.1 60.6C55.4 61.2 48.2 61.9 37 61.9C25.8 61.9 18.6 61.2 13.9 60.6C11 60.3 8.8 58 8.8 55.1Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20.6 54.7H53.4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M24.9 57.7H49.1" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [dataset, setDataset] = useState<ExploreDataset>(EMPTY_DATASET);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

  const [selectedFilters, setSelectedFilters] = useState<FilterSelections>({});
  const [openSections, setOpenSections] = useState<OpenSections>({
    platform: false,
    category: false,
    targetAudience: false,
    outputFormat: false,
    priceRange: false,
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [complexity, setComplexity] = useState("All");
  const [activeTab, setActiveTab] = useState<(typeof AUDIENCE_TABS)[number]>("All prompts");
  const [activeTrend, setActiveTrend] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [cardSearch, setCardSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(16);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const baseSelect = `
          id,
          title,
          description,
          price,
          cover_image_url,
          created_at,
          platform_id,
          category_id,
          subcategory_id,
          creator_id,
          purchases_count,
          average_rating
        `;

        const joinedQuery = await supabase
          .from("prompts")
          .select(`
            ${baseSelect},
            platforms(name),
            categories(name),
            subcategories(name),
            users!prompts_creator_id_fkey(username, email, avatar_url)
          `)
          .order("created_at", { ascending: false })
          .limit(400);

        let rows: any[] = [];

        if (joinedQuery.error) {
          const plainQuery = await supabase
            .from("prompts")
            .select(baseSelect)
            .order("created_at", { ascending: false })
            .limit(400);

          if (plainQuery.error) throw plainQuery.error;

          const [platformsRes, categoriesRes, subcategoriesRes, usersRes] = await Promise.all([
            supabase.from("platforms").select("id, name"),
            supabase.from("categories").select("id, name"),
            supabase.from("subcategories").select("id, name"),
            supabase.from("users").select("id, username, email, avatar_url"),
          ]);

          const platformMap = new Map<string, string>();
          for (const row of platformsRes.data || []) platformMap.set(String(row.id), row.name || String(row.id));

          const categoryMap = new Map<string, string>();
          for (const row of categoriesRes.data || []) categoryMap.set(String(row.id), row.name || String(row.id));

          const subcategoryMap = new Map<string, string>();
          for (const row of subcategoriesRes.data || []) subcategoryMap.set(String(row.id), row.name || String(row.id));

          const userMap = new Map<string, { username?: string; email?: string }>();
          for (const row of usersRes.data || []) {
            userMap.set(String(row.id), { 
              username: row.username || undefined, 
              email: row.email || undefined 
            });
          }

          rows = (plainQuery.data || []).map((row: any) => ({
            ...row,
            platforms: { name: platformMap.get(String(row.platform_id)) || String(row.platform_id || "AI") },
            categories: { name: categoryMap.get(String(row.category_id)) || String(row.category_id || "Prompt") },
            subcategories: row.subcategory_id
              ? { name: subcategoryMap.get(String(row.subcategory_id)) || String(row.subcategory_id) }
              : null,
            users: userMap.get(String(row.creator_id)) || null,
          }));
        } else {
          rows = joinedQuery.data || [];
        }

        if (!rows || rows.length === 0) {
          setDataset(EMPTY_DATASET);
          return;
        }

        const mappedPrompts: (PromptRecord & { creator_id?: string })[] = rows.map((row: any) => {
          const userData = row.users || {};
          const sellerName = userData.username || userData.display_name || "Creator";

          return {
            id: String(row.id),
            title: row.title || "Untitled Prompt",
            short_description: row.description || "Prompt system that ships outcomes.",
            images: row.cover_image_url ? [row.cover_image_url] : [],
            rating: Number(row.average_rating || 4.8),
            sales: Number(row.purchases_count || 0),
            tags: [],
            seller: sellerName,
            creator_id: row.creator_id || null,
            price: Number(row.price || 0),
            platform: row.platforms?.name || String(row.platform_id || "AI"),
            category: row.categories?.name || String(row.category_id || "Prompt"),
            subcategory: row.subcategories?.name || (row.subcategory_id ? String(row.subcategory_id) : undefined),
            output_type: undefined,
            difficulty: undefined,
            prompt_text: undefined,
            createdAt: row.created_at,
          };
        });

        // Improved Top Creators calculation (Group by creator_id)
        const sellerStats = new Map<string, { prompts: number; sales: number; name: string }>();
        for (const prompt of mappedPrompts) {
          const cid = prompt.creator_id || "anonymous";
          const current = sellerStats.get(cid) || { prompts: 0, sales: 0, name: prompt.seller };
          current.prompts += 1;
          current.sales += Number(prompt.sales || 0);
          
          // If we had a generic name but now found a specific one, update it
          if (current.name === "Creator" && prompt.seller !== "Creator") {
            current.name = prompt.seller;
          }
          
          sellerStats.set(cid, current);
        }

        const topCreators = Array.from(sellerStats.entries())
          .filter(([cid]) => cid !== "anonymous") // Only show real identified creators
          .map(([cid, stats]) => ({
            name: stats.name,
            prompts: stats.prompts,
            sales: stats.sales,
            score: stats.sales * 10 + stats.prompts * 100,
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 6);

        const trendingTags = Array.from(new Set(
          mappedPrompts
            .flatMap((prompt) => [prompt.category, prompt.subcategory, prompt.platform].filter(Boolean) as string[])
            .map((value) => value.trim())
            .filter(Boolean)
        )).slice(0, 12);

        setDataset({
          topCreators,
          trendingTags: ["All", ...trendingTags],
          prompts: mappedPrompts,
        });

        // Also fetch user's wishlist IDs
        const wishIds = await getWishlistedIds();
        if (wishIds) {
          setWishlistedIds(new Set(wishIds));
        }
      } catch {
        setDataset(EMPTY_DATASET);
      }
    };

    loadPrompts();
  }, []);

  const prompts = useMemo(() => dataset.prompts || [], [dataset]);

  const promptTexts = useMemo(() => {
    const map = new Map<string, string>();
    for (const prompt of prompts) {
      map.set(prompt.id, getPromptText(prompt));
    }
    return map;
  }, [prompts]);

  const trendTags = useMemo(() => {
    const tags = dataset.trendingTags || [];
    return tags.length > 0 ? tags : ["All"];
  }, [dataset]);

  const dynamicSections = useMemo(() => {
    const uniquePlatforms = Array.from(new Set(prompts.map((prompt) => prompt.platform).filter(Boolean) as string[]));
    const uniqueCategories = Array.from(new Set(prompts.map((prompt) => prompt.category).filter(Boolean) as string[]));
    const uniqueOutputTypes = Array.from(new Set(prompts.map((prompt) => prompt.output_type).filter(Boolean) as string[]));

    return [
      {
        ...PLATFORM_SECTION,
        options: uniquePlatforms.length > 0 ? uniquePlatforms : PLATFORM_SECTION.options,
      },
      {
        ...CATEGORY_SECTION,
        options: uniqueCategories.length > 0 ? uniqueCategories : CATEGORY_SECTION.options,
      },
      {
        ...OUTPUT_FORMAT_SECTION,
        options: uniqueOutputTypes.length > 0 ? uniqueOutputTypes : OUTPUT_FORMAT_SECTION.options,
      },
      TARGET_AUDIENCE_SECTION,
    ];
  }, [prompts]);

  const categorySubcategoryMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const prompt of prompts) {
      const category = (prompt.category || "").trim();
      const subcategory = (prompt.subcategory || "").trim();
      if (!category || !subcategory) continue;
      if (!map[category]) map[category] = [];
      if (!map[category].includes(subcategory)) {
        map[category].push(subcategory);
      }
    }
    Object.keys(map).forEach((category) => {
      map[category] = map[category].sort((a, b) => a.localeCompare(b));
    });
    return map;
  }, [prompts]);

  const optionCounts = useMemo(() => {
    const sections = dynamicSections;

    const counts: Record<string, number> = {};

    for (const section of sections) {
      for (const option of section.options) {
        const count = prompts.filter((prompt) => {
          const promptText = promptTexts.get(prompt.id) || getPromptText(prompt);
          return matchesOption(section.id, option, prompt, promptText);
        }).length;
        counts[`${section.id}:${option}`] = count;
      }
    }

    const selectedCategories = selectedFilters.category || [];
    const subcategoryOptions = selectedCategories.flatMap((category) => categorySubcategoryMap[category] || []);
    for (const subcategory of subcategoryOptions) {
      const subcategoryValue = normalize(subcategory);
      const count = prompts.filter((prompt) => normalize(prompt.subcategory || "") === subcategoryValue).length;
      counts[`subcategory:${subcategory}`] = count;
    }

    return counts;
  }, [prompts, promptTexts, dynamicSections, selectedFilters.category, categorySubcategoryMap]);

  const filteredPrompts = useMemo(() => {
    return prompts
      .filter((prompt) => {
        const text = promptTexts.get(prompt.id) || getPromptText(prompt);

        if (q && !text.includes(normalize(q))) return false;
        if (cardSearch && !text.includes(normalize(cardSearch))) return false;
        if ((prompt.price || 0) < priceRange[0] || (prompt.price || 0) > priceRange[1]) return false;
        if (minRating !== null && (prompt.rating || 0) < minRating) return false;

        if (complexity !== "All") {
          const difficulty = normalize(prompt.difficulty || "");
          const target = complexity === "Mid" ? "mid" : normalize(complexity);
          if (!difficulty.includes(target)) return false;
        }

        for (const sectionId of ["platform", "category", "targetAudience", "outputFormat", "subcategory"]) {
          const options = selectedFilters[sectionId] || [];
          if (options.length === 0) continue;
          const sectionMatch = options.some((option) => matchesOption(sectionId, option, prompt, text));
          if (!sectionMatch) return false;
        }

        if (activeTrend !== "All") {
          const trendValue = normalize(activeTrend);
          const tagMatch = (prompt.tags || []).some((tag) => normalize(tag) === trendValue);
          if (!tagMatch && !text.includes(trendValue)) return false;
        }

        if (activeTab !== "All prompts") {
          const tabWord = normalize(activeTab.replace(/^for /i, ""));
          const singular = tabWord.endsWith("s") ? tabWord.slice(0, -1) : tabWord;
          if (!text.includes(tabWord) && !text.includes(singular)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "Newest") {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === "Price: Low to High") {
          return (a.price || 0) - (b.price || 0);
        }
        if (sortBy === "Price: High to Low") {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortBy === "Most Purchased") {
          return (b.sales || 0) - (a.sales || 0);
        }
        return (b.sales || 0) - (a.sales || 0);
      });
  }, [
    prompts,
    promptTexts,
    q,
    priceRange,
    minRating,
    complexity,
    selectedFilters,
    activeTrend,
    activeTab,
    sortBy,
    cardSearch,
  ]);

  const topCreators = useMemo(() => dataset.topCreators || [], [dataset]);

  const trendingPrompts = useMemo(
    () => [...filteredPrompts].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 6),
    [filteredPrompts]
  );

  const newArrivals = useMemo(
    () => [...filteredPrompts].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 7),
    [filteredPrompts]
  );

  const visiblePrompts = filteredPrompts.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredPrompts.length;

  const handleTabChange = (tab: (typeof AUDIENCE_TABS)[number]) => {
    setActiveTab(tab);
    setVisibleCount(16);
  };

  const handleTrendChange = (trend: string) => {
    setActiveTrend(trend);
    setVisibleCount(16);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setVisibleCount(16);
  };

  const toggleFilterOption = (sectionId: string, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[sectionId] || [];
      const next = current.includes(option) ? current.filter((item) => item !== option) : [...current, option];
      let nextSubcategories = prev.subcategory || [];

      if (sectionId === "category") {
        const activeCategories = next;
        const allowed = new Set(activeCategories.flatMap((category) => categorySubcategoryMap[category] || []));
        nextSubcategories = nextSubcategories.filter((subcategory) => allowed.has(subcategory));
      }

      return {
        ...prev,
        [sectionId]: next,
        subcategory: nextSubcategories,
      };
    });
    setVisibleCount(16);
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const clearAll = () => {
    setSelectedFilters({});
    setPriceRange([0, 500]);
    setMinRating(null);
    setComplexity("All");
    setActiveTrend("All");
    setActiveTab("All prompts");
    setVisibleCount(16);
  };

  const sectionGridClass =
    layoutMode === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
      : "flex flex-col divide-y divide-border/45";

  return (
    <div className="min-h-screen bg-background text-foreground px-3 sm:px-4 lg:px-6 py-5">
      <div className="h-10" />

      <div className="fixed top-16 left-0 right-0 z-110 h-10 border-y border-border/40 bg-background/95 backdrop-blur-sm px-3 sm:px-4 lg:px-6 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Tutorials</span>
        <span>Explore here</span>
      </div>

      <div className="max-w-470 mx-auto grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4 lg:gap-6">
        <div className="hidden lg:block" />

        <section className="space-y-4 min-w-0">
          <div className="pt-1 lg:pt-2 pb-0.5">
            <div className="inline-flex flex-col items-start gap-2">
              <ExploreAppleMark />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-none font-black tracking-tight text-foreground">
                Explore Prompt
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">Prompt systems that ship outcomes, not guesses.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card/40 p-3 lg:p-3.5">
            <div className="flex flex-col gap-2.5">
              {/* <div className="flex items-center justify-end gap-4">
                
              </div> */}

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {AUDIENCE_TABS.map((tab) => {
                  const count = tab === "All prompts"
                    ? prompts.length
                    : filteredPrompts.filter((prompt) =>
                        getPromptText(prompt).includes(normalize(tab.replace(/^for /i, "")))
                      ).length;

                  return (
                    <button
                      type="button"
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-black transition-colors",
                        activeTab === tab
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background/70 text-muted-foreground border-border/60 hover:text-foreground"
                      )}
                    >
                      {tab} <span className="text-xs opacity-70">{count.toLocaleString()}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] text-primary shrink-0">
                  <Flame className="w-3.5 h-3.5" /> Trending
                </span>
                {trendTags.map((trend) => (
                  <button
                    type="button"
                    key={trend}
                    onClick={() => handleTrendChange(trend)}
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                      activeTrend === trend
                        ? "bg-primary/10 text-primary border-primary/40"
                        : "bg-background/70 text-muted-foreground border-border/60 hover:text-foreground"
                    )}
                  >
                    {trend}
                  </button>
                ))}
              </div>

            </div>
          </div>

          <TopCreatorsRow creators={topCreators} />

          <div className="p-0.5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex items-center gap-2 w-full lg:max-w-xl">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden rounded-xl border-border/60 shrink-0"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </Button>

                <div className="relative w-full rounded-xl bg-linear-to-r from-violet-500/45 via-purple-500/35 to-indigo-500/45 p-[1.5px] shadow-[0_0_0_1px_rgba(124,58,237,0.16)]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={cardSearch}
                    onChange={(e) => {
                      setCardSearch(e.target.value);
                      setVisibleCount(16);
                    }}
                    placeholder="Search Prompts"
                    className="h-10 w-full rounded-[11px] border-0 bg-background/95 pl-10 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/35"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground font-semibold whitespace-nowrap">
                  Showing <span className="text-foreground font-black">{Math.min(filteredPrompts.length, visibleCount)}</span> of {filteredPrompts.length.toLocaleString()}
                </p>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground font-medium whitespace-nowrap">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="h-10 min-w-34 rounded-xl border border-border/60 bg-background px-3 text-sm font-semibold outline-none focus:border-primary/50"
                  >
                    <option value="Trending">Trending</option>
                    <option value="Most Purchased">Most Purchased</option>
                    <option value="Newest">Newest</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                  </select>

                  <div className="rounded-xl border border-border/60 bg-background p-1 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setLayoutMode("grid")}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        layoutMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutMode("list")}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        layoutMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        <ExploreFilterSidebar
          selectedFilters={selectedFilters}
          openSections={openSections}
          toggleSection={toggleSection}
          toggleFilterOption={toggleFilterOption}
          optionCounts={optionCounts}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minRating={minRating}
          setMinRating={setMinRating}
          complexity={complexity}
          setComplexity={setComplexity}
          clearAll={clearAll}
          mobileOpen={mobileFiltersOpen}
          setMobileOpen={setMobileFiltersOpen}
          dynamicSections={dynamicSections}
          categorySubcategoryMap={categorySubcategoryMap}
        />

        <section className="space-y-7 min-w-0">

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-foreground/80">Trending This Week</h3>
              <Badge variant="outline" className="rounded-full">{trendingPrompts.length} prompts</Badge>
            </div>
            {layoutMode === "list" ? (
              <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_180px_160px] gap-6 pb-2 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                <span>Description</span>
                <span>Category</span>
                <span>Product</span>
              </div>
            ) : null}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`trending-${layoutMode}`}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className={cn(sectionGridClass, layoutMode === "list" && "border-y border-border/45")}
              >
                {trendingPrompts.map((prompt) => (
                  <ExplorePromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    description={prompt.short_description || prompt.full_description || prompt.title}
                    image={prompt.images?.[0] || ""}
                    rating={prompt.rating || 4.8}
                    usageCount={prompt.sales || 0}
                    tags={prompt.tags || [prompt.category || "Prompt"]}
                    creator={prompt.seller || "Unknown creator"}
                    price={prompt.price || 0}
                    category={prompt.category || "Prompt"}
                    platform={prompt.platform || "AI"}
                    mode={layoutMode}
                    initialWishlisted={wishlistedIds.has(prompt.id)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-foreground/80">New Arrivals</h3>
              <Badge variant="outline" className="rounded-full">{newArrivals.length} this week</Badge>
            </div>
            {layoutMode === "list" ? (
              <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_180px_160px] gap-6 pb-2 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                <span>Description</span>
                <span>Category</span>
                <span>Product</span>
              </div>
            ) : null}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`new-${layoutMode}`}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className={cn(sectionGridClass, layoutMode === "list" && "border-y border-border/45")}
              >
                {newArrivals.map((prompt) => (
                  <ExplorePromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    description={prompt.short_description || prompt.full_description || prompt.title}
                    image={prompt.images?.[0] || ""}
                    rating={prompt.rating || 4.8}
                    usageCount={prompt.sales || 0}
                    tags={prompt.tags || [prompt.category || "Prompt"]}
                    creator={prompt.seller || "Unknown creator"}
                    price={prompt.price || 0}
                    category={prompt.category || "Prompt"}
                    platform={prompt.platform || "AI"}
                    mode={layoutMode}
                    initialWishlisted={wishlistedIds.has(prompt.id)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-foreground/80">All Prompts</h3>
              <Badge variant="outline" className="rounded-full">{filteredPrompts.length} results</Badge>
            </div>

            {visiblePrompts.length === 0 ? (
              <div className="rounded-3xl border border-border/60 bg-card/70 p-10 text-center">
                <p className="text-xl font-black text-foreground">No prompts match these filters</p>
                <p className="text-sm text-muted-foreground mt-2">Try broadening price, rating, or category selections.</p>
                <Button onClick={clearAll} className="mt-4">Reset Filters</Button>
              </div>
            ) : (
              <>
                {layoutMode === "list" ? (
                  <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_180px_160px] gap-6 pb-2 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                    <span>Description</span>
                    <span>Category</span>
                    <span>Product</span>
                  </div>
                ) : null}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`all-${layoutMode}`}
                    initial={{ opacity: 0, y: 18, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.99 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className={cn(sectionGridClass, layoutMode === "list" && "border-y border-border/45")}
                  >
                    {visiblePrompts.map((prompt) => (
                      <ExplorePromptCard
                        key={prompt.id}
                        id={prompt.id}
                        title={prompt.title}
                        description={prompt.short_description || prompt.full_description || prompt.title}
                        image={prompt.images?.[0] || ""}
                        rating={prompt.rating || 4.8}
                        usageCount={prompt.sales || 0}
                        tags={prompt.tags || [prompt.category || "Prompt"]}
                        creator={prompt.seller || "Unknown creator"}
                        price={prompt.price || 0}
                        category={prompt.category || "Prompt"}
                        platform={prompt.platform || "AI"}
                        mode={layoutMode}
                        initialWishlisted={wishlistedIds.has(prompt.id)}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </section>

          {canLoadMore ? (
            <div className="flex justify-center pt-2 pb-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVisibleCount((current) => current + 24)}
                className="h-12 min-w-60 rounded-full border-border/60 bg-card/70 font-black"
              >
                Load 24 more prompts
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
