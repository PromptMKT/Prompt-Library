"use client";

import { MessageSquare, Star } from "lucide-react";
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

    // Top selling prompts sorted by sales
    const topPrompts = [...prompts]
        .sort((a, b) => (b.sales || 0) - (a.sales || 0))
        .slice(0, 4);

    return (
        <div className="hidden xl:block w-full max-w-[360px]">
            <div className="sticky top-[100px] flex flex-col gap-4">

                {/* 1. Message Creator Card */}
                <div className="bg-secondary/30 border border-primary/20 rounded-2xl overflow-hidden">
                    <div className="p-4 bg-primary/5 border-b border-primary/15">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt={user.name} />
                                ) : (
                                    getInitials(user.name)
                                )}
                            </div>
                            <div>
                                <div className="text-[13px] font-bold text-foreground">{user.name}</div>
                                <div className="text-[10px] text-[#22d3ee] flex items-center gap-1.5 mt-0.5">
                                    <span className="w-[5px] h-[5px] rounded-full bg-[#22d3ee] shadow-[0_0_6px_#22d3ee] animate-pulse" />
                                    Active recently
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#e8a838] bg-[rgba(232,168,56,0.12)] py-1.5 px-3 rounded-full border border-[rgba(232,168,56,0.28)] inline-block">
                            ⚡ Replies within 4h · 98% rate
                        </span>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="text-[11px] text-muted-foreground leading-relaxed">
                            Ask before you buy — e.g. "Does this work with Next.js?"
                        </div>
                        <textarea
                            className="w-full bg-background border border-border/40 rounded-xl p-3 text-sm focus:border-primary outline-none resize-none h-[68px]"
                            placeholder="Type your question..."
                        />
                        <button
                            className="w-full py-2.5 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] text-white text-[12px] font-bold shadow-[0_2px_10px_rgba(124,58,237,0.3)] hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            onClick={() => toast.success("Message sent!")}
                        >
                            <MessageSquare className="w-4 h-4" /> Send message
                        </button>
                        <div className="text-[10px] text-center text-muted-foreground/60 font-semibold">
                            Private · Free to ask · No spam
                        </div>
                    </div>
                </div>

                {/* 2. Creator Credibility */}
                <div className="bg-background border border-border/40 rounded-2xl p-5">
                    <h3 className="text-[10px] font-bold tracking-[0.8px] uppercase text-muted-foreground mb-4">Creator Credibility</h3>
                    <div className="space-y-0">
                        {[
                            { label: "Total sales", value: totalSales.toLocaleString(), color: "text-[#A78BFA]" },
                            { label: "Avg rating", value: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : "—", color: "text-[#e8a838]" },
                            { label: "Verified reviews", value: reviewsCount.toLocaleString() },
                            { label: "Response rate", value: "98%", color: "text-[#22d3ee]" },
                            { label: "Avg response time", value: "< 4 hours", color: "text-[#22d3ee]" },
                            { label: "Member since", value: user.memberSince || "—" },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between py-[7px] border-b border-border/30 last:border-b-0">
                                <span className="text-[12px] text-muted-foreground">{row.label}</span>
                                <span className={cn("text-[12px] font-bold font-mono", row.color || "text-foreground")}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Top Selling Prompts */}
                {topPrompts.length > 0 && (
                    <div className="bg-background border border-border/40 rounded-2xl p-5">
                        <h3 className="text-[10px] font-bold tracking-[0.8px] uppercase text-muted-foreground mb-4">Top Selling Prompts</h3>
                        <div className="space-y-2">
                            {topPrompts.map((p, i) => (
                                <div
                                    key={p.id}
                                    className="flex items-center gap-2 p-[9px_10px] rounded-[10px] border border-border/30 bg-secondary/20 cursor-pointer transition-all hover:border-primary/20 hover:bg-secondary/40 hover:translate-x-[2px]"
                                >
                                    <span className={cn("font-mono text-[10px] font-semibold w-[14px] text-center flex-shrink-0", i < 2 ? "text-[#e8a838]" : "text-muted-foreground/50")}>
                                        #{i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[11px] font-semibold text-foreground truncate">{p.title}</div>
                                        <div className="text-[9px] text-muted-foreground font-mono mt-0.5">
                                            {(p.sales || 0).toLocaleString()} sales · ★ {(p.rating || 0).toFixed(1)}
                                        </div>
                                    </div>
                                    <span className="font-mono text-[11px] font-semibold text-[#e8a838] flex-shrink-0">
                                        ₹{p.price}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Platforms Covered */}
                {platformBreakdown.length > 0 && (
                    <div className="bg-background border border-border/40 rounded-2xl p-5">
                        <h3 className="text-[10px] font-bold tracking-[0.8px] uppercase text-muted-foreground mb-4">Platforms Covered</h3>
                        <div className="space-y-0">
                            {platformBreakdown.map((plat) => (
                                <div key={plat.name} className="flex items-center gap-[9px] py-[7px] border-b border-border/30 last:border-b-0">
                                    <div className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: PLAT_COLORS[plat.name] || "#8B5CF6" }} />
                                    <span className="text-[12px] text-foreground flex-1">{plat.name}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">{plat.count} prompts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Share Profile */}
                <div className="flex items-center gap-2 p-3 bg-secondary/20 border border-border/30 rounded-xl">
                    <span className="text-[11px] text-muted-foreground flex-1">Share this profile</span>
                    <button
                        className="text-[10px] font-semibold py-1 px-3 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied!");
                        }}
                    >
                        Copy link
                    </button>
                </div>
            </div>
        </div>
    );
}
