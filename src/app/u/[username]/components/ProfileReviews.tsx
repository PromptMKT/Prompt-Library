"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProfileReviews() {
  const [activeChip, setActiveChip] = useState("All reviews");

  const chips = [
    "All reviews",
    "5 ★",
    "4 ★",
    "Code & Tech",
    "Agentic"
  ];

  const reviews = [
    {
      id: 1,
      name: "Aditya K.",
      ava: "AK",
      bg: "linear-gradient(135deg, #7C3AED, #A78BFA)",
      verified: true,
      date: "Mar 2026",
      stars: "★★★★★",
      text: "\"React Component Architect is the best coding prompt I've bought. Generated a fully typed, Tailwind-styled modal with accessibility props and Vitest tests. Saved 3 hours on a client project. Output is senior-engineer quality.\"",
      prompt: "React Component Architect",
      category: "Code & Tech",
      up: 12,
      down: 0
    },
    {
      id: 2,
      name: "Sneha R.",
      ava: "SR",
      bg: "linear-gradient(135deg, #10b981, #0ea5e9)",
      verified: true,
      date: "Mar 2026",
      stars: "★★★★★",
      text: "\"Support Ticket Router has been live for 6 weeks — classifying 200+ tickets/day at 94% accuracy. Rohan answered a Zendesk integration question within 3 hours. Exceptional seller follow-through.\"",
      prompt: "Support Ticket Router Agent",
      category: "Agentic",
      up: 28,
      down: 1
    },
    {
      id: 3,
      name: "Karthik V.",
      ava: "KV",
      bg: "linear-gradient(135deg, #f59e0b, #ef4444)",
      verified: true,
      date: "Feb 2026",
      stars: "★★★★☆",
      text: "\"Great prompt for setting up Notion workspaces but some variables need adjustment for team plans. Still very useful and easy to implement.\"",
      prompt: "Notion SOP Generator",
      category: "Productivity",
      up: 5,
      down: 0
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* SUMMARY */}
      <div className="grid grid-cols-[130px_1fr] gap-[22px] p-[18px_20px] bg-[#12121A] border border-[rgba(255,255,255,0.06)] rounded-[14px] mb-[18px] items-center max-md:grid-cols-1 max-md:justify-center">
        <div className="text-center">
          <div className="text-[48px] font-extrabold font-mono text-[#e8a838] leading-none">4.9</div>
          <div className="text-[18px] text-[#e8a838] my-1">★★★★★</div>
          <div className="text-[11px] text-[#9B8EC4]">512 verified reviews</div>
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { star: "5", width: "87%", n: "446" },
            { star: "4", width: "10%", n: "51" },
            { star: "3", width: "2%", n: "10" },
            { star: "2", width: "1%", n: "5" },
            { star: "1", width: "0%", n: "0" }
          ].map((bar) => (
            <div key={bar.star} className="flex items-center gap-2">
              <span className="text-[10px] text-[#9B8EC4] font-mono w-[8px] text-right">{bar.star}</span>
              <div className="flex-1 h-[5px] rounded-[3px] bg-[rgba(255,255,255,0.04)] overflow-hidden">
                <div className="h-full rounded-[3px] bg-[#e8a838]" style={{ width: bar.width }} />
              </div>
              <span className="text-[10px] text-[#5F587A] font-mono w-[24px]">{bar.n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 mb-[16px] overflow-x-auto pb-1 no-scrollbar">
        {chips.map((chip) => (
          <div 
            key={chip}
            onClick={() => setActiveChip(chip)}
            className={cn(
              "text-[12px] font-semibold px-[13px] py-[6px] rounded-[20px] cursor-pointer whitespace-nowrap transition-all duration-150 border",
              activeChip === chip 
                ? "bg-[rgba(124,58,237,0.15)] border-[rgba(124,58,237,0.3)] text-[#A78BFA]"
                : "bg-[#0B0B0F] border-[rgba(255,255,255,0.04)] text-[#9B8EC4] hover:border-[rgba(255,255,255,0.1)] hover:text-[#F0EEFF]"
            )}
          >
            {chip}
          </div>
        ))}
        <select className="ml-auto bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] text-[#9B8EC4] text-[12px] font-semibold py-[6px] px-[12px] rounded-[10px] outline-none cursor-pointer">
          <option>Most recent</option>
          <option>Highest rated</option>
          <option>Most helpful</option>
        </select>
      </div>

      {/* REVIEWS LIST */}
      <div className="flex flex-col gap-2.5">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-[#0B0B0F] border border-[rgba(255,255,255,0.04)] rounded-[12px] p-4 transition-colors duration-150 hover:border-[rgba(255,255,255,0.06)] group">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-[36px] h-[36px] rounded-full flex flex-shrink-0 items-center justify-center text-[12px] font-bold text-white" style={{ background: rev.bg }}>
                {rev.ava}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-[#F0EEFF]">{rev.name}</div>
                <div className="flex items-center gap-2 mt-[2px]">
                  {rev.verified && (
                    <span className="text-[9px] font-bold tracking-[0.5px] px-[6px] py-[2px] rounded-full bg-[rgba(34,211,238,0.1)] text-[#22d3ee]">
                      ✓ Verified buyer
                    </span>
                  )}
                  <span className="text-[10px] text-[#5F587A]">{rev.date}</span>
                </div>
              </div>
              <div className="text-[14px] text-[#e8a838] shrink-0 tracking-widest">{rev.stars}</div>
            </div>
            
            <div className="text-[12px] text-[#9B8EC4] leading-[1.65] mb-3 italic">
              {rev.text}
            </div>
            
            <div className="text-[10px] text-[#5F587A] mb-3">
              On <span className="font-semibold text-[#F0EEFF]">{rev.prompt}</span> · {rev.category}
            </div>
            
            <div className="flex items-center gap-[7px]">
              <span className="text-[10px] text-[#5F587A] font-medium mr-[3px]">Helpful?</span>
              <button className="text-[10px] font-bold text-[#9B8EC4] px-2.5 py-[5px] rounded-[14px] border border-[rgba(255,255,255,0.04)] bg-[#12121A] cursor-pointer transition-colors hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.02)]">
                👍 {rev.up}
              </button>
              <button className="text-[10px] font-bold text-[#9B8EC4] px-2.5 py-[5px] rounded-[14px] border border-[rgba(255,255,255,0.04)] bg-[#12121A] cursor-pointer transition-colors hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.02)]">
                👎 {rev.down}
              </button>
            </div>
          </div>
        ))}
        <button className="w-full mt-[10px] text-center p-[11px] rounded-[10px] border border-[rgba(255,255,255,0.04)] bg-[#12121A] text-[13px] font-bold text-[#A78BFA] transition-all hover:bg-[rgba(124,58,237,0.1)] hover:border-[rgba(124,58,237,0.2)]">
          Show older reviews
        </button>
      </div>

    </div>
  );
}
