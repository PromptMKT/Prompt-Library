import Link from "next/link";
import {
  Coins,
  Gift,
  Rocket,
  Shield,
  Clock3,
  Wallet,
  Target,
  CircleDot,
  ArrowRight,
  Sparkles,
  CreditCard,
  Users,
  Trophy,
  Flame,
} from "lucide-react";

const earnCards = [
  {
    icon: Gift,
    title: "Sign up bonus",
    reward: "O100",
    copy: "Every new account receives O100 free credits to start exploring prompts instantly.",
    chips: ["One time", "Instant"],
  },
  {
    icon: Sparkles,
    title: "Publish a prompt",
    reward: "O50 - O500",
    copy: "Earn credits whenever your listed prompt is purchased by buyers across the marketplace.",
    chips: ["Per sale", "90% payout"],
  },
  {
    icon: Target,
    title: "Leave a verified review",
    reward: "O10",
    copy: "Help the community with quality reviews and get rewarded for meaningful feedback.",
    chips: ["Per review", "Verified purchase"],
  },
  {
    icon: Users,
    title: "Refer a friend",
    reward: "O25",
    copy: "Invite others to PromptStash and both accounts receive bonus credits after first purchase.",
    chips: ["Referral", "Mutual reward"],
  },
  {
    icon: Trophy,
    title: "Creator milestones",
    reward: "O100 - O500",
    copy: "Unlock milestone rewards as your sales volume grows and your creator profile scales.",
    chips: ["Milestone", "One per tier"],
  },
  {
    icon: Flame,
    title: "Daily streak challenges",
    reward: "O5 - O50",
    copy: "Complete weekly tasks and maintain streaks to stack extra credits into your wallet.",
    chips: ["Daily", "Streak bonus"],
  },
];

const packageCards = [
  { title: "Starter pack", credits: "O100", price: "Rs89", rate: "Rs0.89 per coin", cta: "Buy Starter" },
  { title: "Popular pack", credits: "O500", price: "Rs399", rate: "Rs0.80 per coin", cta: "Buy Popular", featured: true },
  { title: "Pro pack", credits: "O1200", price: "Rs849", rate: "Rs0.71 per coin", cta: "Buy Pro" },
];

const lifecycle = [
  {
    step: "1",
    title: "Buy or earn coins",
    copy: "Top up through wallet checkout or earn through sign up, sales, reviews, and referrals.",
  },
  {
    step: "2",
    title: "Browse and spend",
    copy: "Use credits to unlock premium prompts. Access is delivered immediately after purchase.",
  },
  {
    step: "3",
    title: "Escrow holds",
    copy: "Credits remain in escrow for a short safety window while buyers can raise a dispute.",
  },
  {
    step: "4",
    title: "Seller earns",
    copy: "After escrow release, payout is distributed to creators while platform fee is retained.",
  },
];

const trustCards = [
  {
    icon: Clock3,
    title: "48-hour escrow",
    copy: "Every sale is protected by a timed hold to ensure fair dispute resolution.",
  },
  {
    icon: Shield,
    title: "Buyer protection",
    copy: "If purchased output does not match quality claims, credits can be refunded.",
  },
  {
    icon: Wallet,
    title: "Coins never expire",
    copy: "Your credit balance remains available for future purchases without expiry pressure.",
  },
  {
    icon: CircleDot,
    title: "Full transaction log",
    copy: "Track every credit movement across top ups, purchases, holds, and releases.",
  },
  {
    icon: CreditCard,
    title: "Instant credit",
    copy: "Successful wallet top ups are reflected instantly in your balance.",
  },
  {
    icon: Rocket,
    title: "Withdrawals coming",
    copy: "Seller withdrawals will ship soon with bank and UPI options.",
  },
];

const coinParticles = [
  { left: "12%", delay: "0s", duration: "4.2s" },
  { left: "27%", delay: "0.6s", duration: "4.8s" },
  { left: "43%", delay: "1.1s", duration: "3.9s" },
  { left: "59%", delay: "0.3s", duration: "4.5s" },
  { left: "74%", delay: "1.7s", duration: "5.1s" },
  { left: "88%", delay: "0.9s", duration: "4.1s" },
];

