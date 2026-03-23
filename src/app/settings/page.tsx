"use client";

import { User, Bell, Shield, Wallet, CircleCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const settingsSections = [
  {
    title: "Account Settings",
    icon: User,
    description: "Manage your profile information and account details.",
    items: [
      { label: "Profile Information", value: "Priya Nair" },
      { label: "Email Address", value: "priya@example.com" },
      { label: "Phone Number", value: "+91 ••••••••89" },
    ]
  },
  {
    title: "Notifications",
    icon: Bell,
    description: "Control how you receive updates and alerts.",
    items: [
      { label: "Email Notifications", toggle: true, checked: true },
      { label: "Browser Notifications", toggle: true, checked: false },
    ]
  },
  {
    title: "Security",
    icon: Shield,
    description: "Keep your account secure with extra protection.",
    items: [
      { label: "Password", value: "Last changed 3 months ago" },
      { label: "Two-Factor Auth", value: "Disabled" },
    ]
  }
];

export default function SettingsPage() {
  return (
    <div className="max-w-[1000px] mx-auto p-6 md:p-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your account preferences and security settings.</p>
      </header>

      <div className="space-y-6 pb-20">
        {settingsSections.map((section, idx) => (
          <div key={idx} className="bg-card/50 border border-border/50 rounded-3xl p-8 shadow-sm hover:border-primary/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5 transition-transform group-hover:scale-110">
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
                <p className="text-xs text-muted-foreground font-medium">{section.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {section.items.map((item: any, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-border/50 hover:bg-secondary/50 transition-all cursor-pointer group/item">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">{item.label}</p>
                    {item.value && <p className="text-xs text-muted-foreground">{item.value}</p>}
                  </div>
                  
                  {item.toggle ? (
                    <div className={cn("w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300", item.checked ? "bg-primary" : "bg-muted")}>
                      <div className={cn("bg-white w-4 h-4 rounded-full transition-transform duration-300", item.checked && "translate-x-4")} />
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/item:translate-x-1 transition-transform" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/40 text-right">
              <button className="text-[11px] font-black uppercase tracking-widest text-primary hover:underline" onClick={() => toast.success("Changes saved!")}>Save changes</button>
            </div>
          </div>
        ))}

        <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-8 hover:bg-destructive/10 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-destructive">Account Deletion</h3>
              <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <button className="px-6 py-3 rounded-2xl bg-destructive text-white font-black text-xs uppercase tracking-widest hover:bg-destructive/90 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
