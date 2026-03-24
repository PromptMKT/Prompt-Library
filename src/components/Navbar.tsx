"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  Moon,
  Sun,
  User,
  LayoutDashboard,
  Coins,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, signOut } = useAuth();
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

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/explore?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/home-v5");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-120 transition-all duration-300 border-b",
          scrolled ? "bg-background/90 backdrop-blur-md border-white/10" : "bg-background border-white/5"
        )}
      >
        <div className="px-5 h-16 flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">P</span>
              <span className="text-foreground">Vault.</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
              <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">P</span>
              <span className="hidden sm:inline-block text-foreground">Vault<span className="text-primary italic">.</span></span>
            </Link>
            <Link
              href="/"
              className={cn(
                "text-sm font-semibold transition-colors",
                pathname === "/" ? "text-primary" : "text-foreground/90 hover:text-primary"
              )}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={cn(
                "text-sm font-semibold transition-colors",
                pathname.startsWith("/explore") ? "text-primary" : "text-foreground/90 hover:text-primary"
              )}
            >
              Explore
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <div className="w-full max-w-xl relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="pl-12 h-10 bg-white/5 border-primary/30 rounded-full focus:ring-primary/20 focus:border-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <Link href="/upload" className="hidden md:inline-flex items-center text-sm font-semibold text-foreground/90 hover:text-primary transition-colors">
                Upload Prompt
              </Link>
            ) : null}

            {isAuthenticated ? (
              <Link href="/wallet" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 text-xs font-black text-foreground hover:border-primary/50 hover:text-primary transition-colors">
                <span>0 PV</span>
              </Link>
            ) : null}

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

            {!isAuthenticated ? (
              <Link href="/sign-in" className="hidden sm:block">
                <Button size="sm" className="rounded-xl px-5 h-10 bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wide">
                  Sign In
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    suppressHydrationWarning
                    aria-label="Open profile menu"
                    className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/40 bg-background hover:border-primary transition-colors"
                  >
                    <User className="h-5 w-5 text-primary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 border border-border/70 p-2 z-9999">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer font-bold text-primary">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/coins" className="cursor-pointer">
                      <Coins className="mr-2 h-4 w-4" />
                      Coin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile#settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute top-0 left-0 bottom-0 w-80 bg-background border-r border-white/5 p-8 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                <span className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">P</span>
                <span className="text-foreground">Vault<span className="text-primary">.</span></span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "Explore", href: "/explore" },
                ...(isAuthenticated
                  ? [
                      { label: "Profile", href: "/profile" },
                      { label: "Wallet", href: "/wallet" },
                      { label: "Upload Prompt", href: "/upload" },
                      { label: "Dashboard", href: "/dashboard" },
                      { label: "Coin", href: "/coins" },
                    ]
                  : [
                      { label: "Sign In", href: "/sign-in" },
                      { label: "Get Started", href: "/get-started" },
                    ]),
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

            <div className="mt-auto space-y-4">
              {isAuthenticated ? (
                <>
                  <Link href="/wallet" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-xl border-border/60 font-black uppercase tracking-wide">
                      0 PV Wallet
                    </Button>
                  </Link>
                  <Button
                    onClick={async () => {
                      await handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-wide hover:bg-primary/90"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-wide hover:bg-primary/90">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
