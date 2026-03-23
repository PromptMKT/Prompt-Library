import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface OutputCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  id?: string;
}

export function OutputCard({ title, description, icon, children, id }: OutputCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col xl:flex-row gap-0 group"
    >
      {/* Left Content / Info Area */}
      <div className="p-8 lg:p-10 flex flex-col justify-center xl:w-1/3 xl:border-r border-border/40 bg-card/50 relative z-10 transition-colors group-hover:bg-primary/[0.02]">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm border border-primary/20">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-base leading-relaxed mb-8">
          {description}
        </p>
        
        <div className="mt-auto">
          <Link href={`/outputFormat/${id}`} className="text-primary font-medium flex items-center gap-2 group/btn hover:text-accent-hover transition-colors text-sm">
            View examples 
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* Right Content / Preview Area */}
      <div className="flex-1 bg-secondary/30 p-4 lg:p-8 xl:p-10 flex items-center justify-center relative h-[450px] lg:h-[500px] overflow-y-auto overflow-x-hidden">
        {/* Subtle grid background for the preview area */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20"></div>
        
        <div className="w-full max-w-4xl relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
