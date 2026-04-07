"use client";

import Link from "next/link";
import { TrendingUp, Download, Plus, ArrowUpRight, Star, Wallet as WalletIcon, MessageCircle, CircleDashed } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Category Segments for the Donut Chart (unchanged visual design)
const categorySegments = [
  { label: "Email & Copy", color: "#6D5AE6", dash: "153 402", offset: "0" },
  { label: "Social Media", color: "#8474EC", dash: "98 402", offset: "-153" },
  { label: "Image/Visual", color: "#9D90F1", dash: "64 402", offset: "-251" },
  { label: "Strategy", color: "#B8AFF6", dash: "48 402", offset: "-315" },
  { label: "Research", color: "#D5D0FC", dash: "39 402", offset: "-363" },
];

function timeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) return "just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const firstName = profile?.display_name?.split(' ')[0] || user?.email?.split('@')[0] || "Creator";

  const [promptRows, setPromptRows] = useState<any[]>([]);
  const [topPerforming, setTopPerforming] = useState<any[]>([]);
  
  // Dashboard Aggregates
  const [totalEarnings, setTotalEarnings] = useState("0");
  const [totalSales, setTotalSales] = useState("0");
  const [avgRating, setAvgRating] = useState("0.0");
  const [activePromptsCount, setActivePromptsCount] = useState("0");
  const [realReviews, setRealReviews] = useState<any[]>([]);
  const [realTopBuyers, setRealTopBuyers] = useState<any[]>([]);
  const [realChartData, setRealChartData] = useState<any[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const [realCategorySegments, setRealCategorySegments] = useState<any[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<any | null>(null);
  const [rawPrompts, setRawPrompts] = useState<any[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [recentReviewsLive, setRecentReviewsLive] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      // Some prompts may have been saved against public.users.id, others against auth.users.id.
      // Query both so dashboard metrics stay correct for existing data.
      const creatorIds = [profile?.id, user.id].filter(Boolean) as string[];
      if (creatorIds.length === 0) return;

      const { data: prompts, error } = await supabase
        .from('prompts')
        .select(`
          id, title, price, is_published, purchases_count, average_rating,
          platform:platforms(name),
          category:categories(name)
        `)
        .in('creator_id', creatorIds)
        .order('purchases_count', { ascending: false });

      if (error) {
        console.error("Error fetching creator prompts:", error);
        return;
      }

      if (prompts && prompts.length > 0) {
        setRawPrompts(prompts);
        // Aggregate totals
        let earnings = 0;
        let sales = 0;
        let totalRating = 0;
        let ratingCount = 0;
        let activeCount = 0;

        const tableRows = prompts.map(p => {
          const s = p.purchases_count || 0;
          const r = p.average_rating || 0;
          const rev = s * (p.price || 0);
          
          sales += s;
          earnings += rev;
          if (r > 0) {
            totalRating += r;
            ratingCount++;
          }
          if (p.is_published) {
            activeCount++;
          }

          return {
            prompt: p.title || "Untitled Prompt",
            platform: (p.platform as any)?.name || "Unknown",
            status: p.is_published ? "Live" : "Draft",
            sales: s.toString(),
            revenue: rev.toLocaleString(),
            rating: r.toFixed(1)
          };
        });

        setPromptRows(tableRows);
        setTotalSales(sales.toLocaleString());
        setTotalEarnings(earnings.toLocaleString());
        setActivePromptsCount(activeCount.toString());
        setAvgRating(ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0");

        // Top Performing (Top 5 by Revenue)
        const sortedByRevenue = [...prompts].sort((a, b) => {
          const revA = (a.purchases_count || 0) * (a.price || 0);
          const revB = (b.purchases_count || 0) * (b.price || 0);
          return revB - revA;
        }).slice(0, 5);
        
        const maxEarnings = sortedByRevenue.length > 0 ? ((sortedByRevenue[0].purchases_count || 0) * (sortedByRevenue[0].price || 0)) : 1;
        const colors = ["bg-primary/95", "bg-primary/80", "bg-primary/65", "bg-primary/50", "bg-primary/35"];
        
        setTopPerforming(sortedByRevenue.map((p, index) => {
          const itemSales = p.purchases_count || 0;
          const itemEarnings = itemSales * (p.price || 0);
          return {
            id: p.id,
            rank: index + 1,
            name: p.title || "Untitled Prompt",
            sales: itemSales,
            total: itemEarnings.toLocaleString(),
            color: colors[index] || "bg-primary/20",
            width: maxEarnings > 0 ? Math.max(10, (itemEarnings / maxEarnings) * 100) : 10
          };
        }));

        // Process Category Sales for Donut Chart
        const catMap: Record<string, number> = {};
        let totalSalesAll = 0;
        prompts.forEach(p => {
          const catName = (p.category as any)?.name || "Uncategorized";
          const s = p.purchases_count || 0;
          catMap[catName] = (catMap[catName] || 0) + s;
          totalSalesAll += s;
        });

        const catColors = ["#6D5AE6", "#8474EC", "#9D90F1", "#B8AFF6", "#D5D0FC", "#E7E4FF"];
        let currentOffset = 0;
        const processedCats = Object.entries(catMap)
          .sort((a, b) => b[1] - a[1])
          .map(([label, sales], i) => {
            const percent = totalSalesAll > 0 ? (sales / totalSalesAll) : 0;
            const dashLen = Math.round(percent * 402);
            const segment = {
              label,
              sales,
              percent: Math.round(percent * 100),
              color: catColors[i % catColors.length],
              dash: `${dashLen} 402`,
              offset: `-${currentOffset}`
            };
            currentOffset += dashLen;
            return segment;
          });
        
        setRealCategorySegments(processedCats);

        // Fetch real reviews for these prompts
        const promptIds = prompts.map(p => p.id);
        if (promptIds.length > 0) {
          const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*, prompts(title)')
            .in('prompt_id', promptIds)
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (reviewsData) {
            setRecentReviewsLive(reviewsData);
            setRealReviews(reviewsData.map(r => ({
              name: "Verified Buyer", // Since reviews might not have user info joined or it might be anonymous
              prompt: (r.prompts as any)?.title || "Untitled Prompt",
              copy: r.body,
              stars: r.rating || 5
            })));
          }

          // Fetch Top Buyers
          const { data: purchasesData } = await supabase
            .from('purchases')
            .select('user_id, amount_paid, purchased_at, users(display_name, username, avatar_url), prompts(title)')
            .in('prompt_id', promptIds);
          
          if (purchasesData) {
            const buyerMap: Record<string, any> = {};
            
            purchasesData.forEach((p: any) => {
              const bId = p.user_id;
              if (!buyerMap[bId]) {
                const u = p.users;
                const name = u?.display_name || u?.username || "Anonymous";
                buyerMap[bId] = {
                  name,
                  purchases: 0,
                  coins: 0,
                  initials: name.substring(0, 2).toUpperCase(),
                  badge: ["bg-primary", "bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"][Math.floor(Math.random() * 5)]
                };
              }
              buyerMap[bId].purchases += 1;
              buyerMap[bId].coins += Number(p.amount_paid || 0);
            });

            const sortedBuyers = Object.values(buyerMap)
              .sort((a, b) => b.coins - a.coins)
              .slice(0, 5);
            
            setRealTopBuyers(sortedBuyers);
            setRecentPurchases(purchasesData.sort((a, b) => 
              new Date(b.purchased_at || 0).getTime() - new Date(a.purchased_at || 0).getTime()
            ).slice(0, 5));
          }

          // Fetch Business Intelligence: Revenue Over Time (Dynamic Time Range)
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - (timeRange - 1));
          startDate.setHours(0, 0, 0, 0);
          
          const { data: chartDataRaw } = await supabase
            .from('purchases')
            .select('amount_paid, purchased_at')
            .in('prompt_id', promptIds)
            .gte('purchased_at', startDate.toISOString())
            .order('purchased_at', { ascending: true });

          if (chartDataRaw) {
            // Create time-range buckets
            const dayBuckets: Record<string, number> = {};
            for (let i = timeRange - 1; i >= 0; i--) {
              const d = new Date();
              d.setDate(d.getDate() - i);
              dayBuckets[d.toISOString().split('T')[0]] = 0;
            }

            chartDataRaw.forEach((p: any) => {
              const dateStr = p.purchased_at.split('T')[0];
              if (dayBuckets[dateStr] !== undefined) {
                dayBuckets[dateStr] += Number(p.amount_paid || 0);
              }
            });

            const processedData = Object.entries(dayBuckets).map(([date, amount]) => ({
              date,
              amount,
              label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }));
            
            setRealChartData(processedData);
          }
        }
      } else {
        setRawPrompts([]);
        setPromptRows([]);
        setTopPerforming([]);
        setTotalSales("0");
        setTotalEarnings("0");
        setActivePromptsCount("0");
        setAvgRating("0.0");
        setRealCategorySegments([]);
        setRecentPurchases([]);
        setRecentReviewsLive([]);
        setRealReviews([]);
        setRealTopBuyers([]);
        setRealChartData([]);
      }
    }

    fetchDashboardData();
  }, [user, profile?.id, timeRange]);

  // Keep static mock data for buyers/reviews/activity until those tables exist
  // Buyers tracking not yet implemented in DB
  const topBuyers = realTopBuyers.length > 0 ? realTopBuyers : [];
  const reviews = realReviews.length > 0 ? realReviews : [];

  return (
    <div className="bg-background min-h-dvh w-full font-sans text-slate-900 dark:text-foreground">
      <div className="w-full">
        <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">

          <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-foreground">
                Good morning, {firstName}
              </h1>
              <p className="text-muted-foreground mt-1">Here&apos;s how your prompts are performing</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div suppressHydrationWarning className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-bold text-card-foreground inline-flex items-center gap-2">
                Last {timeRange} days
              </div>
              <button suppressHydrationWarning className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-bold text-card-foreground inline-flex items-center gap-2 hover:bg-secondary">
                <Download className="w-4 h-4" /> Export
              </button>
              <Link href="/upload" suppressHydrationWarning className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-black inline-flex items-center gap-2 hover:bg-primary/90">
                <Plus className="w-4 h-4" /> New prompt
              </Link>
            </div>
          </header>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total earnings", value: totalEarnings, info: "Lifetime total", color: "text-primary" },
              { label: "Total sales", value: totalSales, info: "Lifetime total", color: "text-primary" },
              { label: "Avg rating", value: avgRating, info: "Across all active", color: "text-primary" },
              { label: "Active prompts", value: activePromptsCount, info: "Currently listed", color: "text-primary" },
            ].map((card) => (
              <article key={card.label} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className={`text-4xl font-black mt-3 ${card.color}`}>{card.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{card.info}</p>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_290px] gap-4">
            <article className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground">Revenue over time</h2>
                  <p className="text-xs text-muted-foreground">Last {timeRange} days</p>
                </div>
                <div className="inline-flex rounded-lg bg-secondary p-1 text-xs font-black">
                  {[7, 30, 90].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-md transition-all ${
                        timeRange === range 
                          ? "bg-card text-primary shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {range}D
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-72 rounded-xl bg-secondary/50 border border-border p-4 relative group">
                <svg 
                  viewBox="0 0 760 260" 
                  className="w-full h-full overflow-visible"
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Grid Lines */}
                  {[20, 76, 132, 188, 244].map((y) => (
                    <line key={y} x1="36" y1={y} x2="744" y2={y} stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.1" />
                  ))}

                  {/* Horizontal Labels (Coins) */}
                  <g fill="hsl(var(--primary))" fontSize="10" fontWeight="700" opacity="0.6">
                    {realChartData.length > 0 && (() => {
                      const maxVal = Math.max(...realChartData.map(d => d.amount), 10);
                      return [0, 0.25, 0.5, 0.75, 1].map(p => {
                        const val = Math.round(maxVal * p);
                        const y = 244 - (p * 224);
                        return <text key={p} x="5" y={y + 4}>◈{val}</text>
                      });
                    })()}
                  </g>

                  {/* Data Path */}
                  {realChartData.length > 0 && (() => {
                    const maxVal = Math.max(...realChartData.map(d => d.amount), 10);
                    const stepX = 708 / (realChartData.length - 1);
                    
                    const points = realChartData.map((d, i) => ({
                      x: 36 + (i * stepX),
                      y: 244 - ((d.amount / maxVal) * 224),
                      ...d
                    }));

                    const pathData = points.reduce((acc, p, i) => 
                      i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, 
                    "");

                    const areaData = `${pathData} L ${points[points.length-1].x} 244 L 36 244 Z`;

                    return (
                      <>
                        <path d={areaData} fill="hsl(var(--primary))" opacity="0.1" />
                        <path 
                          d={pathData} 
                          fill="none" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        
                        {/* Interactive Zones */}
                        {points.map((p, i) => (
                          <rect
                            key={i}
                            x={p.x - stepX/2}
                            y="0"
                            width={stepX}
                            height="260"
                            fill="transparent"
                            onMouseEnter={() => setHoveredPoint(p)}
                            className="cursor-pointer"
                          />
                        ))}

                        {/* Hover Elements */}
                        {hoveredPoint && (
                          <g>
                            <line 
                              x1={hoveredPoint.x} y1="20" 
                              x2={hoveredPoint.x} y2="244" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth="1" 
                              strokeDasharray="4 4" 
                            />
                            <circle 
                              cx={hoveredPoint.x} 
                              cy={hoveredPoint.y} 
                              r="6" 
                              fill="hsl(var(--primary))" 
                              stroke="white" 
                              strokeWidth="2" 
                            />
                          </g>
                        )}
                      </>
                    );
                  })()}

                  {/* Date Labels (Dynamic) */}
                  <g fill="hsl(var(--muted-foreground))" fontSize="10" fontWeight="700">
                    {realChartData.filter((_, i) => i % 5 === 0 || i === realChartData.length - 1).map((d, i) => {
                      const stepX = 708 / (realChartData.length - 1);
                      const fullIndex = realChartData.indexOf(d);
                      return <text key={d.date} x={36 + (fullIndex * stepX) - 15} y="258">{d.label}</text>
                    })}
                  </g>
                </svg>

                {/* Tooltip Overlay */}
                {hoveredPoint && (
                  <div 
                    className="absolute z-50 bg-card border border-border/80 shadow-xl rounded-lg p-2.5 pointer-events-none transition-all duration-200"
                    style={{ 
                      left: `${(hoveredPoint.x / 760) * 100}%`, 
                      top: `${(hoveredPoint.y / 260) * 100}%`,
                      transform: 'translate(-50%, -120%)'
                    }}
                  >
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{hoveredPoint.date}</p>
                    <p className="text-sm font-black text-primary leading-none">◈ {hoveredPoint.amount} <span className="text-[10px] text-muted-foreground font-medium">coins</span></p>
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-xl font-bold text-foreground">This month</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  [totalEarnings, "Coins earned"],
                  [totalSales, "Sales made"],
                  ["0", "New reviews"], 
                  ["0", "In escrow"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-border bg-secondary/60 px-3 py-3">
                    <p className="text-2xl font-bold text-primary">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-secondary/60 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-foreground">AI insights</p>
                  <button suppressHydrationWarning className="text-xs font-bold text-primary">Refresh</button>
                </div>
                <ul className="space-y-2 text-sm text-card-foreground">
                  <li className="flex items-start gap-2"><TrendingUp className="w-4 h-4 text-primary mt-0.5" /> Optimize listings with video for +15% conversion.</li>
                  <li className="flex items-start gap-2"><ArrowUpRight className="w-4 h-4 text-primary mt-0.5" /> Consider creating ChatGPT framework prompts.</li>
                </ul>
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
            <article className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Sales by category</h2>
              </div>
              <div className="p-6 flex flex-col items-center gap-5 relative">
                <div className="relative w-44 h-44">
                  <svg viewBox="0 0 220 220" className="w-full h-full transform transition-transform duration-500">
                    <circle cx="110" cy="110" r="64" fill="none" stroke="hsl(var(--border))" strokeWidth="34" opacity="0.3" />
                    {realCategorySegments.map((segment) => (
                      <circle
                        key={segment.label}
                        cx="110"
                        cy="110"
                        r="64"
                        fill="none"
                        stroke={segment.color}
                        strokeWidth={hoveredCategory?.label === segment.label ? "40" : "34"}
                        strokeDasharray={segment.dash}
                        strokeDashoffset={segment.offset}
                        transform="rotate(-90 110 110)"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredCategory(segment)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      />
                    ))}
                    <circle cx="110" cy="110" r="42" fill="white" className="dark:fill-slate-900 shadow-inner" />
                  </svg>
                  
                  {/* Center Tooltip Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {hoveredCategory ? (
                      <>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{hoveredCategory.label}</p>
                        <p className="text-xl font-black text-foreground">{hoveredCategory.percent}%</p>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Sales</p>
                        <p className="text-xl font-black text-foreground">{totalSales}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                  {realCategorySegments.map((segment) => (
                    <span 
                      key={segment.label} 
                      className={`inline-flex items-center gap-2 transition-opacity duration-200 ${
                        hoveredCategory && hoveredCategory.label !== segment.label ? "opacity-40" : "opacity-100"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: segment.color }} /> 
                      <span className="font-medium text-card-foreground">{segment.label}</span>
                      <span className="text-xs text-muted-foreground">({segment.sales})</span>
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Top performing</h2>
                <button 
                  suppressHydrationWarning 
                  onClick={() => document.getElementById('all-prompts-table')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm font-bold text-primary hover:underline hover:opacity-80 transition-all"
                >
                  See all
                </button>
              </div>
              <div className="p-5 space-y-4 flex-1">
                {topPerforming.length > 0 ? topPerforming.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/prompt/${item.id}`}
                    className="grid grid-cols-[34px_1fr_auto] items-center gap-3 p-2 -mx-2 rounded-xl transition-all duration-300 hover:bg-secondary group"
                  >
                    <p className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">#{item.rank}</p>
                    <div className="truncate">
                      <p className="font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.sales} sales • ◈{item.total} total</p>
                    </div>
                    <div className="w-16 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                      <span className={`block h-full ${item.color} transition-all duration-700`} style={{ width: `${item.width}%` }} />
                    </div>
                  </Link>
                )) : (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No sales data available yet.
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Top buyers</h2>
              </div>
              <div className="p-5 space-y-2">
                {topBuyers.length > 0 ? topBuyers.map((buyer) => (
                  <div key={buyer.name} className="py-3 border-b border-border last:border-b-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-full text-white text-sm font-black inline-flex items-center justify-center ${buyer.badge}`}>
                        {buyer.initials}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">{buyer.name}</p>
                        <p className="text-sm text-muted-foreground">{buyer.purchases} purchases</p>
                      </div>
                    </div>
                    <p className="text-primary font-semibold">◈ {buyer.coins}</p>
                  </div>
                )) : (
                  <div className="py-10 text-center text-sm text-muted-foreground italic">
                    No purchase data available yet.
                  </div>
                )}
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4" id="all-prompts-table">
            <article className="rounded-2xl border border-border bg-card overflow-x-auto">
              <div className="p-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">All prompts</h2>
                <button suppressHydrationWarning className="text-sm font-bold text-primary">Manage all</button>
              </div>
              <table className="w-full min-w-190 text-sm">
                <thead>
                  <tr className="border-y border-border text-muted-foreground">
                    <th className="text-left py-3 px-5 font-black">Prompt</th>
                    <th className="text-left py-3 px-5 font-black">Platform</th>
                    <th className="text-left py-3 px-5 font-black">Status</th>
                    <th className="text-left py-3 px-5 font-black">Sales</th>
                    <th className="text-left py-3 px-5 font-black">Revenue</th>
                    <th className="text-left py-3 px-5 font-black">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {promptRows.length > 0 ? (
                    rawPrompts.map((p, i) => {
                      const s = p.purchases_count || 0;
                      const r = p.average_rating || 0;
                      const rev = (s * (p.price || 0)).toLocaleString();
                      const status = p.is_published ? "Live" : "Draft";
                      
                      return (
                        <tr 
                          key={p.id} 
                          className="border-b border-border/80 hover:bg-secondary/40 transition-colors cursor-pointer group"
                          onClick={() => window.location.href = `/prompt/${p.id}`}
                        >
                          <td className="py-3 px-5 font-semibold text-foreground group-hover:text-primary transition-colors">{p.title}</td>
                          <td className="py-3 px-5 text-card-foreground">{(p.platform as any)?.name || "Unknown"}</td>
                          <td className="py-3 px-5">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === "Live" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                              {status}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-primary font-semibold">{s}</td>
                          <td className="py-3 px-5 text-primary font-semibold">◈{rev}</td>
                          <td className="py-3 px-5 text-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-primary text-primary" /> {r.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                        No prompts uploaded yet. <Link href="/upload" className="text-primary hover:underline">Create your first prompt</Link>.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </article>

            <article className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Recent reviews</h2>
                <button suppressHydrationWarning className="text-sm font-bold text-primary">View all</button>
              </div>
              {reviews.length > 0 ? reviews.map((review, i) => (
                <div key={i} className="border-t border-border pt-3">
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.prompt}</p>
                  <p className="text-sm text-card-foreground mt-1">"{review.copy}"</p>
                  <p className="text-primary text-sm mt-1">{"★".repeat(review.stars)}</p>
                </div>
              )) : (
                <div className="py-10 text-center text-sm text-muted-foreground italic">
                  No reviews received yet.
                </div>
              )}
            </article>
          </div>

          <article className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Live activity</h2>
              <p className="text-xs text-muted-foreground">Updated Now</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-secondary/60 border border-border p-4">
                <p className="font-bold text-foreground mb-2">Sales</p>
                <ul className="space-y-2 text-card-foreground">
                  {recentPurchases.length > 0 ? recentPurchases.map((p, i) => (
                    <li key={p.id || i} className="flex items-center justify-between gap-2 overflow-hidden">
                      <span className="truncate flex-1">{p.prompts?.title || "Prompt Purchase"}</span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo(p.purchased_at)}</span>
                    </li>
                  )) : (
                    <li className="text-muted-foreground italic">Awaiting new sales data...</li>
                  )}
                </ul>
              </div>
              <div className="rounded-xl bg-secondary/60 border border-border p-4">
                <p className="font-bold text-foreground mb-2">Reviews</p>
                <ul className="space-y-2 text-card-foreground">
                  {recentReviewsLive.length > 0 ? recentReviewsLive.map((r, i) => (
                    <li key={r.id || i} className="flex items-center justify-between gap-2 overflow-hidden">
                      <span className="truncate flex-1">{r.prompts?.title || "New Review"}</span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo(r.created_at)}</span>
                    </li>
                  )) : (
                    <li className="text-muted-foreground italic">Awaiting new review data...</li>
                  )}
                </ul>
              </div>
              <div className="rounded-xl bg-secondary/60 border border-border p-4">
                <p className="font-bold text-foreground mb-2">Earnings</p>
                <ul className="space-y-2 text-card-foreground">
                  {recentPurchases.length > 0 ? recentPurchases.map((p, i) => (
                    <li key={`earning-${p.id || i}`} className="flex items-center justify-between gap-2 overflow-hidden">
                      <span className="truncate flex-1 text-primary font-medium">+◈{p.amount_paid}</span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo(p.purchased_at)}</span>
                    </li>
                  )) : (
                    <li className="text-muted-foreground italic">Awaiting new transaction data...</li>
                  )}
                </ul>
              </div>
            </div>
          </article>

          <div className="rounded-2xl border border-border bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-lg font-black text-foreground">Your personalized feed is ready</p>
              <p className="text-sm text-card-foreground">Publish one more prompt to unlock featured creator placement.</p>
            </div>
            <Link href="/upload" suppressHydrationWarning className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-black inline-flex items-center gap-2 hover:bg-primary/90">
              <MessageCircle className="w-4 h-4" /> Launch next prompt
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
