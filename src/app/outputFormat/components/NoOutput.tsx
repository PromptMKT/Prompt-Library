"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Server, Globe, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NoOutput() {
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  const startAction = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }, 2500);
  };

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <div className="w-full max-w-sm rounded-3xl bg-card border border-border/40 p-8 shadow-2xl relative overflow-hidden group">
        
        {/* Animated Background */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${status === "processing" ? "opacity-100" : "opacity-0"}`}>
           <div className="absolute inset-0 bg-[linear-gradient(45deg,var(--primary)_0%,transparent_100%)] opacity-10 animate-[spin_4s_linear_infinite]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              {status === "idle" && (
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground border border-border/60 group-hover:bg-primary/5 group-hover:text-primary transition-colors cursor-pointer" onClick={startAction}>
                   <Server className="w-10 h-10" />
                </div>
              )}
              {status === "processing" && (
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/30">
                   <Loader2 className="w-10 h-10 animate-spin" />
                </div>
              )}
              {status === "success" && (
                <div className="w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/30">
                   <CheckCircle2 className="w-10 h-10" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div>
             <h4 className="text-xl font-bold mb-2">
               {status === "idle" ? "Backend Action" : status === "processing" ? "Executing..." : "Action Completed"}
             </h4>
             <p className="text-sm text-muted-foreground whitespace-pre-wrap h-10">
               {status === "idle" ? "This prompt modifies a database without returning visible output." : 
                status === "processing" ? "Running migrations and syncing data..." : 
                "Database updated successfully."}
             </p>
          </div>

          <button
            onClick={startAction}
            disabled={status !== "idle"}
            className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              status === "idle" 
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-xl hover:-translate-y-0.5" 
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {status === "idle" && <Database className="w-4 h-4" />}
            {status === "idle" ? "Run Action" : status === "processing" ? "Working..." : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
