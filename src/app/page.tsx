import Link from "next/link";

export default function Home() {
  const pages = [
    { href: "/card-variants", label: "Card Variants", desc: "24+ vertical card design explorations" },
    { href: "/upload", label: "Upload", desc: "Prompt listing & upload flow" },
    { href: "/home-v5", label: "Home V5", desc: "Homepage – portrait/video card layout" },
    { href: "/home-v4", label: "Home V4", desc: "Homepage – gradient platform tiles" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter">PromptVault</h1>
          <p className="text-muted-foreground text-sm font-medium">Select a page to preview</p>
        </div>
        <div className="grid gap-4">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="flex flex-col items-start gap-1 p-5 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all text-left group"
            >
              <span className="text-base font-black text-foreground group-hover:text-primary transition-colors">{page.label}</span>
              <span className="text-xs text-muted-foreground font-medium">{page.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
