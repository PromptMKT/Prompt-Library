"use client";

import { useState, useEffect } from "react";
import { WalletHero } from "./components/WalletHero";
import { CoinPackages } from "./components/CoinPackages";
import { EarningsChart } from "./components/EarningsChart";
import { TransactionHistory } from "./components/TransactionHistory";
import { WalletSidebar } from "./components/WalletSidebar";
import { UserSidebar } from "./components/UserSidebar";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

export default function WalletPage() {
  const { profile } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const profileCoins = (profile as any)?.coins;
    
    if (profileCoins !== undefined) {
      setBalance(profileCoins);
    } else {
      setBalance(1000); // Fallback dummy data if no profile or coins
    }
  }, [profile]);

  const handlePurchase = async (pkg: any) => {
    toast.loading(`Initializing purchase for ${pkg.coins} coins...`);
    setTimeout(() => {
      setBalance(prev => prev + (typeof pkg === 'string' ? 500 : pkg.coins));
      toast.dismiss();
      toast.success("Transaction Successful");
    }, 1500);
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
           </div>

           {/* Dashboard Content */}
           <div className="space-y-16">
              {/* Hero Section */}
              <WalletHero balance={balance} />

              {/* Packages Section */}
              <div className="w-full">
                 <div className="flex items-center gap-4 mb-10">
                     <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#7C3AED] opacity-80">Top Up Packages</span>
                     <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1" />
                 </div>
                 <CoinPackages onPurchaseAction={handlePurchase} />
              </div>

              {/* Grid Statistics */}
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12 items-start pb-24">
                 <div className="space-y-16 min-w-0">
                    <EarningsChart />
                    <TransactionHistory />
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
