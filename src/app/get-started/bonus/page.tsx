"use client";

import Link from "next/link";
import { Coins, Sparkles, Rocket, LayoutDashboard, Store } from "lucide-react";

export default function GetStartedBonusPage() {
  return (
    <main className="min-h-dvh bg-[#080b17] text-white flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-size-[30px_30px] pointer-events-none" />
      <section className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d1325]/95 p-7 sm:p-10 text-center space-y-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-b from-amber-200 to-amber-500 border border-amber-200/40 shadow-[0_0_60px_rgba(250,204,21,0.35)] flex items-center justify-center">
          <Coins className="w-9 h-9 text-amber-900" />
        </div>

        <div>
          <p className="text-5xl font-black tracking-tight text-amber-400">100</p>
          <p className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 mt-1">Credited to your wallet</p>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-white">Welcome to <span className="text-primary">PromptVault</span>.</h1>
          <p className="text-slate-400 text-base">Your account is live. Start exploring the marketplace or publish your first prompt and start earning.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-left">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 inline-flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" /> Browse 2,400+ prompts
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Sell your first prompt
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 inline-flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-300" /> 100 in wallet now
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 inline-flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" /> Personalized feed ready
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/explore"
            className="h-12 rounded-2xl bg-amber-400 text-amber-950 text-sm font-black uppercase tracking-[0.16em] inline-flex items-center justify-center w-full hover:bg-amber-300 transition-colors"
          >
            Explore Prompts
          </Link>
          <Link
            href="/dashboard"
            className="h-12 rounded-2xl border border-primary/30 text-primary text-sm font-black uppercase tracking-[0.16em] inline-flex items-center justify-center w-full bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Go To Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
