"use client";

import { useState, useEffect } from "react";
import { WalletHero } from "./components/WalletHero";
import { CoinPackages } from "./components/CoinPackages";
import { EarningsChart } from "./components/EarningsChart";
import { TransactionHistory } from "./components/TransactionHistory";
import { WalletSidebar } from "./components/WalletSidebar";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { topUpCoins, topUpCoinsCustom } from "@/app/actions/purchase-actions";

type TransactionRow = {
  id: string;
  type: string;
  date: string;
  description: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
};

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [transactionRows, setTransactionRows] = useState<TransactionRow[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchWalletData = async () => {
      if (!user) {
        if (!cancelled) {
          setBalance(0);
          setTotalEarned(0);
          setTotalSpent(0);
          setTransactionRows([]);
          setBalanceError("Sign in to view your wallet balance.");
          setBalanceLoading(false);
          setTransactionsLoading(false);
        }
        return;
      }

      setBalanceLoading(true);
      setTransactionsLoading(true);

      const { data: profileRow, error: profileError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (profileError || !profileRow?.id) {
        if (!cancelled) {
          setBalance(0);
          setTotalEarned(0);
          setTotalSpent(0);
          setTransactionRows([]);
          setBalanceError(profileError?.message || "Unable to locate your profile.");
          setBalanceLoading(false);
          setTransactionsLoading(false);
        }
        return;
      }

      const publicUserId = profileRow.id;

      if (cancelled) return;

      const { data: transactionsData, error: transactionsError } = await supabase
        .from("coin_transactions")
        .select("*")
        .eq("user_id", publicUserId)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (transactionsError) {
        setTransactionRows([]);
        setBalanceError(transactionsError.message || "Unable to load your transactions.");
        setBalance(0);
        setTotalEarned(0);
        setTotalSpent(0);
      } else {
        const rows: TransactionRow[] = transactionsData.map((item) => ({
          id: String(item.id),
          type: item.transaction_type,
          date: item.created_at,
          description: item.description || "N/A",
          amount: item.amount,
          status: "Completed",
        }));
        setTransactionRows(rows);
        
        const spent = rows.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
        const earned = rows.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
        const currentBalance = rows.reduce((acc, t) => acc + t.amount, 0);
        setTotalSpent(spent);
        setTotalEarned(earned);
        setBalance(currentBalance);
        setBalanceError(null);
      }

      setBalanceLoading(false);
      setTransactionsLoading(false);
    };

    fetchWalletData();

    return () => {
      cancelled = true;
    };
  }, [user, refreshKey]);

  const handlePurchase = async (pkg: any) => {
    const packageId = typeof pkg === "string" ? pkg : pkg?.id || "selected";

    if (!user) {
      toast.error("Please sign in to top up coins.");
      return;
    }

    if (isTopUpLoading) return;

    setIsTopUpLoading(true);
    toast.loading("Processing top-up...", { id: "topup-toast" });

    try {
      const result = await topUpCoins(packageId);
      if (!result.success) {
        toast.error(result.message || "Top-up failed.", { id: "topup-toast" });
        return;
      }

      toast.success(result.message || "Top-up successful.", { id: "topup-toast" });
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error?.message || "Top-up failed.", { id: "topup-toast" });
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const handleCustomTopUp = async (coins: number) => {
    if (!user) {
      toast.error("Please sign in to top up coins.");
      return;
    }

    if (isTopUpLoading) return;

    setIsTopUpLoading(true);
    toast.loading("Processing custom top-up...", { id: "topup-toast" });

    try {
      const result = await topUpCoinsCustom(coins);
      if (!result.success) {
        toast.error(result.message || "Top-up failed.", { id: "topup-toast" });
        return;
      }

      toast.success(result.message || "Top-up successful.", { id: "topup-toast" });
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error?.message || "Top-up failed.", { id: "topup-toast" });
    } finally {
      setIsTopUpLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#03050a] flex flex-col relative">
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 relative selection:bg-primary/10">

        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#7C3AED04] to-transparent pointer-events-none" />
        
        <div className="p-6 md:p-10 lg:p-14 relative z-10 w-full overflow-x-hidden">
           {/* Page Title / Context Header */}
           <div className="mb-10 opacity-70">
              <p className="text-[13px] font-bold text-slate-400">Manage your coins, track earnings and transactions</p>
              <p className="text-[11px] font-bold text-slate-400 mt-2">
               {balanceLoading ? "Syncing wallet balance from database..." : balanceError || "Wallet balance synced from database."}
              </p>
           </div>

           {/* Dashboard Content */}
           <div className="space-y-16">
              {/* Hero Section */}
              <WalletHero
                balance={balance}
                totalEarned={totalEarned}
                totalSpent={totalSpent}
                inEscrow={0}
              />

              {/* Packages Section */}
              <div className="w-full">
                 <div className="flex items-center gap-4 mb-10">
                     <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#7C3AED] opacity-80">Top Up Packages</span>
                     <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1" />
                 </div>
                  <CoinPackages
                    onPurchaseAction={handlePurchase}
                    onCustomPurchaseAction={handleCustomTopUp}
                    isPurchasing={isTopUpLoading}
                  />
              </div>

              {/* Grid Statistics */}
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12 items-start pb-24">
                 <div className="space-y-16 min-w-0">
                    <EarningsChart />
                      <TransactionHistory rows={transactionRows} loading={transactionsLoading} />
                 </div>
                 <div className="space-y-8 h-full">
                    <WalletSidebar />
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
