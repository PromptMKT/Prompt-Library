"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Table, Code2, Download, Copy, Check } from "lucide-react";

const MOCK_DATA = [
  { id: 1, name: "Product Vision", status: "Active", priority: "High" },
  { id: 2, name: "Market Research", status: "Completed", priority: "Medium" },
  { id: 3, name: "User Interviews", status: "Pending", priority: "High" },
  { id: 4, name: "Competitor Analysis", status: "In Progress", priority: "Low" },
];

export function StructuredDataOutput() {
  const [view, setView] = useState<"json" | "table">("json");
  const [copied, setCopied] = useState(false);

  const copyData = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Controls */}
      <div className="flex justify-between items-center bg-card/80 p-1.5 rounded-xl border border-border/50 backdrop-blur-sm relative z-10 w-full mb-[-10px]">
        <div className="flex gap-1">
          <button
            onClick={() => setView("json")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
              view === "json" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="w-4 h-4" /> JSON
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
              view === "table" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
            }`}
          >
           <Table className="w-4 h-4" /> Table
          </button>
        </div>
        
        <div className="flex gap-1">
          <button onClick={copyData} className="p-2 text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors border border-border/30" title="Copy Data">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors border border-border/30" title="Download">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm h-[320px]">
        <AnimatePresence mode="wait">
          {view === "json" ? (
            <motion.div
              key="json"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-[#1e1e1e] p-6 overflow-auto scrollbar-hide text-[13px] md:text-sm font-mono leading-relaxed text-[#d4d4d4]"
            >
              <pre dangerouslySetInnerHTML={{ 
                __html: JSON.stringify(MOCK_DATA, null, 2)
                  .replace(/("[^"]+"):/g, '<span class="text-[#9cdcfe]">$1</span>:')
                  .replace(/: (".+")/g, ': <span class="text-[#ce9178]">$1</span>')
                  .replace(/: ([0-9]+)/g, ': <span class="text-[#b5cea8]">$1</span>')
                  .replace(/[\{\}\[\]]/g, '<span class="text-[#ffd700]">$&</span>')
              }} />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-card overflow-auto"
            >
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-secondary/50 border-b border-border/60 text-muted-foreground sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-foreground">
                  {MOCK_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-muted-foreground">#{row.id}</td>
                      <td className="px-6 py-4 font-medium">{row.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          row.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          row.status === "Active" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 ${
                          row.priority === "High" ? "text-red-500" :
                          row.priority === "Medium" ? "text-yellow-500" : "text-blue-500"
                        }`}>
                          <div className={`w-2 h-2 rounded-full currentColor bg-current`} />
                          {row.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
