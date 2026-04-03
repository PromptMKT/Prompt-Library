"use client";

import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VisitorSidebarProps {
    user: any;
    prompts: any[];
    totalSales?: number;
    avgRating?: number;
    reviewsCount?: number;
    platformBreakdown?: { name: string; count: number }[];
}

const PLAT_COLORS: Record<string, string> = {
    Claude: "#8B5CF6",
    ChatGPT: "#10a37f",
    "GPT-4": "#10a37f",
    Cursor: "#38bdf8",
    Copilot: "#38bdf8",
    Gemini: "#4285f4",
    Midjourney: "#fb923c",
    FLUX: "#8B5CF6",
};

export function VisitorSidebarContent({
    user,
    prompts,
    totalSales = 0,
    avgRating = 0,
    reviewsCount = 0,
    platformBreakdown = [],
}: VisitorSidebarProps) {
    const getInitials = (name: string) => {
        if (!name) return "U";
        const parts = name.split(" ");
        return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
    };

    const topPrompts = [...prompts]
        .sort((a, b) => (b.sales || 0) - (a.sales || 0))
        .slice(0, 4);

    const displayName = user.displayName || user.name;

    return (
        <div className="hidden xl:block w-full max-w-[340px]">
            <div className="sticky top-[100px] flex flex-col gap-4">

                {/* 1. Message Creator */}
                <div className="bg-secondary/20 border border-border/50 rounded-2xl overflow-hidden">
                    <div className="p-4 bg-primary/5 border-b border-border/30">
                        <div className="flex items-center gap-3 mb-2.5">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt={displayName} />
                                ) : getInitials(displayName)}
                            </div>
                            <div>
                                <div className="text-[12px] font-bold text-foreground">{displayName}</div>
                                <div className="text-[10px] text-[#22d3ee] flex items-center gap-1">
                                    <span className="w-[5px] h-[5px] rounded-full bg-[#22d3ee] shadow-[0_0_4px_#22d3ee] animate-pulse" />
                                    Active recently
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 space-y-2.5">
                        <div className="text-[11px] text-muted-foreground leading-relaxed">
                            Ask before you buy — e.g. "Does this work with Next.js?"
                        </div>
                        <textarea
                            className="w-full bg-background border border-border/40 rounded-xl p-2.5 text-sm focus:border-primary outline-none resize-none h-[60px]"
                            placeholder="Type your question..."
                        />
                        <button
                            className="w-full py-2 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] text-white text-[11px] font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                            onClick={() => toast.success("Message sent!")}
                        >
                            <MessageSquare className="w-3.5 h-3.5" /> Send message
                        </button>
                        <div className="text-[9px] text-center text-muted-foreground/50 font-semibold uppercase tracking-wider">
                            Private · Free to ask · No spam
                        </div>
                    </div>
                </div>

                {/* 2. Creator Credibility */}
                <div className="bg-background border border-border/50 rounded-xl p-4">
                    <h3 className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-3 pb-2 border-b border-border/30">Creator Credibility</h3>
                    <div className="space-y-0">
                        {[
                            { label: "Total sales", value: totalSales.toLocaleString(), color: "text-[#A78BFA]" },
                            { label: "Avg rating", value: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : "N/A", color: avgRating > 0 ? "text-[#e8a838]" : "text-muted-foreground" },
                            { label: "Verified reviews", value: String(reviewsCount) },
                            { label: "Member since", value: user.memberSince || "—" },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-border/20 last:border-b-0">
                                <span className="text-[11px] text-muted-foreground">{row.label}</span>
                                <span className={cn("text-[11px] font-bold font-mono", row.color || "text-foreground")}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Top Selling Prompts */}
                {topPrompts.length > 0 && (
                    <div className="bg-background border border-border/50 rounded-xl p-4">
                        <h3 className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-3 pb-2 border-b border-border/30">Top Selling Prompts</h3>
                        <div className="space-y-1.5">
                            {topPrompts.map((p, i) => (
                                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20 border border-border/20 cursor-pointer hover:border-primary/20 hover:bg-secondary/40 transition-all">
                                    <span className={cn("font-mono text-[10px] font-semibold w-4 text-center flex-shrink-0", i < 2 ? "text-[#e8a838]" : "text-muted-foreground/50")}>
                                        #{i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[11px] font-semibold text-foreground truncate">{p.title}</div>
                                        <div className="text-[9px] text-muted-foreground font-mono">{(p.sales || 0).toLocaleString()} sales</div>
                                    </div>
                                    <span className="font-mono text-[10px] font-bold text-[#e8a838] flex-shrink-0">₹{p.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Platforms */}
                {platformBreakdown.length > 0 && (
                    <div className="bg-background border border-border/50 rounded-xl p-4">
                        <h3 className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-3 pb-2 border-b border-border/30">Platforms Covered</h3>
                        {platformBreakdown.map((plat) => (
                            <div key={plat.name} className="flex items-center gap-2 py-1.5 border-b border-border/15 last:border-b-0">
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: PLAT_COLORS[plat.name] || "#8B5CF6" }} />
                                <span className="text-[11px] text-foreground flex-1">{plat.name}</span>
                                <span className="text-[10px] text-muted-foreground font-mono">{plat.count}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* 5. Share */}
                <div className="flex items-center gap-2 p-3 bg-secondary/15 border border-border/30 rounded-lg">
                    <span className="text-[10px] text-muted-foreground flex-1">Share this profile</span>
                    <button
                        className="text-[10px] font-semibold py-1 px-3 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all"
                        onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                    >
                        Copy link
                    </button>
                </div>
            </div>
        </div>
    );
}
