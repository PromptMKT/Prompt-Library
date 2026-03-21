"use client";

import { motion } from "framer-motion";
import { Copy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LogicEngineProps {
  isPurchased: boolean;
  promptText: string;
  price: number;
  handlePurchase: () => void;
}

export function LogicEngine({ isPurchased, promptText, price, handlePurchase }: LogicEngineProps) {
  const dummyLines = [
    "You are an elite B2B copywriter who has written cold emails",
    "for companies like HubSpot, Notion, and Stripe.",
    "",
    "Write a cold email to [TARGET_PERSONA] at [COMPANY_TYPE].",
    "Open with a specific observation about [PAIN_POINT] that shows",
    "you have done your research. Do not use generic openers like",
    "\"I hope this finds you well\" or \"My name is...\"",
    "",
    "Your value proposition should be a single concrete sentence...",
    "Reference [METRIC] as social proof. Keep total length under 90",
    "words. End with a low-friction CTA that asks for permission,",
    "not a meeting..."
  ];

  return (
    <div className="relative bg-card shadow-sm dark:shadow-none border border-border/40 rounded-xl overflow-hidden">
      
      {isPurchased && (
        <div className="absolute top-4 right-4 z-10">
          <Button variant="outline" size="sm" className="h-8 rounded-lg gap-2 font-medium border-border/40 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary text-xs" onClick={() => {
            navigator.clipboard.writeText(promptText);
            toast.success("Copied to clipboard!");
          }}>
            <Copy className="w-3.5 h-3.5" /> Copy
          </Button>
        </div>
      )}

      <div className="p-6 font-mono text-[13px] leading-[1.8] text-muted-foreground/80">
        {!isPurchased ? (
          <>
            {dummyLines.map((line, i) => (
              <span key={i} className={`block mb-1 ${i > 3 ? 'blur-[4px] select-none opacity-50' : 'text-foreground'}`}>
                {line || " "}
              </span>
            ))}
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-foreground whitespace-pre-wrap">
            {promptText}
          </motion.div>
        )}
      </div>

      {!isPurchased && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-24 pb-6 px-6 flex flex-col items-center gap-2">
          <div className="text-xl mb-1"><Lock className="w-5 h-5 text-muted-foreground" /></div>
          <div className="text-[13px] text-center text-muted-foreground leading-snug">
            Purchase to unlock the full prompt<br/>
            <span className="text-[11px] text-muted-foreground/50">489 buyers are already using this</span>
          </div>
          <Button className="mt-2 bg-primary text-primary-foreground font-bold text-[13px] px-6 py-5 rounded-xl transition-all hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={handlePurchase}>
            Unlock for ⬡ {price} coins
          </Button>
        </div>
      )}
    </div>
  );
}
