"use client";

import { useEffect, useRef } from "react";

export function ViewTracker({ promptId }: { promptId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      fetch("/api/analytics/view", {
        method: "POST",
        body: JSON.stringify({ promptId }),
        headers: { "Content-Type": "application/json" }
      }).catch(err => console.error("Failed to track view:", err));
    }
  }, [promptId]);

  return null;
}
