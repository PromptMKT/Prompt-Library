"use client";

export function ProfileAbout({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#9B8EC4] mb-2.5">About this creator</div>
        <div className="text-[13px] text-[#9B8EC4] leading-[1.7]">
          {user?.bio || "Full-stack developer turned prompt engineer. Every prompt I sell was extracted from a real production project — tested across 5+ runs, documented with usage notes, and refined on buyer questions. I answer within 4 hours."}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#9B8EC4] mb-2.5">Creator stats</div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Member since", value: user?.memberSince || "Oct 2025" },
            { label: "Response rate", value: "98% · avg 4h", color: "text-[#22d3ee]" },
            { label: "Prompts published", value: "63" },
            { label: "Repeat buyer rate", value: "61%", color: "text-[#A78BFA]" },
            { label: "Total sales", value: "4,218" },
            { label: "Average rating", value: "4.9 / 5", color: "text-[#e8a838]" },
          ].map((stat, i) => (
            <div key={i} className="p-3 bg-[#1E1E2E] border border-[rgba(124,58,237,0.13)] rounded-[10px]">
              <div className="text-[10px] text-[#9B8EC4] mb-[3px]">{stat.label}</div>
              <div className={`text-[13px] font-bold font-mono ${stat.color || "text-[#F0EEFF]"}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#9B8EC4] mb-2.5">Technical specialisations</div>
        <div className="flex flex-wrap gap-1.5">
          {["React / TypeScript", "Python async", "AI agents", "LangChain", "RAG systems", "SQL optimisation", "DevOps / CI-CD", "System design", "Claude API", "GitHub Actions"].map((skill, i) => (
            <span key={i} className="text-[11px] py-1 px-3 rounded-[20px] bg-[rgba(124,58,237,0.1)] border border-[rgba(139,92,246,0.22)] text-[#A78BFA]">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#9B8EC4] mb-2.5">AI platforms covered</div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] py-1 px-3 rounded-[20px] bg-[rgba(124,58,237,0.05)] border border-[rgba(139,92,246,0.35)] text-[#A78BFA]">Claude</span>
          <span className="text-[11px] py-1 px-3 rounded-[20px] bg-[rgba(16,163,127,0.05)] border border-[rgba(16,163,127,0.3)] text-[#10a37f]">ChatGPT / GPT-4</span>
          <span className="text-[11px] py-1 px-3 rounded-[20px] bg-[rgba(56,189,248,0.05)] border border-[rgba(56,189,248,0.3)] text-[#38bdf8]">Cursor / Copilot</span>
          <span className="text-[11px] py-1 px-3 rounded-[20px] bg-[rgba(66,133,244,0.05)] border border-[rgba(66,133,244,0.3)] text-[#4285f4]">Gemini</span>
          <span className="text-[11px] py-1 px-3 rounded-[20px] bg-[rgba(34,211,238,0.05)] border border-[rgba(34,211,238,0.3)] text-[#22d3ee]">GitHub Actions</span>
        </div>
      </div>
    </div>
  );
}