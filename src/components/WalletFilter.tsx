"use client";

import { Wallet, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export const WalletFilter = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchBalance();
    
    // Listen for balance updates
    window.addEventListener('balanceUpdate', fetchBalance as any);
    return () => window.removeEventListener('balanceUpdate', fetchBalance as any);
  }, [user?.id]);

  const fetchBalance = async () => {
    if (!user) {
      setBalance(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("total_coins")
        .eq("auth_user_id", user.id)
        .single();

      if (error) {
        throw error;
      }

      setBalance(Number(data?.total_coins || 0));
    } catch (e) {
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2 group">
      <Link href="/wallet" className="flex items-center gap-2.5 px-3 py-1.5 bg-secondary/80 dark:bg-white/5 hover:bg-white/10 border border-border/50 rounded-2xl transition-all cursor-pointer backdrop-blur-sm">
        <div className="w-7 h-7 rounded-xl bg-primary/15 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
          <Wallet className="w-4 h-4" />
        </div>
        <div className="flex flex-col pr-1">
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 leading-none">Wallet</span>
          <span className="text-[13px] font-black text-foreground tabular-nums leading-none mt-1">
            {loading ? "..." : balance.toLocaleString()}
            <span className="text-[10px] text-primary/80 ml-1 font-bold">◈</span>
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/30 ml-0.5" />
      </Link>
      
      <Link href="/coins" className="h-9 w-9 rounded-xl bg-primary hidden lg:inline-flex items-center justify-center text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
        <Plus className="w-4.5 h-4.5" />
      </Link>
    </div>
  );
};
