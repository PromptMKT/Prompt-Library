export type FilterSection = {
  id: string;
  title: string;
  options: string[];
};

export const AUDIENCE_TABS = [
  "All prompts",
  "For Designers",
  "For Developers",
  "For Marketers",
  "For Founders",
] as const;

export const PLATFORM_FILTER_SECTIONS: FilterSection[] = [
  {
    id: "platform",
    title: "Platform",
    options: ["ChatGPT", "Claude", "Gemini", "Midjourney", "FLUX", "Runway", "Cursor"],
  },
  {
    id: "textMultimodal",
    title: "Text & Multimodal",
    options: ["ChatGPT", "Claude", "Gemini", "Grok", "Meta / Llama", "DeepSeek", "Perplexity", "Mistral"],
  },
  {
    id: "imageGeneration",
    title: "Image Generation",
    options: ["Midjourney", "FLUX", "Stable Diffusion", "DALL-E", "Adobe Firefly", "Ideogram", "Recraft"],
  },
  {
    id: "videoGeneration",
    title: "Video Generation",
    options: ["Runway", "Sora", "Kling", "Veo"],
  },
  {
    id: "audioVoice",
    title: "Audio & Voice",
    options: ["ElevenLabs", "Suno", "Udio"],
  },
  {
    id: "codingAgentic",
    title: "Coding & Agentic",
    options: ["Cursor", "GitHub Copilot"],
  },
];

export const PLATFORM_SECTION: FilterSection = {
  id: "platform",
  title: "Platform",
  options: Array.from(new Set(PLATFORM_FILTER_SECTIONS.flatMap((section) => section.options))).slice(0, 12),
};

export const CATEGORY_SECTION: FilterSection = {
  id: "category",
  title: "Category",
  options: [
    "Text generation",
    "Image & visual",
    "Code & technical",
    "Data & analysis",
    "Audio & voice",
    "Video generation",
    "Agentic & workflow",
    "Role & persona simulation",
    "Strategy & planning",
    "Learning & education",
  ],
};

export const TARGET_AUDIENCE_SECTION: FilterSection = {
  id: "targetAudience",
  title: "Target Audience",
  options: ["Designers", "Developers", "Marketers", "Founders", "Writers", "Students", "Creators", "Analysts", "Sales"],
};

export const OUTPUT_FORMAT_SECTION: FilterSection = {
  id: "outputFormat",
  title: "Output Format",
  options: [
    "Long-form text",
    "Short copy",
    "Structured data",
    "Code",
    "Image / visual",
    "Audio / music",
    "Video",
    "Conversational",
    "Tool call / function",
    "Multiple outputs",
  ],
};

export const COMPLEXITY_OPTIONS = ["All", "Beginner", "Mid", "Advanced"] as const;

export const MIN_RATING_OPTIONS = [
  { label: "Any", value: null as number | null },
  { label: "4+ stars", value: 4 },
  { label: "4.5+ stars", value: 4.5 },
  { label: "4.8+ stars", value: 4.8 },
];

export const TRENDING_FALLBACK_TAGS = [
  "All",
  "Cold Email",
  "Midjourney v7",
  "React / Next.js",
  "Twitter Threads",
  "AI Agents",
  "SEO Copy",
  "FLUX Images",
  "Pitch",
];
