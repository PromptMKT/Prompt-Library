"use client";

import React from "react";
import { Bot, User, AlignLeft, SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const CHAT_EXCHANGE = [
  {
    role: "user",
    content: "Can you summarize the principles of atomic design in UI?"
  },
  {
    role: "assistant",
    content: "Certainly! Atomic design is a methodology created by Brad Frost for building design systems. It breaks interfaces down into five distinct levels:\n\n1. **Atoms**: The basic building blocks (buttons, inputs, font styles).\n2. **Molecules**: Groups of atoms functioning together (e.g., a search form combining a label, input, and button).\n3. **Organisms**: Complex UI components composed of groups of molecules and/or atoms (e.g., a header navigation).\n4. **Templates**: Page-level objects that place components into a layout to define the underlying content structure.\n5. **Pages**: Specific instances of templates showing what a UI looks like with real representative content."
  }
];

export function ConversationalOutput() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl bg-card border border-border/50 rounded-2xl shadow-lg flex flex-col h-[380px] lg:h-[400px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">GPT-4 Turbo</h4>
              <p className="text-xs text-muted-foreground">Conversational Model</p>
            </div>
          </div>
          <button className="text-muted-foreground hover:bg-secondary p-2 rounded-md transition-colors">
            <AlignLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide bg-card/30 min-h-0">
          {CHAT_EXCHANGE.map((msg, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2 }}
               className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
             >
               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                 msg.role === "user" ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"
               }`}>
                 {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
               </div>
               
               <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm md:text-base ${
                 msg.role === "user" 
                  ? "bg-secondary text-foreground rounded-tr-sm" 
                  : "bg-primary/10 border border-primary/10 text-foreground/90 rounded-tl-sm prose prose-sm dark:prose-invert"
               }`}>
                 {msg.role === "user" ? (
                   <p>{msg.content}</p>
                 ) : (
                   <div className="space-y-3">
                     <p>Certainly! Atomic design is a methodology created by Brad Frost for building design systems. It breaks interfaces down into five distinct levels:</p>
                     <ol className="list-decimal pl-5 space-y-2">
                       <li><strong className="text-primary font-bold">Atoms:</strong> The basic building blocks (buttons, inputs, font styles).</li>
                       <li><strong className="text-primary font-bold">Molecules:</strong> Groups of atoms functioning together (e.g., a search form).</li>
                       <li><strong className="text-primary font-bold">Organisms:</strong> Complex UI components composed of molecules.</li>
                       <li><strong className="text-primary font-bold">Templates:</strong> Page-level objects that place components into a layout.</li>
                       <li><strong className="text-primary font-bold">Pages:</strong> Specific instances of templates with real content.</li>
                     </ol>
                   </div>
                 )}
               </div>
             </motion.div>
          ))}

          {/* Typing Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 flex-row"
          >
             <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
             </div>
             <div className="bg-primary/5 border border-primary/10 rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-1.5 w-16 h-11">
                <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0, duration: 0.6 }} />
                <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0.2, duration: 0.6 }} />
                <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0.4, duration: 0.6 }} />
             </div>
          </motion.div>
        </div>

        {/* Input Simulation */}
        <div className="p-4 border-t border-border/40 bg-card">
          <div className="relative flex items-center">
            <input 
              disabled
              placeholder="Message GPT..." 
              className="w-full bg-secondary/50 border border-border/60 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none placeholder:text-muted-foreground/50 opacity-50 cursor-not-allowed"
            />
            <div className="absolute right-2 bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center">
              <SendHorizontal className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
