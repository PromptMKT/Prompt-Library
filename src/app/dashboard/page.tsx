import Link from "next/link";
import { TrendingUp, Download, Plus, ArrowUpRight, Star, Wallet, MessageCircle, CircleDashed } from "lucide-react";

const promptRows = [
  { prompt: "Cold Email Framework", platform: "ChatGPT", status: "Live", sales: "489", revenue: "14,670", rating: "4.9" },
  { prompt: "Twitter Thread Framework", platform: "ChatGPT", status: "Live", sales: "445", revenue: "11,125", rating: "4.6" },
  { prompt: "LinkedIn Post Engine", platform: "ChatGPT", status: "Live", sales: "334", revenue: "7,348", rating: "4.7" },
  { prompt: "Food Photography Hero", platform: "FLUX", status: "Live", sales: "112", revenue: "3,584", rating: "4.6" },
  { prompt: "SEO Blog Post Architect", platform: "ChatGPT", status: "Draft", sales: "-", revenue: "-", rating: "-" },
];

const reviews = [
  { name: "Aditya K.", prompt: "Cold Email Framework", copy: "Saved us big agency fees. Indistinguishable from real copywriter.", stars: 5 },
  { name: "Meera R.", prompt: "LinkedIn Post Engine", copy: "Saved 3 hours a week. Team uses it daily now.", stars: 5 },
  { name: "Rahul K.", prompt: "Food Photography Hero", copy: "Great for dark products and marble setups.", stars: 5 },
];

const topPerforming = [
  { rank: 1, name: "Cold Email Framework", sales: 489, total: "14,670", color: "bg-primary/95", width: 100 },
  { rank: 2, name: "Twitter Thread Framework", sales: 445, total: "11,125", color: "bg-primary/80", width: 92 },
  { rank: 3, name: "LinkedIn Post Engine", sales: 334, total: "7,348", color: "bg-primary/65", width: 70 },
  { rank: 4, name: "Food Photography Hero", sales: 112, total: "3,584", color: "bg-primary/50", width: 35 },
  { rank: 5, name: "SEO Blog Post Architect", sales: 98, total: "2,744", color: "bg-primary/35", width: 28 },
];

const topBuyers = [
  { initials: "AK", name: "Aditya K.", purchases: 8, coins: 312, badge: "bg-primary" },
  { initials: "MR", name: "Meera R.", purchases: 5, coins: 204, badge: "bg-primary/85" },
  { initials: "KS", name: "Karthik S.", purchases: 4, coins: 160, badge: "bg-primary/70" },
  { initials: "RV", name: "Riya V.", purchases: 3, coins: 96, badge: "bg-primary/60" },
  { initials: "DM", name: "Dev M.", purchases: 3, coins: 90, badge: "bg-primary/50" },
];

const categorySegments = [
  { label: "Email & Copy", color: "#6D5AE6", dash: "153 402", offset: "0" },
  { label: "Social Media", color: "#8474EC", dash: "98 402", offset: "-153" },
  { label: "Image/Visual", color: "#9D90F1", dash: "64 402", offset: "-251" },
  { label: "Strategy", color: "#B8AFF6", dash: "48 402", offset: "-315" },
  { label: "Research", color: "#D5D0FC", dash: "39 402", offset: "-363" },
];

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Upload", href: "/upload" },
  { label: "Wallet", href: "/wallet" },
  { label: "Coins", href: "/coins" },
  { label: "Sign In", href: "/sign-in" },
];

