"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const PUBLIC_ROUTES = ["/", "/home-v5", "/sign-in", "/get-started", "/explore"];

function isPublicRoute(pathname: string): boolean {
  if (pathname.startsWith("/get-started")) return true;
  if (pathname.startsWith("/prompt/")) return true;
  return PUBLIC_ROUTES.includes(pathname);
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  const publicRoute = isPublicRoute(pathname);

  useEffect(() => {
    if (!loading && !isAuthenticated && !publicRoute) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, publicRoute, pathname, router]);

  if (!publicRoute && (loading || !isAuthenticated)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
