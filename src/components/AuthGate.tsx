"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const PROTECTED_PREFIXES = ["/profile"];

function requiresAuth(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  const protectedRoute = requiresAuth(pathname);

  useEffect(() => {
    if (!loading && !isAuthenticated && protectedRoute) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, protectedRoute, pathname, router]);

  if (protectedRoute && (loading || !isAuthenticated)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
