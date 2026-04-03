"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import "../visitor-profile.css";

interface VisitorProfileViewProps {
    user: any;
    prompts: any[];
}

export function VisitorProfileView({ user, prompts }: VisitorProfileViewProps) {
    const [activeTab, setActiveTab] = useState<"prompts" | "reviews" | "about">("prompts");
    const [activeFilter, setActiveFilter] = useState("All");
    const [followed, setFollowed] = useState(false);
    const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isLight = mounted && (theme === "light" || (theme === "system" && systemTheme === "light"));
    const totalSales = prompts.reduce((acc, p) => acc + (p.reviewsCount || 0), 0);

    const handleFollow = () => {
        setFollowed(!followed);
        toast(followed ? `✓ Unfollowed ${user.name}` : `✓ Now following ${user.name}`);
    };

    const toggleWishlist = (e: React.MouseEvent, promptId: string) => {
        e.stopPropagation();
        const newWl = new Set(wishlistItems);
        if (newWl.has(promptId)) {
            newWl.delete(promptId);
            toast("Removed from wishlist");
        } else {
            newWl.add(promptId);
            toast("Saved to wishlist");
        }
        setWishlistItems(newWl);
    };

    const getInitials = (name: string) => {
        if (!name) return "U";
        const parts = name.split(" ");
        return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
    };

    const handleMessage = () => {
        const el = document.getElementById("msgSection");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        const ta = document.getElementById("visitor-msg-textarea");
        if (ta) setTimeout(() => ta.focus(), 400);
    };

    const handleBuy = (e: React.MouseEvent, p: any) => {
        e.stopPropagation();
        toast(`${p.title} → cart ⬡${p.price}`);
    };

    return (
        <div className={cn("visitor-profile-root", isLight && "light")}>
            <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>

                {/* Cover */}
                <div className="cover">
                    <div className="cover-pattern"></div>
                    <div className="cover-glow"></div>
                    <div className="cover-bottom"></div>
                </div>

                {/* Profile Header */}
                <div className="profile-header">
                    <div className="page" style={{ paddingBottom: "0" }}>
                        <div className="avatar-action-row">
                            <div className="avatar-wrap">
                                {user.avatar ? (
                                    <img src={user.avatar} className="avatar" style={{ objectFit: 'cover' }} alt={user.name} />
                                ) : (
                                    <div className="avatar">{getInitials(user.name)}</div>
                                )}
                                <div className="avatar-online" title="Active 2h ago"></div>
                            </div>

                            {/* Visitor Actions */}
                            <div className="visitor-actions">
                                <button
                                    className={cn("btn-follow", followed && "on")}
                                    onClick={handleFollow}
                                >
                                    {followed ? "✓ Following" : "+ Follow"}
                                </button>
                                <button className="btn-msg" onClick={handleMessage}>✉ Message</button>
                                <div className="btn-icon" title="Share profile" onClick={() => toast("Profile link copied!")}>↗</div>
                                <div className="btn-icon danger" title="Report creator" onClick={() => toast("Report submitted — we'll review within 24h")}>⚑</div>
                            </div>
                        </div>

                        <div className="profile-info">
                            <div className="name-row">
                                <span className="creator-name">{user.name}</span>
                                {user.verified && <span className="badge badge-verified">✓ Verified creator</span>}
                                {user.avgRating >= 4.8 && <span className="badge badge-top">★ Top Seller</span>}
                            </div>
                            <div className="handle">@{user.username} · Member since {user.memberSince}</div>
                            <div className="bio">{user.bio}</div>
                            <div className="spec-tags">
                                <span className="spec-tag">React / TypeScript</span>
                                <span className="spec-tag">Python async</span>
                                <span className="spec-tag">AI agents</span>
                                <span className="spec-tag">DevOps / CI-CD</span>
                                <span className="spec-tag">Claude API</span>
                                <span className="spec-tag">RAG systems</span>
                            </div>
                            <div className="profile-meta">
                                <span className="meta-item text-[13px]">📍 {user.location}</span>
                                <span className="meta-item text-[14px]">🔗 <a href={`https://${user.website}`} target="_blank" rel="noreferrer" style={{ color: "var(--violet3)" }} className="text-[14px]">{user.website}</a></span>
                                <span className="meta-item text-[15px]">👥 <strong className="text-[15px]" style={{ color: "var(--text)" }}>{user.followers}</strong> followers <span className="opacity-30 mx-1">·</span> <strong className="text-[15px]" style={{ color: "var(--text)" }}>{user.following}</strong> following</span>
                                <span className="meta-item text-[14px]">⭐ <strong style={{ color: "var(--amber)" }}>{user.avgRating}</strong> avg rating</span>
                                <span className="meta-live text-[14px]"><span className="live-dot"></span>Active 2h ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
                    <div className="page stats-bar" style={{ paddingBottom: 0, borderBottom: "none" }}>
                        <div className="stat-cell" onClick={() => setActiveTab("prompts")}>
                            <div className="stat-val">{prompts.length}</div>
                            <div className="stat-lbl">Prompts</div>
                        </div>
                        <div className="stat-cell">
                            <div className="stat-val v">{totalSales}</div>
                            <div className="stat-lbl">Total sales</div>
                        </div>
                        <div className="stat-cell" onClick={() => setActiveTab("reviews")}>
                            <div className="stat-val a">{user.avgRating} ★</div>
                            <div className="stat-lbl">Avg rating</div>
                        </div>
                        <div className="stat-cell" onClick={() => setActiveTab("reviews")}>
                            <div className="stat-val">{totalSales}</div>
                            <div className="stat-lbl">Reviews</div>
                        </div>
                        <div className="stat-cell">
                            <div className="stat-val c">98%</div>
                            <div className="stat-lbl">Response rate</div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="page">
                    <div className="content-wrap">
                        {/* LEFT COLUMN */}
                        <div>
                            <div className="tab-bar">
                                <div className={cn("tab", activeTab === "prompts" && "on")} onClick={() => setActiveTab("prompts")}>
                                    Prompts <span className="tab-count">{prompts.length}</span>
                                </div>
                                <div className={cn("tab", activeTab === "reviews" && "on")} onClick={() => setActiveTab("reviews")}>
                                    Reviews <span className="tab-count">{totalSales}</span>
                                </div>
                                <div className={cn("tab", activeTab === "about" && "on")} onClick={() => setActiveTab("about")}>
                                    About
                                </div>
                            </div>

                            {/* PROMPTS TAB */}
                            {activeTab === "prompts" && (
                                <div className="panel on">
                                    <div className="filter-bar">
                                        {["All", "Code & Tech", "Agentic", "Data", "DevOps"].map(filter => (
                                            <div
                                                key={filter}
                                                className={cn("chip", activeFilter === filter && "on")}
                                                onClick={() => setActiveFilter(filter)}
                                            >
                                                {filter}
                                            </div>
                                        ))}
                                        <select className="sort-sel" defaultValue="Top selling">
                                            <option>Top selling</option>
                                            <option>Newest</option>
                                            <option>Highest rated</option>
                                            <option>Price: low → high</option>
                                            <option>Price: high → low</option>
                                        </select>
                                    </div>

                                    <div className="prompt-grid">
                                        {prompts.filter(p => p.status === "live").map((p, i) => (
                                            <div key={p.id} className="pcard" onClick={() => toast(`Opening: ${p.title}`)}>
                                                <div className="pcard-accent" style={{ background: "linear-gradient(90deg,#8B5CF6,transparent)" }}></div>
                                                {i === 0 && <div className="card-badge b-best">★ Bestseller</div>}
                                                {i === 1 && <div className="card-badge b-trend">↑ Trending</div>}

                                                <div
                                                    className={cn("wl-btn", wishlistItems.has(p.id) && "on")}
                                                    onClick={(e) => toggleWishlist(e, p.id)}
                                                    title="Save to wishlist"
                                                >
                                                    {wishlistItems.has(p.id) ? "♥" : "♡"}
                                                </div>

                                                <div className="pcard-preview">
                                                    <div className="preview-code">
                                                        <span className="pc-l">{p.promptText?.slice(0, 40) || "// Code tech placeholder"}</span>
                                                        <span className="pc-l">...</span>
                                                        <span className="pc-l" style={{ opacity: ".4" }}>...</span>
                                                    </div>
                                                </div>

                                                <div className="pcard-body">
                                                    <div className="pcard-meta">
                                                        <span className="cat-pill">{p.category}</span>
                                                        <span className="model-pill">{p.platform} · Claude</span>
                                                    </div>
                                                    <div className="pcard-title">{p.title}</div>
                                                    <div className="pcard-desc" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {p.promptText || p.title}
                                                    </div>
                                                    <div className="pcard-tags">
                                                        <span className="pcard-tag">React</span>
                                                        <span className="pcard-tag">TypeScript</span>
                                                    </div>
                                                    <div className="pcard-footer">
                                                        <div>
                                                            <div className="pcard-price">⬡ {p.price}</div>
                                                            <div className="pcard-inr">≈ ₹{Math.round(p.price * 0.9)}</div>
                                                        </div>
                                                        <div className="card-right">
                                                            <div className="card-rating">★ <strong>{p.rating}</strong> · <strong>{p.reviewsCount}</strong> sales</div>
                                                            <button className="buy-btn" onClick={(e) => handleBuy(e, p)}>Buy now</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Dummy padding cards if prompts are few */}
                                        {prompts.length === 0 && (
                                            <div className="pcard-desc" style={{ padding: 20 }}>This creator hasn't published any prompts yet.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* REVIEWS TAB */}
                            {activeTab === "reviews" && (
                                <div className="panel on">
                                    <div className="review-summary">
                                        <div style={{ textAlign: "center" }}>
                                            <div className="score-big">{user.avgRating}</div>
                                            <div className="score-stars">★★★★★</div>
                                            <div className="score-n">{totalSales} verified reviews</div>
                                        </div>
                                        <div>
                                            <div className="bar-row"><span className="bar-lbl">5</span><div className="bar-track"><div className="bar-fill" style={{ width: "87%" }}></div></div><span className="bar-n">446</span></div>
                                            <div className="bar-row"><span className="bar-lbl">4</span><div className="bar-track"><div className="bar-fill" style={{ width: "10%" }}></div></div><span className="bar-n">51</span></div>
                                            <div className="bar-row"><span className="bar-lbl">3</span><div className="bar-track"><div className="bar-fill" style={{ width: "2%" }}></div></div><span className="bar-n">10</span></div>
                                            <div className="bar-row"><span className="bar-lbl">2</span><div className="bar-track"><div className="bar-fill" style={{ width: "1%" }}></div></div><span className="bar-n">5</span></div>
                                            <div className="bar-row"><span className="bar-lbl">1</span><div className="bar-track"><div className="bar-fill" style={{ width: "0%" }}></div></div><span className="bar-n">0</span></div>
                                        </div>
                                    </div>

                                    <div className="filter-bar">
                                        <div className="chip on">All reviews</div>
                                        <div className="chip">5 ★</div>
                                        <div className="chip">4 ★</div>
                                        <div className="chip">Code & Tech</div>
                                        <select className="sort-sel"><option>Most recent</option><option>Highest rated</option></select>
                                    </div>

                                    {/* Dummy static reviews */}
                                    {[
                                        { a: "AK", n: "Aditya K.", bg: "linear-gradient(135deg,#7C3AED,#A78BFA)", d: "Mar 2026", txt: "React Component Architect is the best coding prompt I've bought...", p: "React Component Architect", h: 12 },
                                        { a: "SR", n: "Sneha R.", bg: "linear-gradient(135deg,#10b981,#0ea5e9)", d: "Mar 2026", txt: "Support Ticket Router has been live for 6 weeks...", p: "Support Ticket Router Agent", h: 28 },
                                        { a: "KV", n: "Karthik V.", bg: "linear-gradient(135deg,#f59e0b,#ef4444)", d: "Feb 2026", txt: "SQL Optimiser found a composite index I'd completely missed...", p: "SQL Query Optimiser", h: 9 }
                                    ].map((r, i) => (
                                        <div className="rev-card" key={i}>
                                            <div className="rev-head">
                                                <div className="rev-ava" style={{ background: r.bg }}>{r.a}</div>
                                                <div><div className="rev-name">{r.n}</div><div className="rev-sub"><span className="ver-pill">✓ Verified buyer</span><span className="rev-date">{r.d}</span></div></div>
                                                <div className="rev-stars">★★★★★</div>
                                            </div>
                                            <div className="rev-text">"{r.txt}"</div>
                                            <div className="rev-prompt">On <span>{r.p}</span></div>
                                            <div className="rev-helpful">
                                                <span className="help-lbl">Helpful?</span>
                                                <button className="help-btn" onClick={() => toast("Marked helpful")}>👍 {r.h}</button>
                                                <button className="help-btn">👎 0</button>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="load-more" onClick={() => toast("Loading more reviews...")}>Load more reviews</button>
                                </div>
                            )}

                            {/* ABOUT TAB */}
                            {activeTab === "about" && (
                                <div className="panel on">
                                    <div className="about-block">
                                        <div className="about-lbl">About this creator</div>
                                        <div className="about-text">{user.bio}</div>
                                    </div>
                                    <div className="about-block">
                                        <div className="about-lbl">Creator stats</div>
                                        <div className="about-grid">
                                            <div className="about-cell"><div className="about-cell-lbl">Member since</div><div className="about-cell-val">{user.memberSince}</div></div>
                                            <div className="about-cell"><div className="about-cell-lbl">Response rate</div><div className="about-cell-val c">98% · avg 4h</div></div>
                                            <div className="about-cell"><div className="about-cell-lbl">Prompts published</div><div className="about-cell-val">{prompts.length}</div></div>
                                            <div className="about-cell"><div className="about-cell-lbl">Repeat buyer rate</div><div className="about-cell-val v">61%</div></div>
                                            <div className="about-cell"><div className="about-cell-lbl">Total sales</div><div className="about-cell-val">{totalSales}</div></div>
                                            <div className="about-cell"><div className="about-cell-lbl">Average rating</div><div className="about-cell-val a">{user.avgRating} / 5</div></div>
                                        </div>
                                    </div>
                                    <div className="about-block">
                                        <div className="about-lbl">Technical specialisations</div>
                                        <div className="skill-cloud">
                                            <span className="skill">React / TypeScript</span><span className="skill">Python async</span>
                                            <span className="skill">AI agents</span><span className="skill">LangChain</span>
                                            <span className="skill">DevOps / CI-CD</span><span className="skill">GitHub Actions</span>
                                        </div>
                                    </div>
                                    <div className="about-block">
                                        <div className="about-lbl">AI platforms covered</div>
                                        <div className="skill-cloud">
                                            <span className="skill" style={{ borderColor: "rgba(139,92,246,.35)", color: "var(--violet3)" }}>Claude</span>
                                            <span className="skill" style={{ borderColor: "rgba(16,163,127,.3)", color: "#10a37f" }}>ChatGPT / GPT-4</span>
                                            <span className="skill" style={{ borderColor: "rgba(56,189,248,.3)", color: "#38bdf8" }}>Cursor / Copilot</span>
                                            <span className="skill" style={{ borderColor: "rgba(66,133,244,.3)", color: "#4285f4" }}>Gemini</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div className="sidebar" id="msgSection">

                            {/* Message Creator Card */}
                            <div className="msg-card">
                                <div className="msg-card-header">
                                    <div className="msg-row">
                                        <div className="msg-ava">{getInitials(user.name)}</div>
                                        <div>
                                            <div className="msg-name">{user.name}</div>
                                            <div className="msg-live"><span className="msg-live-dot"></span>Active 2h ago</div>
                                        </div>
                                    </div>
                                    <div className="msg-response-line">
                                        <span className="msg-resp-tag">⚡ Replies within 4h · 98% response rate</span>
                                    </div>
                                </div>
                                <div className="msg-body">
                                    <div className="msg-hint">Ask before you buy — e.g. "Does this work with Next.js App Router?" or "Can I adjust the output format?"</div>
                                    <textarea id="visitor-msg-textarea" className="msg-ta" placeholder="Type your question..."></textarea>
                                    <button className="msg-send" onClick={() => toast(`Message sent — ${user.name} will reply within 4h`)}>Send message</button>
                                    <div className="msg-note">Private · Free to ask · No spam</div>
                                </div>
                            </div>

                            {/* Creator Credibility */}
                            <div className="sb-card">
                                <div className="sb-title">Creator credibility</div>
                                <div className="cred-row"><span className="cred-lbl">Total sales</span><span className="cred-val v">{totalSales}</span></div>
                                <div className="cred-row"><span className="cred-lbl">Avg rating</span><span className="cred-val a">{user.avgRating} ★</span></div>
                                <div className="cred-row"><span className="cred-lbl">Verified reviews</span><span className="cred-val">{totalSales}</span></div>
                                <div className="cred-row"><span className="cred-lbl">Response rate</span><span className="cred-val c">98%</span></div>
                                <div className="cred-row"><span className="cred-lbl">Avg response time</span><span className="cred-val c">&lt; 4 hours</span></div>
                                <div className="cred-row"><span className="cred-lbl">Repeat buyers</span><span className="cred-val v">61%</span></div>
                                <div className="cred-row"><span className="cred-lbl">Member since</span><span className="cred-val">{user.memberSince}</span></div>
                            </div>

                            {/* Top Selling Models */}
                            <div className="sb-card">
                                <div className="sb-title">Top selling prompts</div>
                                {prompts.slice(0, 4).map((p, i) => (
                                    <div key={p.id} className="top-item" onClick={() => toast(`Viewing ${p.title}`)}>
                                        <span className={cn("top-rank", i < 2 && "g")}>#{i + 1}</span>
                                        <div className="top-info">
                                            <div className="top-name">{p.title}</div>
                                            <div className="top-meta">{p.reviewsCount} sales · ★ {p.rating}</div>
                                        </div>
                                        <span className="top-price">⬡ {p.price}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