export default function CoinsPage() {
  return (
    <div className="coin-page min-h-screen bg-background text-foreground font-sans">
      <nav className="fixed top-0 left-0 right-0 z-100 border-b border-border/50 bg-background/85 backdrop-blur-2xl">
        <div className="max-w-310 mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/home-v5" className="text-2xl font-black tracking-tight text-primary">PROMPTX</Link>
          <div className="hidden md:flex items-center gap-8">
            {["Explore", "Dashboard", "Wallet", "Coins"].map((item) => (
              <Link
                key={item}
                href={item === "Coins" ? "/coins" : item === "Explore" ? "/explore" : item === "Dashboard" ? "/dashboard" : "#"}
                className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
          <Link href="/get-started" className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.14em] inline-flex items-center hover:bg-primary/90 transition-colors">
            Get O100 Free
          </Link>
        </div>
      </nav>

      <main className="max-w-310 mx-auto px-6 pt-28 pb-24 space-y-22">
        <section className="text-center space-y-6 pt-8">
          <div className="coin-scene mx-auto mb-10">
            <div className="coin-spin-wrap">
              <div className="coin-spin-face">
                <div className="coin-spin-inner">
                  <Coins className="w-12 h-12 text-primary" />
                  <p className="text-[9px] mt-2 font-black tracking-[0.2em] uppercase text-primary/80">Promptcoin</p>
                </div>
              </div>
              <div className="coin-spin-back" />
            </div>
            <div className="coin-glow" />
            <div className="coin-particles">
              {coinParticles.map((particle, idx) => (
                <span
                  key={`${particle.left}-${idx}`}
                  className="coin-particle"
                  style={{ left: particle.left, animationDelay: particle.delay, animationDuration: particle.duration }}
                />
              ))}
            </div>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">The PromptStash Coin Economy</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-tight">Earn coins. Spend coins. Stay in flow.</h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">A circular in-platform economy where each purchase and contribution keeps value moving inside the ecosystem.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/get-started" className="h-12 px-7 rounded-xl bg-primary text-primary-foreground text-sm font-black uppercase tracking-[0.12em] inline-flex items-center">
              Claim O100 free
            </Link>
            <Link href="#how-it-works" className="h-12 px-7 rounded-xl border border-border bg-card text-foreground text-sm font-black uppercase tracking-[0.12em] inline-flex items-center hover:border-primary/60 transition-colors">
              See how it works
            </Link>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 border border-border rounded-2xl overflow-hidden bg-card">
          {[
            ["1.2M", "Coins in circulation"],
            ["48K+", "Active coin holders"],
            ["Rs0.89", "Per coin fixed rate"],
            ["90%", "Seller share per sale"],
          ].map(([value, label]) => (
            <article key={label} className="p-6 border-b sm:border-b-0 sm:border-r last:border-r-0 border-border">
              <p className="text-3xl font-black text-primary">{value}</p>
              <p className="text-sm text-muted-foreground mt-2">{label}</p>
            </article>
          ))}
        </section>

        <section id="how-it-works" className="space-y-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">How you earn</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Every action creates value</h2>
            <p className="text-muted-foreground">Credits reward contributions from buyers, creators, and community members.</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {earnCards.map((card) => (
              <article key={card.title} className="coin-anim-card rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="w-11 h-11 rounded-xl bg-primary/12 border border-primary/30 inline-flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="inline-flex items-center rounded-full px-3 py-1 text-xs font-black bg-primary/12 text-primary border border-primary/30">{card.reward}</p>
                <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.copy}</p>
                <div className="flex flex-wrap gap-2">
                  {card.chips.map((chip) => (
                    <span key={chip} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground">{chip}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Circular economy</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Coins stay inside the ecosystem</h2>
            <p className="text-muted-foreground">Each credit spent by a buyer becomes creator earnings after escrow release.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 overflow-hidden">
            <div className="relative h-90 flex items-center justify-center">
              <div className="orbit-ring orbit-ring-1 absolute w-140 h-140 rounded-full border border-primary/10" />
              <div className="orbit-ring orbit-ring-2 absolute w-105 h-105 rounded-full border border-primary/15" />
              <div className="orbit-ring orbit-ring-3 absolute w-75 h-75 rounded-full border border-primary/20" />
              <div className="eco-core w-52 h-52 rounded-full bg-linear-to-br from-primary/45 to-primary/10 border border-primary/35 flex items-center justify-center shadow-[0_0_70px_hsl(var(--primary)/0.3)] z-10">
                <div className="text-center">
                  <Coins className="w-10 h-10 text-primary mx-auto" />
                  <p className="text-xs mt-2 font-black uppercase tracking-[0.15em] text-primary">Economy Core</p>
                </div>
              </div>

              <span className="eco-label absolute top-16 left-[20%] text-xs font-bold px-3 py-1 rounded-full border border-border bg-secondary text-muted-foreground">Spend coins</span>
              <span className="eco-label absolute top-12 right-[22%] text-xs font-bold px-3 py-1 rounded-full border border-border bg-secondary text-muted-foreground">Earn 90%</span>
              <span className="eco-label absolute bottom-14 right-[28%] text-xs font-bold px-3 py-1 rounded-full border border-border bg-secondary text-muted-foreground">10% fee</span>
              <span className="eco-label absolute bottom-12 left-[24%] text-xs font-bold px-3 py-1 rounded-full border border-border bg-secondary text-muted-foreground">Free coins</span>

              <svg viewBox="0 0 900 360" className="absolute inset-0 w-full h-full text-primary/50" fill="none">
                <path d="M140 210 C 260 160, 330 150, 420 180" stroke="currentColor" strokeWidth="2.5" strokeDasharray="8 8" />
                <path d="M480 165 C 570 125, 640 95, 760 70" stroke="currentColor" strokeWidth="2.5" strokeDasharray="8 8" />
                <path d="M760 120 C 730 190, 690 230, 610 250" stroke="currentColor" strokeWidth="2.5" strokeDasharray="8 8" />
                <path d="M480 270 C 390 300, 300 300, 210 270" stroke="currentColor" strokeWidth="2.5" strokeDasharray="8 8" />
              </svg>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Top up packages</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Buy once, spend anywhere</h2>
            <p className="text-muted-foreground">Flexible wallet packs for all buyer segments.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {packageCards.map((pkg) => (
              <article
                key={pkg.title}
                className={`coin-anim-card rounded-3xl border p-6 bg-card flex flex-col ${pkg.featured ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.5)]" : "border-border"}`}
              >
                <div className="min-h-6 mb-4">
                  {pkg.featured && <p className="text-[11px] font-black uppercase tracking-[0.12em] text-primary">Most popular</p>}
                </div>
                <div className="space-y-3 flex-1">
                  <p className="text-4xl font-black text-primary">{pkg.credits}</p>
                  <p className="text-muted-foreground text-sm">{pkg.title}</p>
                  <p className="text-5xl font-black text-foreground">{pkg.price}</p>
                  <p className="text-sm text-muted-foreground">{pkg.rate}</p>
                </div>
                <button className="w-full h-12 mt-6 rounded-xl bg-primary text-primary-foreground text-sm font-black uppercase tracking-[0.12em] hover:bg-primary/90 transition-colors">
                  {pkg.cta}
                </button>
              </article>
            ))}
          </div>
          <div className="max-w-2xl mx-auto rounded-2xl border border-primary/30 bg-primary/10 p-4 flex items-start gap-3">
            <Gift className="w-5 h-5 text-primary mt-0.5" />
            <p className="text-sm text-foreground"><span className="font-bold">New users get O100 free coins instantly</span> so they can explore premium prompts before first top up.</p>
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Coin lifecycle</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">From rupees to results, every step tracked</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {lifecycle.map((item) => (
              <article key={item.step} className="coin-anim-card rounded-2xl border border-border bg-card p-5 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 border border-primary/35 text-primary text-2xl font-black inline-flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-5 items-start">
          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Real value</p>
            <h2 className="text-5xl font-black tracking-tight mt-3 text-foreground">1 coin = Rs0.89 always</h2>
            <p className="text-muted-foreground mt-4 max-w-xl">The exchange rate is fixed and transparent, with no hidden conversion or seasonal repricing.</p>
          </article>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["O10", "Rs8.9", "Minimum prompt price"],
              ["O100", "Rs89", "Starter pack"],
              ["O500", "Rs399", "Save 10%"],
              ["O1200", "Rs849", "Save 20%"],
            ].map(([coins, amount, label]) => (
              <article key={coins} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-4xl font-black text-primary">{coins}</p>
                <p className="text-lg font-bold text-foreground mt-2">{amount}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Built on trust</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Your coins are protected</h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {trustCards.map((card) => (
              <article key={card.title} className="coin-anim-card rounded-2xl border border-border bg-card p-5">
                <div className="w-11 h-11 rounded-xl bg-primary/12 border border-primary/30 inline-flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mt-4">{card.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{card.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="text-center space-y-6 py-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 border border-primary/35 inline-flex items-center justify-center shadow-[0_0_40px_hsl(var(--primary)/0.25)]">
            <Coins className="w-9 h-9 text-primary" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">Start with O100. Earn the rest.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Join active creators and buyers using PromptStash credits to access and sell high-quality AI prompts.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/get-started" className="h-12 px-7 rounded-xl bg-primary text-primary-foreground text-sm font-black uppercase tracking-[0.12em] inline-flex items-center gap-2">
              Create account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/explore" className="h-12 px-7 rounded-xl border border-border bg-card text-foreground text-sm font-black uppercase tracking-[0.12em] inline-flex items-center hover:border-primary/60 transition-colors">
              Browse prompts
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}