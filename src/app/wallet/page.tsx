"use client";

import { useState, useEffect } from "react";
import { WalletHero } from "./components/WalletHero";
import { CoinPackages } from "./components/CoinPackages";
import { EarningsChart } from "./components/EarningsChart";
import { TransactionHistory } from "./components/TransactionHistory";
import { WalletSidebar } from "./components/WalletSidebar";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

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

      const overviewResponse = await fetch("/api/coins/overview?limit=200", { method: "GET" });

      if (!overviewResponse.ok) {
        let errorMessage = "Unable to load wallet data.";
        try {
          const overviewJson = await overviewResponse.json();
          errorMessage = overviewJson?.message || errorMessage;
        } catch {
          // No-op: use fallback message.
        }

        if (!cancelled) {
          setBalance(0);
          setTotalEarned(0);
          setTotalSpent(0);
          setTransactionRows([]);
          setBalanceError(errorMessage);
          setBalanceLoading(false);
          setTransactionsLoading(false);
        }
        return;
      }

      const overviewJson = await overviewResponse.json();

      if (cancelled) return;

      if (!overviewJson?.success) {
        setTransactionRows([]);
        setBalanceError(overviewJson?.message || "Unable to load your transactions.");
        setBalance(0);
        setTotalEarned(0);
        setTotalSpent(0);
      } else {
        const rows: TransactionRow[] = (overviewJson?.data?.transactions || []).map((item: any) => ({
          id: String(item.id),
          type: item.transactionType,
          date: item.createdAt,
          description: item.description || "N/A",
          amount: item.amount,
          status: "Completed",
        }));
        setTransactionRows(rows);

        setTotalSpent(Number(overviewJson?.data?.summary?.totalSpent || 0));
        setTotalEarned(Number(overviewJson?.data?.summary?.totalEarned || 0));
        setBalance(Number(overviewJson?.data?.summary?.balance || 0));
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
      const response = await fetch("/api/coins/top-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const result = await response.json();
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
      const response = await fetch("/api/coins/top-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coins }),
      });
      const result = await response.json();
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
