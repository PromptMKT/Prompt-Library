"use client";

interface ProfileAboutProps {
  user: any;
  promptsCount?: number;
  totalSales?: number;
  avgRating?: number;
  reviewsCount?: number;
  platformBreakdown?: { name: string; count: number }[];
}

const PLATFORM_COLORS: Record<string, { border: string; text: string }> = {
  Claude: { border: "rgba(139,92,246,0.35)", text: "#A78BFA" },
  "ChatGPT": { border: "rgba(16,163,127,0.3)", text: "#10a37f" },
  "GPT-4": { border: "rgba(16,163,127,0.3)", text: "#10a37f" },
  "Cursor": { border: "rgba(56,189,248,0.3)", text: "#38bdf8" },
  "Copilot": { border: "rgba(56,189,248,0.3)", text: "#38bdf8" },
  Gemini: { border: "rgba(66,133,244,0.3)", text: "#4285f4" },
  Midjourney: { border: "rgba(251,146,60,0.3)", text: "#fb923c" },
  FLUX: { border: "rgba(139,92,246,0.3)", text: "#8B5CF6" },
};

export function ProfileAbout({
  user,
  promptsCount = 0,
  totalSales = 0,
  avgRating = 0,
  reviewsCount = 0,
  platformBreakdown = [],
}: ProfileAboutProps) {
  const creatorStats = [
    { label: "Member since", value: user?.memberSince || "—" },
    { label: "Response rate", value: "—", color: "text-muted-foreground" },
    { label: "Prompts published", value: promptsCount.toLocaleString() },
    { label: "Total reviews", value: reviewsCount.toLocaleString(), color: "text-[#A78BFA]" },
    { label: "Total sales", value: totalSales.toLocaleString() },
    { label: "Average rating", value: avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : "—", color: "text-[#e8a838]" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* About */}
      <div className="mb-6">
        <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-muted-foreground mb-2.5">About this creator</div>
        <div className="text-[13px] text-muted-foreground leading-[1.7]">
          {user?.bio || "This creator hasn't added a bio yet."}
        </div>
      </div>

      {/* Creator stats */}
      <div className="mb-6">
        <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-muted-foreground mb-2.5">Creator stats</div>
        <div className="grid grid-cols-2 gap-2.5">
          {creatorStats.map((stat, i) => (
            <div key={i} className="p-3 bg-secondary/30 border border-border/40 rounded-[10px]">
              <div className="text-[10px] text-muted-foreground mb-[3px]">{stat.label}</div>
              <div className={`text-[13px] font-bold font-mono ${stat.color || "text-foreground"}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interests / specialisations */}
      {user?.interests?.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-muted-foreground mb-2.5">Specialisations</div>
          <div className="flex flex-wrap gap-1.5">
            {user.interests.map((skill: string, i: number) => (
              <span key={i} className="text-[11px] py-1 px-3 rounded-[20px] bg-primary/5 border border-primary/20 text-primary/80">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI platforms covered */}
      {platformBreakdown.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-muted-foreground mb-2.5">AI platforms covered</div>
          <div className="flex flex-wrap gap-1.5">
            {platformBreakdown.map((plat) => {
              const colors = PLATFORM_COLORS[plat.name] || { border: "rgba(139,92,246,0.22)", text: "#A78BFA" };
              return (
                <span
                  key={plat.name}
                  className="text-[11px] py-1 px-3 rounded-[20px] bg-opacity-5"
                  style={{ borderWidth: 1, borderStyle: "solid", borderColor: colors.border, color: colors.text }}
                >
                  {plat.name} ({plat.count})
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}