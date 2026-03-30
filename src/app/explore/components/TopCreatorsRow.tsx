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
    <section className="space-y-2">
      <div className="flex items-center gap-2 border-b border-border/35 pb-1.5">
        <Star className="w-3.5 h-3.5 text-primary" />
        <h3 className="text-xs font-black uppercase tracking-[0.14em] text-foreground/80">Top Creators This Week</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-2">
        {creators.map((creator) => (
          <div
            key={creator.name}
            className="group min-w-0 rounded-xl border border-border/55 bg-card/85 px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_22px_rgba(58,47,132,0.14)]"
          >
            <div className="w-7 h-7 rounded-full bg-primary/15 overflow-hidden flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`} 
                alt={creator.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <p className="font-black text-foreground text-sm leading-none mb-0.5 truncate group-hover:text-primary transition-colors">{creator.name}</p>
            <p className="text-[11px] text-muted-foreground">{creator.prompts} prompts</p>
            <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-bold text-primary">
                <Gem className="w-3 h-3" /> {Math.round(creator.score).toLocaleString()}
              </span>
              <span>{creator.sales} sales</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
