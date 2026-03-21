"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Rocket, Shield, Globe } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder submit action for frontend flow.
    console.log("Sign in", { email, password });
  };

  return (
    <main className="min-h-dvh bg-[#0a0a0f] text-white selection:bg-purple-500/30 selection:text-white">
      <div className="grid min-h-dvh lg:grid-cols-[40%_60%]">
        <aside className="relative hidden lg:flex flex-col justify-between p-12 border-r border-white/5 bg-[#0f0f1a]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

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
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
          <div className="w-full max-w-[560px] space-y-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tight text-white">Sign In</h1>
              <p className="text-slate-400">Welcome back to PromptVault.</p>
            </div>

            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-white/8 bg-[#060913] p-6 sm:p-8 space-y-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
            >
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-sm text-white outline-none focus:border-purple-500/50"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-sm text-white outline-none focus:border-purple-500/50"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-purple-600 text-white text-xs font-black uppercase tracking-[0.16em] hover:bg-purple-500 transition-all"
              >
                Sign In
              </button>

              <p className="text-xs text-slate-500 text-center">
                New here?{" "}
                <Link href="/get-started" className="text-purple-400 font-bold hover:underline">
                  Get Started
                </Link>
              </p>
            </form>
          </div>
        </section>
        </div>
    </main>
  );
}
