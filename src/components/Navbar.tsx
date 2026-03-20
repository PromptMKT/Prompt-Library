"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Wallet, Bell, Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        const { data, error } = await supabase
          .from('users')
          .select('coins')
          .eq('id', user.id)
          .single();
        
        if (data && typeof data.coins === "number") {
          setBalance(data.coins);
        }
      } else {
        setIsLoggedIn(false);
        setBalance(0);
      }
    } catch (e: any) {
      console.error("Fetch balance error:", e.message);
    }
  };

  useEffect(() => {
    fetchBalance();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchBalance();
    });

    window.addEventListener("balanceUpdate", fetchBalance);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("balanceUpdate", fetchBalance);
      subscription.unsubscribe();
    };
  }, []);

  if (pathname === "/auth" || pathname.startsWith("/home-")) return null;

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/explore?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled ? "bg-white/80 dark:bg-[#0B0B0F]/80 backdrop-blur-md border-b border-border" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">P</span>
              <span className="hidden sm:inline-block">Vault<span className="text-primary italic">.</span></span>
            </Link>


          </div>

          <div className="flex-1 max-w-md hidden md:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-10 h-10 bg-white dark:bg-[#181824] border-border rounded-xl focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-[#111827] dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link href="/wallet" className="hidden sm:flex items-center gap-2 hover:bg-muted p-1.5 px-3 rounded-lg border border-border/40 transition-all">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">{balance}</span>
            </Link>
            
            <div className="flex items-center gap-2">
              {mounted && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-muted-foreground hover:text-primary transition-colors h-10 w-10 rounded-lg hover:bg-muted"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              )}
              
              <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />

              {isLoggedIn ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.reload();
                  }}
                  className="rounded-lg px-5 h-10 border-border/40 hover:bg-muted transition-all font-bold text-xs uppercase tracking-widest"
                >
                  Logout
                </Button>
              ) : (
                <Link href="/auth">
                  <Button size="sm" className="rounded-lg px-5 h-10 bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all font-bold text-xs uppercase tracking-widest">
                    Sign In
                  </Button>
                </Link>
              )}
              
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute top-0 left-0 bottom-0 w-80 bg-background border-r border-border/40 p-8 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                <span className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">P</span>
                <span className="text-foreground">Vault<span className="text-primary italic">.</span></span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-foreground" />
              </Button>
            </div>
            
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "Explore", href: "/explore" },
                { label: "Add Prompt", href: "/sell" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Purchases", href: "/purchases" },
                { label: "Wallet", href: "/wallet" },
              ].map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={cn(
                    "px-4 py-3 rounded-xl hover:bg-secondary font-black uppercase tracking-widest text-[10px] transition-all",
                    pathname === item.href ? "text-primary bg-primary/5" : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-4">
               <Button className="w-full h-14 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:opacity-90 shadow-lg shadow-primary/20">Join Community</Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
