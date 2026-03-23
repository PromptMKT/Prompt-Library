"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Terminal } from "lucide-react";

const CODE_TABS = [
  { id: "button", name: "Button.tsx", language: "typescript" },
  { id: "app", name: "App.js", language: "javascript" },
  { id: "styles", name: "styles.css", language: "css" }
];

const CODE_CONTENT: Record<string, string> = {
  button: `import React from 'react';\nimport { cn } from '@/lib/utils';\n\ninterface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: 'primary' | 'ghost' | 'danger';\n  size?: 'sm' | 'md' | 'lg';\n  loading?: boolean;\n}\n\nexport const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(\n  ({ className, variant = 'primary', size = 'md', loading, ...props }, ref) => {\n    return (\n      <button\n        ref={ref}\n        className={cn(\n          "inline-flex items-center justify-center rounded-xl font-medium transition-colors",\n          // Add more styles based on variant\n          className\n        )}\n        disabled={loading}\n        {...props}\n      />\n    );\n  }\n);`,
  app: `import { createRoot } from 'react-dom/client';\nimport { Button } from './Button';\n\nfunction App() {\n  return (\n    <div className="p-8">\n      <h1>Welcome back</h1>\n      <Button variant="primary" size="lg">\n        Get Started\n      </Button>\n    </div>\n  );\n}\n\nconst root = createRoot(document.getElementById('root'));\nroot.render(<App />);`,
  styles: `.button-primary {\n  background-color: var(--primary);\n  color: white;\n}\n\n.button-primary:hover {\n  opacity: 0.9;\n}\n\n.button-ghost {\n  background-color: transparent;\n  color: var(--foreground);\n}`
};

export function CodeOutput() {
  const [activeFile, setActiveFile] = useState(CODE_TABS[0].id);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentContent = CODE_CONTENT[activeFile];
  const activeTabInfo = CODE_TABS.find(t => t.id === activeFile);

  return (
    <div className="w-full relative bg-[#1e1e1e] rounded-2xl border border-border/20 shadow-xl overflow-hidden font-mono text-sm group flex flex-col max-h-[380px] lg:max-h-[420px]">
      {/* Code Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#252526] border-b border-[#333] flex-shrink-0">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          {CODE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFile(tab.id)}
              className={`px-4 py-3 flex items-center gap-2 border-r border-[#333] transition-colors relative ${
                activeFile === tab.id ? "bg-[#1e1e1e] text-[#e5e5e5]" : "text-[#858585] hover:bg-[#2a2a2a]"
              }`}
            >
              {activeFile === tab.id && (
                <motion.div layoutId="code-active-line" className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
              )}
              {tab.language === "typescript" ? (
                <span className="text-[#3178c6]">TS</span>
              ) : tab.language === "javascript" ? (
                <span className="text-[#f7df1e]">JS</span>
              ) : (
                <span className="text-[#264de4]">CSS</span>
              )}
              {tab.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 md:py-0 self-end md:self-auto">
          <span className="text-[#858585] text-xs mr-2">{activeTabInfo?.language}</span>
          <button 
            onClick={copyCode}
            className="text-[#858585] hover:text-white transition-colors bg-[#333] p-1.5 rounded-md flex items-center gap-1.5 text-xs font-sans"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 md:p-6 overflow-auto text-[#d4d4d4] relative flex-1 min-h-0 scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent">
        {/* Fake line numbers for aesthetic */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#333] opacity-50 select-none flex flex-col items-end pr-3 pt-6 text-[#858585] text-xs space-y-[0.35rem]">
          {Array.from({ length: 20 }).map((_, i) => (
             <span key={i}>{i + 1}</span>
          ))}
        </div>

        <div className="pl-10">
          <AnimatePresence mode="wait">
            <motion.pre
              key={activeFile}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[13px] md:text-sm leading-relaxed whitespace-pre"
            >
              <code dangerouslySetInnerHTML={{ 
                __html: currentContent
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/(['"])(.*?)\1/g, '___STR___$1$2$1___ENDSTR___')
                  .replace(/\b(import|from|export|const|function|interface|return)\b/g, '<span class="text-[#c586c0]">$1</span>')
                  .replace(/\b(React|Button|HTMLButtonElement|App)\b/g, '<span class="text-[#4ec9b0]">$1</span>')
                  .replace(/___STR___(.*?)___ENDSTR___/g, '<span class="text-[#ce9178]">$1</span>')
              }} />
            </motion.pre>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
