"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight, Shield, Sparkles, Code2, Palette, Megaphone, Briefcase, Users, Globe, Rocket, ChevronLeft, Eye, EyeOff } from "lucide-react";

export default function GetStartedPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [role, setRole] = useState("buyer");
  const [interests, setInterests] = useState<string[]>([]);

  const pathOptions = [
    { id: "creator", label: "Content Creator", sub: "Influencers, writers, creators", icon: Sparkles },
    { id: "designer", label: "Designer", sub: "UI/UX, 3D, brand artists", icon: Palette },
    { id: "developer", label: "Developer", sub: "Software, web, AI engineers", icon: Code2 },
    { id: "marketer", label: "Marketer", sub: "SEO, ads, content strategy", icon: Megaphone },
    { id: "business-owner", label: "Business Owner", sub: "Founders, CEOs, managers", icon: Briefcase },
    { id: "other", label: "Other", sub: "Everything else", icon: Users },
  ];

  const interestGroups: { label: string; items: string[] }[] = [
    { label: "Generative AI", items: ["ChatGPT", "Claude", "Gemini", "Grok", "Midjourney", "Stable Diffusion"] },
    { label: "Media & Arts", items: ["AI Music", "Video Synthesis", "3D Generation", "Photography", "Illustration"] },
    { label: "Productivity", items: ["Automation", "Coding", "Marketing", "Research", "Copywriting"] },
  ];

  const toggleInterest = (item: string) => {
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder submit action for frontend flow.
    console.log("Get started", { email, password, confirmPassword, role, interests });
  };

  const username = email.includes("@") ? email.split("@")[0] : "newuser";
  const displayName = username.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const canNext =
    (step === 1 && email && password && confirmPassword && acceptedTerms) ||
    (step === 2 && role) ||
    (step === 3 && interests.length > 0);

  return (
    <main className="min-h-dvh bg-[#0a0a0f] text-white selection:bg-purple-500/30 selection:text-white">
      <div className="grid min-h-dvh lg:grid-cols-[40%_60%]">
        <aside className="relative hidden lg:flex flex-col justify-between p-12 border-r border-white/5 bg-[#0f0f1a]">
          <div className="absolute top-0 right-0 w-125 h-125 bg-purple-600/10 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-indigo-600/10 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <Link href="/home-v5" className="inline-flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-900/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-2xl font-black tracking-tight text-white">PROMPT<span className="text-purple-500 italic">VAULT</span></span>
            </Link>

            <div className="space-y-5">
              <h2 className="text-6xl font-black tracking-tight leading-[0.95] text-white">Your gateway to <span className="text-purple-500">Elite AI</span> Engineering.</h2>
              <p className="text-lg text-slate-400 max-w-md">Join thousands of creators shaping the future of generative media.</p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { title: "Top Rated Prompts", sub: "Access the highest quality prompts in the world.", icon: Rocket },
                { title: "Secure Transactions", sub: "All purchases are protected and verified.", icon: Shield },
                { title: "Expert Community", sub: "Learn from the best prompt engineers globally.", icon: Globe },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/3 p-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs tracking-[0.18em] uppercase text-slate-500 font-black">Empowering the next 1B creators</div>
        </aside>

        <section className="relative p-6 sm:p-10 lg:p-14 flex items-center justify-center bg-[#07070b] min-h-dvh">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />
          <div className="w-full max-w-160 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((i) => (
                  <span key={i} className={cn("h-1 w-8 rounded-full", i <= step ? "bg-purple-600" : "bg-white/15")} />
                ))}
              </div>
              <p className="text-xs font-black tracking-[0.2em] uppercase text-slate-500">Phase {String(step).padStart(2, "0")} / 03</p>
            </div>

            <form onSubmit={onSubmit} className="rounded-3xl border border-white/8 bg-[#060913] p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-6xl font-black tracking-tight leading-[0.95] text-white">
                      Create your <span className="text-purple-400 italic">account</span>
                    </h1>
                    <p className="text-slate-400 mt-3">Join 48,000+ creators. Sign up with Google for the fastest experience, or use your email.</p>
                  </div>

                  <button
                    type="button"
                    className="w-full h-14 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/15 transition-colors flex items-center justify-between px-4"
                  >
                    <span className="w-8 h-8 rounded-md bg-white inline-flex items-center justify-center">
                      <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" alt="Google" className="w-5 h-5" />
                    </span>
                    <span className="text-lg font-bold text-white">Continue with Google</span>
                    <span className="text-xs font-bold text-purple-200 bg-purple-500/20 px-2 py-1 rounded-full">Recommended</span>
                  </button>

                  <div className="flex items-center gap-3 text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">
                    <span className="h-px bg-white/10 flex-1" />
                    or continue with email
                    <span className="h-px bg-white/10 flex-1" />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="email" className="text-xs font-black tracking-[0.16em] uppercase text-slate-500">Email Address</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-sm text-white outline-none focus:border-purple-500/50" placeholder="you@example.com" required />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="password" className="text-xs font-black tracking-[0.16em] uppercase text-slate-500">Create Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 pl-4 pr-11 text-sm text-white outline-none focus:border-purple-500/50"
                        placeholder="********"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">Use a mix of letters, numbers and symbols</p>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="confirmPassword" className="text-xs font-black tracking-[0.16em] uppercase text-slate-500">Confirm Password</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 pl-4 pr-11 text-sm text-white outline-none focus:border-purple-500/50"
                        placeholder="********"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <label className="inline-flex items-center gap-2.5 text-sm text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 accent-purple-500"
                    />
                    I agree to the <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-5xl font-black tracking-tight text-white">Pick your path.</h2>
                    <p className="text-slate-400 mt-2">How will you use PromptVault?</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {pathOptions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRole(item.id)}
                        className={cn(
                          "text-left rounded-2xl border px-4 py-4 transition-all",
                          role === item.id ? "border-purple-500/60 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-purple-500/40"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                            <item.icon className="w-5 h-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-black uppercase tracking-wide text-white">{item.label}</span>
                            <span className="block text-xs text-slate-400 mt-1">{item.sub}</span>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-5xl font-black tracking-tight text-white">Your interests.</h2>
                    <p className="text-slate-400 mt-2">Curating your custom marketplace feed.</p>
                  </div>

                  <div className="space-y-4">
                    {interestGroups.map((group) => (
                      <div key={group.label} className="space-y-2.5">
                        <p className="text-xs font-black tracking-[0.16em] uppercase text-slate-500">{group.label}</p>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleInterest(item)}
                              className={cn(
                                "px-3.5 h-9 rounded-xl text-sm font-bold border transition-all",
                                interests.includes(item)
                                  ? "bg-purple-500/15 border-purple-500/60 text-purple-300"
                                  : "bg-white/5 border-white/10 text-slate-300 hover:border-purple-500/40"
                              )}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className="h-12 px-4 rounded-2xl border border-white/10 bg-white/5 text-slate-300 text-xs font-black uppercase tracking-[0.16em] inline-flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => canNext && setStep((s) => Math.min(3, s + 1))}
                    disabled={!canNext}
                    className="h-12 px-6 rounded-2xl bg-purple-600 text-white text-xs font-black uppercase tracking-[0.16em] disabled:opacity-40 inline-flex items-center gap-2 hover:bg-purple-500"
                  >
                    Initiate Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push("/get-started/bonus")}
                    disabled={!canNext}
                    className="h-12 px-6 rounded-2xl bg-purple-600 text-white text-xs font-black uppercase tracking-[0.16em] disabled:opacity-40 inline-flex items-center gap-2 hover:bg-purple-500"
                  >
                    Claim Bonus & Launch <Rocket className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            <p className="text-xs text-slate-500">
              Already have an account? <Link href="/sign-in" className="text-purple-400 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
