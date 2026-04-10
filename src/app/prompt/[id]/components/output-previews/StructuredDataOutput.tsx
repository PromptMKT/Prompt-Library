"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Copy, CheckCheck, ChevronRight } from "lucide-react";

type PromptItem = {
  title: string;
  promptText: string;
  category?: string;
};

const COLUMNS = ["id", "field", "value", "status", "priority"];

function generateTableData(promptText: string) {
  const lines = (promptText || "")
    .split("\n")
    .filter((l) => l.trim().length > 5)
    .slice(0, 6);

  return lines.map((line, i) => ({
    id: String(i + 1).padStart(3, "0"),
    field: line.trim().split(" ").slice(0, 2).join("_").toLowerCase().replace(/[^a-z0-9_]/g, ""),
    value: line.trim().slice(0, 40),
    status: ["Active", "Pending", "Extracted", "Validated"][i % 4],
    priority: ["High", "Medium", "Low"][i % 3],
  }));
}

type ViewMode = "table" | "json";

export function StructuredDataOutput({ prompt, isPurchased }: { prompt: PromptItem; isPurchased: boolean }) {
  const [view, setView] = useState<ViewMode>("table");
  const [copied, setCopied] = useState(false);

  const rows = generateTableData(prompt.promptText);
  const visibleRows = isPurchased ? rows : rows.slice(0, 2);

  const jsonOutput = JSON.stringify(
    visibleRows.map(({ id, field, value, status, priority }) => ({ id, field, value, status, priority })),
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(isPurchased ? jsonOutput : "Unlock to copy data");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/40">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-orange-500" />
          <span className="text-[11px] font-mono text-muted-foreground">structured_output.json</span>
        </div>
        <div className="flex items-center gap-2">
          {(["table", "json"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md transition-all ${
                view === v
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
          {isPurchased && (
            <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors ml-1">
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-[240px] overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "table" ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-muted-foreground w-8">
                      <ChevronRight className="w-3 h-3" />
                    </th>
                    {COLUMNS.map((col) => (
                      <th key={col} className="px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-3 py-3">
                        <input type="checkbox" readOnly className="w-3 h-3 rounded border-border/60" />
                      </td>
                      <td className="px-3 py-3 font-mono text-muted-foreground">{row.id}</td>
                      <td className="px-3 py-3 font-mono text-indigo-400">{row.field || "field"}</td>
                      <td className="px-3 py-3 text-foreground max-w-[160px] truncate">{row.value}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.status === "Active" ? "bg-emerald-500/15 text-emerald-500" :
                          row.status === "Validated" ? "bg-blue-500/15 text-blue-500" :
                          "bg-amber-500/15 text-amber-500"
                        }`}>{row.status}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`flex items-center gap-1.5 ${
                          row.priority === "High" ? "text-red-500" :
                          row.priority === "Medium" ? "text-amber-500" : "text-blue-500"
                        }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                          {row.priority}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.pre
              key="json"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-4 font-mono text-[12px] text-emerald-400 bg-zinc-950/80 leading-6 overflow-x-auto"
            >
              {jsonOutput}
            </motion.pre>
          )}
        </AnimatePresence>

        {/* Blur overlay */}
        {!isPurchased && (
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-card via-card/80 to-transparent flex flex-col items-center justify-end pb-6 gap-1">
            <p className="text-xs text-muted-foreground font-semibold">Unlock to access structured data output</p>
          </div>
        )}
      </div>

      {isPurchased && (
        <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span>{rows.length} rows extracted</span>
          <span>JSON / CSV ready</span>
        </div>
      )}
    </div>
  );
}
