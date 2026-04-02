"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, ChevronRight, ListTree } from "lucide-react";

type Step = {
  id: string;
  step_number: number;
  title: string;
  instruction: string;
  step_type?: string;
};

type PromptItem = {
  title: string;
  promptText: string;
  steps?: Step[];
  platform?: string;
};

function generateStepsFromText(text: string): Step[] {
  const lines = (text || "")
    .split("\n")
    .filter((l) => l.trim().length > 10)
    .slice(0, 6);

  return lines.map((line, i) => ({
    id: String(i),
    step_number: i + 1,
    title: `Step ${i + 1}`,
    instruction: line.trim().slice(0, 120),
    step_type: ["instruction", "prompt", "analysis", "output"][i % 4],
  }));
}

export function MultiStepOutput({ prompt, isPurchased }: { prompt: PromptItem; isPurchased: boolean }) {
  const steps: Step[] =
    prompt.steps?.length ? prompt.steps : generateStepsFromText(prompt.promptText);

  const [activeStep, setActiveStep] = useState(0);
  const visible = isPurchased ? steps : steps.slice(0, 2);

  return (
    <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/40">
        <ListTree className="w-4 h-4 text-purple-500" />
        <span className="text-[11px] font-mono text-muted-foreground">multi_step_chain.md</span>
        <div className="ml-auto text-[10px] text-muted-foreground font-mono">
          {activeStep + 1} / {visible.length} steps
        </div>
      </div>

      {/* Pipeline progress dots */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/30 overflow-x-auto">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => isPurchased && setActiveStep(i)}
              className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-black transition-all ${
                i < visible.length
                  ? i <= activeStep
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                    : "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                  : "bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
              }`}
            >
              {i < activeStep ? <CheckCircle className="w-3.5 h-3.5" /> : step.step_number}
            </button>
            {i < steps.length - 1 && (
              <ChevronRight className={`w-3 h-3 ${i < visible.length ? "text-primary/40" : "text-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Steps list */}
      <div className="p-4 space-y-3 min-h-[220px] relative">
        {visible.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setActiveStep(i)}
            className={`flex gap-4 items-start p-4 rounded-xl border cursor-pointer transition-all ${
              i === activeStep
                ? "border-primary/40 bg-primary/5"
                : "border-border/30 hover:border-primary/20 hover:bg-muted/20"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                i < activeStep
                  ? "bg-emerald-500/15 text-emerald-500"
                  : i === activeStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < activeStep ? <CheckCircle className="w-4 h-4" /> : step.step_number}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-foreground">{step.title}</span>
                {step.step_type && (
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {step.step_type}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {step.instruction}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Blur overlay */}
        {!isPurchased && (
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/80 to-transparent flex flex-col items-center justify-end pb-6 gap-1">
            <p className="text-xs text-muted-foreground font-semibold">Unlock to see all {steps.length} steps</p>
          </div>
        )}
      </div>

      {isPurchased && (
        <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20 text-[10px] text-muted-foreground font-mono flex justify-between">
          <span>{steps.length} total steps</span>
          <span>{activeStep} / {steps.length - 1} completed</span>
        </div>
      )}
    </div>
  );
}
