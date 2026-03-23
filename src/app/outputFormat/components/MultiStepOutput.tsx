"use client";

import React, { useState, useEffect } from "react";
import { Lock, Check, ChevronDown, Play, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_STEPS = [
  { 
    id: 1, 
    title: "1. ICP Definition", 
    status: "completed",
    preview: '{\n  "target_market": "B2B SaaS",\n  "company_size": "50-500 employees",\n  "key_pain_point": "High customer acquisition cost"\n}'
  },
  { 
    id: 2, 
    title: "2. Positioning Statement", 
    status: "completed",
    preview: '"For B2B SaaS companies struggling with high CAC, our platform provides automated lead qualification that reduces acquisition cost by 40% unlike traditional manual SDR processes."'
  },
  { 
    id: 3, 
    title: "3. Channel Strategy", 
    status: "locked",
    preview: null
  },
  { 
    id: 4, 
    title: "4. Messaging Framework", 
    status: "locked",
    preview: null
  },
  { 
    id: 5, 
    title: "5. Launch Checklist", 
    status: "locked",
    preview: null
  },
];

export function MultiStepOutput() {
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [isRunning, setIsRunning] = useState(false);

  const startChain = () => {
    setIsRunning(true);
    setExpandedId(1);
    const reset = INITIAL_STEPS.map(s => ({ ...s, status: s.id === 1 ? "running" : "locked", preview: s.id === 1 ? null : s.preview }));
    setSteps(reset);

    let progress = 0;
    const interval = setInterval(() => {
      progress++;
      if (progress === 1) {
        setSteps(prev => prev.map(s => s.id === 1 ? { ...s, status: "completed", preview: INITIAL_STEPS[0].preview } : s.id === 2 ? { ...s, status: "running" } : s));
        setExpandedId(2);
      } else if (progress === 2) {
        setSteps(prev => prev.map(s => s.id === 2 ? { ...s, status: "completed", preview: INITIAL_STEPS[1].preview } : s.id === 3 ? { ...s, status: "running" } : s));
        setExpandedId(3);
      } else if (progress === 3) {
        setSteps(prev => prev.map(s => s.id === 3 ? { ...s, status: "completed", preview: '"Focus heavily on LinkedIn outbound and targeted newsletter sponsorships for Q3."\n- Target CPM: $25\n- Campaign duration: 6 weeks' } : s.id === 4 ? { ...s, status: "running" } : s));
        setExpandedId(4);
      } else if (progress > 3) {
        clearInterval(interval);
        setTimeout(() => setIsRunning(false), 1000);
      }
    }, 2000);
  };

  return (
    <div className="w-full flex justify-center h-[380px] lg:h-[400px]">
      <div className="w-full max-w-2xl flex flex-col font-sans text-sm md:text-base h-full bg-[#0B1221] border border-[#1e293b] rounded-2xl shadow-lg shadow-black/40 overflow-hidden">
        
        {/* Header with Run Button */}
        <div className="px-5 py-4 border-b border-[#1e293b] flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-3">
            <span className="text-xl">🗂️</span>
            <div>
              <div className="text-slate-200 font-semibold text-sm">GTM Strategy Pipeline</div>
              <div className="text-slate-500 text-xs mt-0.5">5 sequentially dependent prompts</div>
            </div>
          </div>
          <button 
            onClick={startChain}
            disabled={isRunning}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" fill="currentColor" />}
            {isRunning ? "Running..." : "Run Chain"}
          </button>
        </div>

        {/* Scrollable Steps Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 flex flex-col gap-3 min-h-0 scrollbar-thin scrollbar-thumb-slate-800">
          {steps.map((step, idx) => {
             const isExpanded = expandedId === step.id;
             const isLocked = step.status === "locked";
             
             return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex flex-col rounded-xl border transition-all duration-300 ${
                  isExpanded ? 'bg-[#151f38] border-primary/50 ring-1 ring-primary/20' : 
                  step.status === 'completed' ? 'bg-[#131C31] border-[#1e293b]' : 
                  step.status === 'running' ? 'bg-[#1e293b]/50 border-primary/30' :
                  'bg-[#0E1525] border-[#1e293b]/60'
                }`}
              >
                {/* Step Header (Clickable) */}
                <button 
                  onClick={() => !isLocked && setExpandedId(isExpanded ? null : step.id)}
                  disabled={isLocked}
                  className="flex items-center justify-between p-3 md:p-4 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                  aria-expanded={isExpanded}
                  aria-disabled={isLocked}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                      step.status === 'completed' ? 'bg-[#2ECC71]/20 text-[#2ECC71]' :
                      step.status === 'running' ? 'bg-primary text-primary-foreground rotate-infinite' :
                      'bg-[#1e293b]/80 text-[#64748B]'
                    }`}>
                      {step.status === 'completed' ? <Check className="w-3.5 h-3.5" /> : 
                       step.status === 'running' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 
                       step.id}
                    </div>
                    <span className={`font-semibold tracking-tight text-sm ${
                      isLocked ? 'text-[#475569]' : 'text-slate-200'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {step.status === 'running' && (
                       <span className="text-primary text-xs flex items-center gap-1.5 font-medium animate-pulse">
                         Processing
                       </span>
                    )}
                    {step.status === 'completed' && (
                       <span className="text-[#2ECC71] text-[11px] flex items-center gap-1 font-medium tracking-wide uppercase">
                         Finished
                       </span>
                    )}
                    {step.status === 'locked' && (
                       <span className="text-[#475569] text-[10px] flex items-center gap-1.5 font-medium uppercase tracking-wider">
                         <Lock className="w-3 h-3 text-[#FFC843]/70" /> locked
                       </span>
                    )}
                    {!isLocked && (
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </button>

                {/* Expanded Content (Accordion) */}
                <AnimatePresence>
                  {isExpanded && step.preview && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 border-t border-[#1e293b]/50 mt-1">
                        <div className="bg-[#0b1221] rounded-lg p-3 mt-3 border border-[#1e293b] shadow-inner">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Step Output Payload</span>
                            <ArrowRight className="w-3 h-3 text-slate-600" />
                          </div>
                          <pre className="text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                            {step.preview}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
             );
          })}
        </div>
      </div>
    </div>
  );
}
