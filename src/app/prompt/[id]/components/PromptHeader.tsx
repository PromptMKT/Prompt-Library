"use client";

interface PromptHeaderProps {
  platform: string;
  category: string;
  title: string;
  tagline: string;
}

export function PromptHeader({ title, tagline }: PromptHeaderProps) {
  return (
    <div className="space-y-4 mb-8 mt-2">
      <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-foreground">{title}</h1>
      <p className="text-xl text-card-foreground font-medium leading-relaxed max-w-3xl">{tagline}</p>
    </div>
  );
}
