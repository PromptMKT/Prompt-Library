"use client";

import { Gem, Star } from "lucide-react";

type Creator = {
  name: string;
  prompts: number;
  sales: number;
  score: number;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TopCreatorsRow({ creators }: { creators: Creator[] }) {
  if (creators.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <Star className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-black uppercase tracking-[0.16em] text-foreground/80">Top Creators This Week</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        {creators.map((creator) => (
          <div
            key={creator.name}
            className="group rounded-[1.3rem] border border-border/60 bg-card/85 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_36px_rgba(58,47,132,0.18)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_18px_36px_rgba(79,70,229,0.35)]"
          >
            <div className="w-10 h-10 rounded-full bg-primary/15 text-primary font-black flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
              {getInitials(creator.name)}
            </div>
            <p className="font-black text-foreground text-lg leading-none mb-1 truncate group-hover:text-primary transition-colors">{creator.name}</p>
            <p className="text-xs text-muted-foreground">{creator.prompts} prompts</p>
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-bold text-primary">
                <Gem className="w-3.5 h-3.5" /> {Math.round(creator.score).toLocaleString()}
              </span>
              <span>{creator.sales} sales</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
