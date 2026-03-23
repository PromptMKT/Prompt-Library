"use client";

import { useMemo, useState, Suspense, useEffect } from "react";
import { Flame, Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  PLATFORM_FILTER_SECTIONS,
  TARGET_AUDIENCE_SECTION,
} from "./components/filter-config";
import exploreData from "./data/explore-data.json";

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
  website: { name: string; idea: string; tagline: string };
  topCreators: { name: string; prompts: number; sales: number; score: number }[];
  trendingTags: string[];
  prompts: PromptRecord[];
};

type FilterSelections = Record<string, string[]>;
type OpenSections = Record<string, boolean>;

const FALLBACK_DATA = exploreData as ExploreDataset;

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
  "Role & persona": ["persona", "customer", "support", "founder", "marketer", "designer", "developer"],
};

const OUTPUT_KEYWORDS: Record<string, string[]> = {
  "Long-form text": ["long", "article", "guide", "essay", "document"],
  "Short copy": ["short", "tweet", "headline", "hook", "copy"],
  "Structured data (JSON/YAML)": ["json", "yaml", "schema", "structured"],
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
    return words.some((word) => promptText.includes(word));
  }

  return promptText.includes(value);
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [dataset, setDataset] = useState<ExploreDataset>(FALLBACK_DATA);

  const [sidebarSearch, setSidebarSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<FilterSelections>({});
  const [openSections, setOpenSections] = useState<OpenSections>({
    platform: true,
    textMultimodal: true,
    imageGeneration: false,
    videoGeneration: false,
    audioVoice: false,
    codingAgentic: false,
    category: true,
    targetAudience: false,
    outputFormat: false,
    priceRange: true,
    minRating: true,
    complexity: true,
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([10, 500]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [complexity, setComplexity] = useState("All");
  const [activeTab, setActiveTab] = useState<(typeof AUDIENCE_TABS)[number]>("All prompts");
  const [activeTrend, setActiveTrend] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");
  const [layoutMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(16);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const { data } = await supabase
          .from("prompts")
          .select(
            "id, title, short_description, tagline, images, screenshots, cover_image, rating, sales, tags, seller, price, platform, category, prompt_text, output_type, complexity, created_at"
          )
          .order("created_at", { ascending: false })
          .limit(400);

        if (!data || data.length === 0) return;

        const mappedPrompts: PromptRecord[] = data.map((row: any) => ({
          id: String(row.id),
          title: row.title || "Untitled Prompt",
          short_description: row.short_description || row.tagline || "",
          images: row.images?.length ? row.images : row.screenshots?.length ? row.screenshots : row.cover_image ? [row.cover_image] : [],
          rating: Number(row.rating || 4.8),
          sales: Number(row.sales || 0),
          tags: Array.isArray(row.tags) ? row.tags : [],
          seller: row.seller || "Creator",
          price: Number(row.price || 0),
          platform: row.platform || "AI",
          category: row.category || "Prompt",
          prompt_text: row.prompt_text,
          output_type: row.output_type,
          difficulty: row.complexity || "Mid",
          createdAt: row.created_at,
        }));

        const sellerStats = new Map<string, { prompts: number; sales: number }>();
        for (const prompt of mappedPrompts) {
          const sellerName = prompt.seller || "Creator";
          const current = sellerStats.get(sellerName) || { prompts: 0, sales: 0 };
          current.prompts += 1;
          current.sales += Number(prompt.sales || 0);
          sellerStats.set(sellerName, current);
        }

        const topCreators = Array.from(sellerStats.entries())
          .map(([name, stats]) => ({
            name,
            prompts: stats.prompts,
            sales: stats.sales,
            score: stats.sales * 10 + stats.prompts * 100,
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 6);

        const trendingTags = Array.from(
          new Set(mappedPrompts.flatMap((prompt) => prompt.tags || []))
        ).slice(0, 12);

        setDataset({
          website: {
            name: "PromptVault",
            idea: "Prompt marketplace",
            tagline: "Explore community prompts and open full detail pages instantly.",
          },
          topCreators: topCreators.length > 0 ? topCreators : FALLBACK_DATA.topCreators,
          trendingTags: ["All", ...(trendingTags.length > 0 ? trendingTags : FALLBACK_DATA.trendingTags)],
          prompts: mappedPrompts,
        });
      } catch {
        // Keep fallback explore dataset when database query is unavailable.
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

  const optionCounts = useMemo(() => {
    const sections = [
      ...PLATFORM_FILTER_SECTIONS,
      CATEGORY_SECTION,
      TARGET_AUDIENCE_SECTION,
      OUTPUT_FORMAT_SECTION,
    ];

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

    return counts;
  }, [prompts, promptTexts]);

  const filteredPrompts = useMemo(() => {
    const selectedPlatformOptions = [
      ...(selectedFilters.platform || []),
      ...(selectedFilters.textMultimodal || []),
      ...(selectedFilters.imageGeneration || []),
      ...(selectedFilters.videoGeneration || []),
      ...(selectedFilters.audioVoice || []),
      ...(selectedFilters.codingAgentic || []),
    ];

    return prompts
      .filter((prompt) => {
        const text = promptTexts.get(prompt.id) || getPromptText(prompt);

        if (q && !text.includes(normalize(q))) return false;
        if ((prompt.price || 0) < priceRange[0] || (prompt.price || 0) > priceRange[1]) return false;
        if (minRating !== null && (prompt.rating || 0) < minRating) return false;

        if (complexity !== "All") {
          const difficulty = normalize(prompt.difficulty || "");
          const target = complexity === "Mid" ? "mid" : normalize(complexity);
          if (!difficulty.includes(target)) return false;
        }

        if (selectedPlatformOptions.length > 0) {
          const matchesPlatform = selectedPlatformOptions.some((option) =>
            matchesOption("platform", option, prompt, text)
          );
          if (!matchesPlatform) return false;
        }

        for (const sectionId of ["category", "targetAudience", "outputFormat"]) {
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
      return {
        ...prev,
        [sectionId]: next,
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
    setSidebarSearch("");
    setPriceRange([10, 500]);
    setMinRating(null);
    setComplexity("All");
    setActiveTrend("All");
    setActiveTab("All prompts");
    setVisibleCount(16);
  };

  const sectionGridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center";

  return (
    <div className="relative px-3 sm:px-4 lg:px-6 py-5">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-10 w-80 h-80 rounded-full bg-violet/10 blur-3xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4 lg:gap-6 max-w-470 mx-auto">
        <ExploreFilterSidebar
          sidebarSearch={sidebarSearch}
          onSidebarSearchChange={setSidebarSearch}
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
        />

        <section className="space-y-7 min-w-0">
          <div className="rounded-3xl border border-border/50 bg-card/70 p-4 lg:p-5 backdrop-blur-md shadow-[0_20px_40px_rgba(13,15,40,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground max-w-3xl">{dataset.website.tagline}</p>
                <Badge variant="outline" className="rounded-full hidden md:inline-flex">{dataset.website.name}</Badge>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
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
                        "shrink-0 rounded-full border px-4 py-2 text-sm font-black transition-colors",
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

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.14em] text-primary shrink-0">
                  <Flame className="w-3.5 h-3.5" /> Trending
                </span>
                {trendTags.map((trend) => (
                  <button
                    type="button"
                    key={trend}
                    onClick={() => handleTrendChange(trend)}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      activeTrend === trend
                        ? "bg-primary/10 text-primary border-primary/40"
                        : "bg-background/70 text-muted-foreground border-border/60 hover:text-foreground"
                    )}
                  >
                    {trend}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-muted-foreground font-semibold">
                  Showing <span className="text-foreground font-black">{Math.min(filteredPrompts.length, visibleCount)}</span> of {filteredPrompts.length.toLocaleString()} prompts
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden rounded-xl border-border/60"
                  >
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                  </Button>

                  <label className="text-sm text-muted-foreground font-medium">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="h-10 rounded-xl border border-border/60 bg-background/70 px-3 text-sm font-semibold outline-none focus:border-primary/50"
                  >
                    <option value="Trending">Trending</option>
                    <option value="Most Purchased">Most Purchased</option>
                    <option value="Newest">Newest</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                  </select>

                  {/* Layout toggle removed per request for 4-card grid */}
                </div>
              </div>
            </div>
          </div>

          <TopCreatorsRow creators={topCreators} />

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-foreground/80">Trending This Week</h3>
              <Badge variant="outline" className="rounded-full">{trendingPrompts.length} prompts</Badge>
            </div>
            <div className={sectionGridClass}>
              {trendingPrompts.map((prompt) => (
                <ExplorePromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  image={prompt.images?.[0] || ""}
                  rating={prompt.rating || 4.8}
                  usageCount={prompt.sales || 0}
                  tags={prompt.tags || [prompt.category || "Prompt"]}
                  creator={prompt.seller || "Unknown creator"}
                  price={prompt.price || 0}
                  platform={prompt.platform || "AI"}
                  mode={layoutMode}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-foreground/80">New Arrivals</h3>
              <Badge variant="outline" className="rounded-full">{newArrivals.length} this week</Badge>
            </div>
            <div className={sectionGridClass}>
              {newArrivals.map((prompt) => (
                <ExplorePromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  image={prompt.images?.[0] || ""}
                  rating={prompt.rating || 4.8}
                  usageCount={prompt.sales || 0}
                  tags={prompt.tags || [prompt.category || "Prompt"]}
                  creator={prompt.seller || "Unknown creator"}
                  price={prompt.price || 0}
                  platform={prompt.platform || "AI"}
                  mode={layoutMode}
                />
              ))}
            </div>
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
              <div className={sectionGridClass}>
                {visiblePrompts.map((prompt) => (
                  <ExplorePromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    image={prompt.images?.[0] || ""}
                    rating={prompt.rating || 4.8}
                    usageCount={prompt.sales || 0}
                    tags={prompt.tags || [prompt.category || "Prompt"]}
                    creator={prompt.seller || "Unknown creator"}
                    price={prompt.price || 0}
                    platform={prompt.platform || "AI"}
                    mode={layoutMode}
                  />
                ))}
              </div>
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