export default function DashboardPage() {
  return (
    <div className="bg-background min-h-dvh w-full font-sans text-slate-900 dark:text-foreground">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block border-r border-border bg-card/70 p-4 h-[calc(100dvh-4rem)] sticky top-16">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Overview</p>
          <nav className="space-y-1">
            {sidebarLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                  item.href === "/dashboard" ? "bg-primary/10 text-primary" : "text-card-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
          <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-foreground">Good morning, Priya</h1>
              <p className="text-muted-foreground mt-1">Here&apos;s how your prompts are performing</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-bold text-card-foreground inline-flex items-center gap-2 hover:bg-secondary">
                Last 30 days
              </button>
              <button className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-bold text-card-foreground inline-flex items-center gap-2 hover:bg-secondary">
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-black inline-flex items-center gap-2 hover:bg-primary/90">
                <Plus className="w-4 h-4" /> New prompt
              </button>
            </div>
          </header>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total earnings", value: "2,840", info: "+18% vs last period", color: "text-primary" },
              { label: "Total sales", value: "1,847", info: "+24% vs last period", color: "text-primary" },
              { label: "Avg rating", value: "4.9", info: "+0.1 vs last period", color: "text-primary" },
              { label: "Active prompts", value: "38", info: "+3 new this period", color: "text-primary" },
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
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
                <div className="inline-flex rounded-lg bg-secondary p-1 text-xs font-black">
                  <span className="px-2 py-1 rounded-md text-muted-foreground">7D</span>
                  <span className="px-2 py-1 rounded-md bg-card text-primary">30D</span>
                  <span className="px-2 py-1 rounded-md text-muted-foreground">90D</span>
                </div>
              </div>
              <div className="h-72 rounded-xl bg-secondary/50 border border-border p-4">
                <svg viewBox="0 0 760 260" className="w-full h-full">
                  {[20, 48, 76, 104, 132, 160, 188, 216, 244].map((y) => (
                    <line key={y} x1="36" y1={y} x2="744" y2={y} stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.14" />
                  ))}

                  {[36, 132, 228, 324, 420, 516, 612, 708, 744].map((x) => (
                    <line key={x} x1={x} y1="20" x2={x} y2="244" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.12" />
                  ))}

                  <path
                    d="M36 214 C 52 184, 66 170, 82 206 C 96 238, 112 102, 132 124 C 148 140, 166 16, 188 52 C 206 86, 224 142, 244 170 C 262 196, 280 214, 304 224 C 322 232, 338 36, 356 24 C 372 18, 386 98, 404 112 C 422 124, 440 76, 456 52 C 474 24, 492 154, 508 184 C 526 216, 544 228, 564 216 C 584 202, 598 46, 612 38 C 628 34, 646 88, 664 116 C 682 144, 698 182, 708 194 C 722 210, 734 62, 744 26 L 744 244 L 36 244 Z"
                    fill="hsl(var(--primary))"
                    opacity="0.1"
                  />

                  <path
                    d="M36 214 C 52 184, 66 170, 82 206 C 96 238, 112 102, 132 124 C 148 140, 166 16, 188 52 C 206 86, 224 142, 244 170 C 262 196, 280 214, 304 224 C 322 232, 338 36, 356 24 C 372 18, 386 98, 404 112 C 422 124, 440 76, 456 52 C 474 24, 492 154, 508 184 C 526 216, 544 228, 564 216 C 584 202, 598 46, 612 38 C 628 34, 646 88, 664 116 C 682 144, 698 182, 708 194 C 722 210, 734 62, 744 26"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <g fill="hsl(var(--primary))" fontSize="11" fontWeight="700" opacity="0.8">
                    <text x="8" y="247">O20</text>
                    <text x="8" y="219">O30</text>
                    <text x="8" y="191">O40</text>
                    <text x="8" y="163">O50</text>
                    <text x="8" y="135">O60</text>
                    <text x="8" y="107">O70</text>
                    <text x="8" y="79">O80</text>
                    <text x="8" y="51">O90</text>
                    <text x="8" y="23">O100</text>
                  </g>

                  <g fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="700">
                    <text x="24" y="258">Feb 20</text>
                    <text x="120" y="258">Feb 24</text>
                    <text x="216" y="258">Feb 28</text>
                    <text x="312" y="258">Mar 4</text>
                    <text x="408" y="258">Mar 8</text>
                    <text x="504" y="258">Mar 12</text>
                    <text x="600" y="258">Mar 16</text>
                    <text x="696" y="258">Mar 20</text>
                  </g>
                </svg>
              </div>
            </article>

            <article className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-xl font-bold text-foreground">This month</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["489", "Coins earned"],
                  ["54", "Sales made"],
                  ["12", "New reviews"],
                  ["81", "In escrow"],
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
                  <button className="text-xs font-bold text-primary">Refresh</button>
                </div>
                <ul className="space-y-2 text-sm text-card-foreground">
                  <li className="flex items-start gap-2"><TrendingUp className="w-4 h-4 text-primary mt-0.5" /> Cold Email trending this week.</li>
                  <li className="flex items-start gap-2"><CircleDashed className="w-4 h-4 text-primary mt-0.5" /> 3 drafts are 80-95% complete.</li>
                  <li className="flex items-start gap-2"><ArrowUpRight className="w-4 h-4 text-primary mt-0.5" /> Add a video prompt for higher conversion.</li>
                </ul>
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
            <article className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Sales by category</h2>
              </div>
              <div className="p-6 flex flex-col items-center gap-5">
                <svg viewBox="0 0 220 220" className="w-44 h-44">
                  <circle cx="110" cy="110" r="64" fill="none" stroke="hsl(var(--border))" strokeWidth="34" />
                  {categorySegments.map((segment) => (
                    <circle
                      key={segment.label}
                      cx="110"
                      cy="110"
                      r="64"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="34"
                      strokeDasharray={segment.dash}
                      strokeDashoffset={segment.offset}
                      transform="rotate(-90 110 110)"
                    />
                  ))}
                  <circle cx="110" cy="110" r="46" fill="#ffffff" />
                </svg>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                  {categorySegments.map((segment) => (
                    <span key={segment.label} className="inline-flex items-center gap-2 text-card-foreground">
                      <span className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: segment.color }} /> {segment.label}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Top performing</h2>
                <button className="text-sm font-bold text-primary">See all</button>
              </div>
              <div className="p-5 space-y-4">
                {topPerforming.map((item) => (
                  <div key={item.rank} className="grid grid-cols-[34px_1fr_auto] items-center gap-3">
                    <p className="text-sm font-semibold text-muted-foreground">#{item.rank}</p>
                    <div>
                      <p className="font-semibold text-foreground leading-tight">{item.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.sales} sales • ◈{item.total} total</p>
                    </div>
                    <div className="w-16 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                      <span className={`block h-full ${item.color}`} style={{ width: `${item.width}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Top buyers</h2>
              </div>
              <div className="p-5 space-y-2">
                {topBuyers.map((buyer) => (
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
                ))}
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
            <article className="rounded-2xl border border-border bg-card overflow-x-auto">
              <div className="p-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">All prompts</h2>
                <button className="text-sm font-bold text-primary">Manage all</button>
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
                  {promptRows.map((row) => (
                    <tr key={row.prompt} className="border-b border-border/80 hover:bg-secondary/40">
                      <td className="py-3 px-5 font-semibold text-foreground">{row.prompt}</td>
                      <td className="py-3 px-5 text-card-foreground">{row.platform}</td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === "Live" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-primary font-semibold">{row.sales}</td>
                      <td className="py-3 px-5 text-primary font-semibold">◈{row.revenue}</td>
                      <td className="py-3 px-5 text-foreground inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-primary text-primary" /> {row.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <article className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Recent reviews</h2>
                <button className="text-sm font-bold text-primary">View all</button>
              </div>
              {reviews.map((review) => (
                <div key={review.name} className="border-t border-border pt-3">
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.prompt}</p>
                  <p className="text-sm text-card-foreground mt-1">"{review.copy}"</p>
                  <p className="text-primary text-sm mt-1">{"★".repeat(review.stars)}</p>
                </div>
              ))}
            </article>
          </div>

          <article className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Live activity</h2>
              <p className="text-xs text-muted-foreground">Updated 03:37 PM</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-secondary/60 border border-border p-4">
                <p className="font-bold text-foreground mb-2">Sales</p>
                <ul className="space-y-2 text-card-foreground">
                  <li>Aditya K. bought Cold Email</li>
                  <li>Karthik V. bought Cold Email</li>
                  <li>Riya M. bought LinkedIn Post</li>
                </ul>
              </div>
              <div className="rounded-xl bg-secondary/60 border border-border p-4">
                <p className="font-bold text-foreground mb-2">Reviews</p>
                <ul className="space-y-2 text-card-foreground">
                  <li>Meera R. rated LinkedIn Post</li>
                  <li>Sneha K. rated Twitter Thread</li>
                  <li>Rahul K. rated Food Photography</li>
                </ul>
              </div>
              <div className="rounded-xl bg-secondary/60 border border-border p-4">
                <p className="font-bold text-foreground mb-2">Earnings</p>
                <ul className="space-y-2 text-card-foreground">
                  <li className="inline-flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" /> Cold Email sale +027</li>
                  <li className="inline-flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" /> LinkedIn sale +020</li>
                  <li className="inline-flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" /> Escrow released +081</li>
                </ul>
              </div>
            </div>
          </article>

          <div className="rounded-2xl border border-border bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-lg font-black text-foreground">Your personalized feed is ready</p>
              <p className="text-sm text-card-foreground">Publish one more prompt to unlock featured creator placement.</p>
            </div>
            <button className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-black inline-flex items-center gap-2 hover:bg-primary/90">
              <MessageCircle className="w-4 h-4" /> Launch next prompt
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
