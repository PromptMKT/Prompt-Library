"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X, Moon, Sun, Bell, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { WalletFilter } from "./WalletFilter";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (pathname.startsWith("/home-") || pathname.startsWith("/coins")) return null;

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
          scrolled ? "bg-background/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        )}
      >
        <div className="px-5 h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            <Link href="/home-v5" className="text-xl font-bold tracking-tighter flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">P</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/home-v5" className="text-xl font-black tracking-tighter flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">P</span>
              <span className="hidden sm:inline-block text-foreground">Vault<span className="text-primary italic">.</span></span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search prompts, creators, collections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-12 h-12 bg-white/5 border-white/5 rounded-2xl focus:ring-primary/20 focus:border-primary/30 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/explore" className="items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl border border-white/10 transition-colors text-xs font-bold uppercase tracking-wider hidden sm:flex">
                Explore
              </Link>
              <Link href="/profile" className="items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl border border-white/10 transition-colors text-xs font-bold uppercase tracking-wider hidden sm:flex">
                Profile
              </Link>
              <Link href="/upload" className="items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl border border-white/10 transition-colors text-xs font-bold uppercase tracking-wider hidden sm:flex">
                Prompt Upload
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <WalletFilter />
              </div>
              
              <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-primary rounded-2xl">
                <Bell className="w-5 h-5" />
              </Button>

              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-muted-foreground hover:text-primary transition-colors h-10 w-10 rounded-2xl hover:bg-white/10"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              )}

              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-3 group">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Priya Nair</span>
                    <span className="text-[10px] text-muted-foreground">Certified Creator</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-sm font-bold text-white border-2 border-white/10 shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
                    PN
                  </div>
                </Link>
              </div>

              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute top-0 left-0 bottom-0 w-80 bg-background border-r border-white/5 p-8 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center">
              <Link href="/home-v5" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                <span className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">P</span>
                <span className="text-foreground">Vault<span className="text-primary">.</span></span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/home-v5" },
                { label: "Explore", href: "/explore" },
                { label: "Profile", href: "/profile" },
                { label: "Wallet", href: "/wallet" },
                { label: "Upload", href: "/upload" },
                { label: "Sign In", href: "/sign-in" },
                { label: "Get Started", href: "/get-started" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-3 rounded-xl hover:bg-white/5 font-medium transition-all",
                    pathname === item.href ? "text-primary bg-primary/5" : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary/20">
                PN
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-foreground">Priya Nair</span>
                <span className="text-xs text-muted-foreground">@priyanair</span>
              </div>
              <Link href="/profile" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
