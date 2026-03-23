"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FunctionSquare, ArrowRightLeft, Sparkles } from "lucide-react";

export function ToolCallOutput() {
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");

  const requestJson = {
    "name": "get_current_weather",
    "arguments": {
       "location": "San Francisco, CA",
       "unit": "celsius"
    }
  };

  const responseJson = {
    "temperature": 16,
    "condition": "Partly Cloudy",
    "humidity": 65,
    "wind": "12 km/h"
  };

  return (
    <div className="w-full">
      <div className="bg-[#1a1a1e] rounded-2xl border border-border/20 shadow-xl overflow-hidden font-mono text-sm relative">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/20 bg-[#222226]">
          <div className="flex items-center gap-3 px-4 py-3 border-r border-border/20">
             <FunctionSquare className="w-5 h-5 text-purple-400" />
             <div>
                <div className="text-gray-200 font-medium">get_current_weather</div>
                <div className="text-gray-500 text-xs mt-0.5">Tool Calling Action</div>
             </div>
          </div>

          <div className="flex mt-2 sm:mt-0 px-2 sm:px-4 pb-2 sm:pb-0 gap-2 overflow-x-auto w-full sm:w-auto scrollbar-hide">
            <button
               onClick={() => setActiveTab("request")}
               className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                 activeTab === "request" ? "bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50" : "text-gray-400 hover:text-gray-200"
               }`}
            >
               Request Payload
            </button>
            <button
               onClick={() => setActiveTab("response")}
               className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                 activeTab === "response" ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/50" : "text-gray-400 hover:text-gray-200"
               }`}
            >
               Execution Result
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative min-h-[220px]">
           {/* Decorative elements */}
           <div className="absolute right-6 top-6 opacity-10">
              {activeTab === "request" ? <Sparkles className="w-24 h-24" /> : <ArrowRightLeft className="w-24 h-24" />}
           </div>

           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: activeTab === "request" ? -10 : 10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: activeTab === "request" ? 10 : -10 }}
               transition={{ duration: 0.2 }}
               className="relative z-10"
             >
                {activeTab === "request" ? (
                  <div>
                    <div className="text-gray-400 mb-4 flex items-center gap-2">
                       <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                       LLM Generated Call
                    </div>
                    <pre className="text-gray-300">
                      <code dangerouslySetInnerHTML={{ 
                        __html: JSON.stringify(requestJson, null, 2)
                          .replace(/("[^"]+"):/g, '<span class="text-blue-400">$1</span>:')
                          .replace(/: (".+")/g, ': <span class="text-amber-300">$1</span>')
                      }} />
                    </pre>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-400 mb-4 flex items-center gap-2">
                       <span className="inline-block w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                       System Response
                    </div>
                    <pre className="text-gray-300">
                      <code dangerouslySetInnerHTML={{ 
                        __html: JSON.stringify(responseJson, null, 2)
                          .replace(/("[^"]+"):/g, '<span class="text-blue-400">$1</span>:')
                          .replace(/: (".+")/g, ': <span class="text-amber-300">$1</span>')
                          .replace(/: ([0-9]+)/g, ': <span class="text-green-300">$1</span>')
                      }} />
                    </pre>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Status bar */}
        <div className="px-4 py-2 border-t border-border/20 bg-[#1a1a1e] flex items-center justify-between text-xs text-gray-500">
          <div>Status: <span className={activeTab === "request" ? "text-yellow-400" : "text-green-400"}>{activeTab === "request" ? "Pending Execution" : "Success (124ms)"}</span></div>
          <div>Strict Mode: ON</div>
        </div>

      </div>
    </div>
  );
}
