"use client";

import { MessageSquare, Star, Clock, Heart, Flag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function VisitorSidebarContent({ user, prompts }: { user: any, prompts: any[] }) {
    const totalSales = prompts.reduce((acc, p) => acc + (p.reviewsCount || 0), 0);

    const getInitials = (name: string) => {
        if (!name) return "U";
        const parts = name.split(" ");
        return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
    };

    return (
        <div className="hidden xl:block w-full max-w-[360px]">
            <div className="sticky top-[100px] flex flex-col gap-6">

                {/* Message Creator Card */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-primary/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-background">
                            {user.avatar ? (
                                <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt={user.name} />
                            ) : getInitials(user.name)}
                        </div>
                        <div>
                            <div className="font-bold text-foreground tracking-tight">{user.name}</div>
                            <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_4px_#22d3ee]"></span>
                                Active 2h ago
                            </div>
                        </div>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 py-1.5 px-3 rounded-full inline-block mb-4 relative z-10">
                        ⚡ Replies within 4h · 98% rate
                    </div>

                    <div className="space-y-3 relative z-10">
                        <div className="text-[12px] text-muted-foreground leading-relaxed">
                            Ask before you buy — e.g. "Does this work with Next.js App Router?"
                        </div>
                        <textarea
                            className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none resize-none h-[80px] shadow-inner"
                            placeholder="Type your question..."
                        ></textarea>
                        <button
                            className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-[0_4px_14px_rgba(124,58,237,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                            onClick={() => toast.success("Message sent! Creator will reply within 4 hours.")}
                        >
                            <MessageSquare className="w-4 h-4" /> Send Message
                        </button>
                        <div className="text-[10px] text-center text-muted-foreground font-semibold uppercase tracking-widest mt-2">
                            Private · Free to ask · No spam
                        </div>
                    </div>
                </div>

                {/* Creator Credibility */}
                <div className="bg-background border border-border2 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-[0.12em] text-foreground mb-5 border-b border-border pb-3">Creator Credibility</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-semibold">Total sales</span>
                            <span className="font-bold text-[#A78BFA]">{totalSales}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-semibold">Avg rating</span>
                            <span className="font-bold text-amber">{user.avgRating} ★</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-semibold">Verified reviews</span>
                            <span className="font-bold text-foreground">{totalSales}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-semibold">Response rate</span>
                            <span className="font-bold text-[#22d3ee]">98%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-semibold">Member since</span>
                            <span className="font-bold text-foreground">{user.memberSince}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
