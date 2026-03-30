"use client";

import { Camera, Edit, MapPin, Link as LinkIcon, Star, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  user: any;
  isFollowing: boolean;
  onFollow: () => void;
  onCopyLink: () => void;
}

export function ProfileHeader({ user, isFollowing, onFollow, onCopyLink }: ProfileHeaderProps) {
  return (
    <>
      <div className="h-[200px] relative overflow-hidden bg-gradient-to-br from-[#0d0420] via-[#1a0b3b] to-[#0d1f3c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(124,58,237,0.25),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.1),transparent_40%)]" />
        <button 
          className="absolute top-[14px] right-[14px] py-[6px] px-[14px] rounded-[20px] text-[11px] font-semibold border border-white/15 bg-black/30 backdrop-blur-[8px] text-white/80 hover:bg-black/50 hover:text-white transition-all flex items-center gap-[5px] z-20"
          onClick={() => toast("Cover editor coming soon")}
        >
          <Edit className="w-3 h-3" /> Edit cover
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-7 relative">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="relative mt-[-56px] mb-4">
            <div className="w-[108px] h-[108px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-[36px] font-black tracking-[-0.04em] text-white border-[4px] border-background shadow-[0_0_0_1px_var(--border2)] relative z-10 overflow-hidden">
<<<<<<< Updated upstream
               {user.display_name 
                 ? user.display_name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase()
                 : user.name
                 ? user.name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase()
                 : (user.username || user.email || "?")[0].toUpperCase()}
               <div 
                 className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-[11] text-[10px] font-black text-white uppercase tracking-widest"
                 onClick={() => toast("Photo updated!")}
               >
                  <Camera className="w-4 h-4 mr-1" /> Change
               </div>
=======
               {user.avatar ? (
                 <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
               ) : (
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.id || 'default'}`} alt="Random Avatar" className="w-full h-full object-cover" />
               )}
               {isOwner && (
                 <div 
                   className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-[11] text-[10px] font-black text-white uppercase tracking-widest"
                   onClick={() => toast("Photo upload coming soon")}
                 >
                    <Camera className="w-4 h-4 mr-1" /> Change
                 </div>
               )}
>>>>>>> Stashed changes
            </div>
            <div className="absolute bottom-2 right-1 w-4 h-4 bg-[#22d3ee] border-[3px] border-background rounded-full z-20" title="Online now" />
          </div>
          
          <div className="flex items-center gap-2 pb-3">
            <button 
              className={cn(
                "py-[9px] px-[22px] rounded-[2rem] text-[13px] font-bold transition-all shadow-[0_2px_12px_rgba(124,58,237,0.3)]",
                isFollowing ? "bg-secondary border border-border2 text-muted-foreground shadow-none" : "bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] text-white hover:opacity-90 active:scale-95"
              )}
              onClick={onFollow}
            >
              {isFollowing ? "✓ Following" : "+ Follow"}
            </button>
            <button className="py-[9px] px-[18px] rounded-[2rem] text-[13px] font-semibold border border-border2 bg-transparent text-muted-foreground hover:border-[#8B5CF6] hover:text-foreground transition-all" onClick={() => toast("Message feature coming soon")}>
              ✉ Message
            </button>
            <button className="w-[36px] h-[36px] rounded-full border border-border2 bg-transparent flex items-center justify-center text-muted-foreground hover:border-[#8B5CF6] hover:text-foreground transition-all" onClick={onCopyLink}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pb-5 border-b border-border transition-colors">
          <div className="space-y-1">
            <div className="text-xl font-black tracking-[-0.08em] flex items-center gap-1">
              <span className="text-primary uppercase">Prompt</span><span className="text-foreground uppercase italic tracking-normal">X</span>
            </div>
            <p className="text-[12px] text-muted-foreground font-black uppercase tracking-widest">@{user.username} <span className="mx-2 opacity-30">|</span> MEMBER SINCE {user.memberSince?.toUpperCase()}</p>
          </div>
          <p className="text-[14px] text-foreground/80 font-bold max-w-[620px] leading-[1.6] my-4">
            {user.bio}
          </p>
          <div className="flex flex-wrap gap-2 mb-4 mt-2">
            {["B2B Marketing", "Email", "ChatGPT", "Claude", "Content"].map(tag => (
              <span key={tag} className="py-1.5 px-[14px] rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary/80">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary/60" /> {user.location}</span>
            <span className="flex items-center gap-2"><LinkIcon className="w-3.5 h-3.5 text-primary/60" /> <a href="#" className="text-primary hover:underline">{user.website}</a></span>
            <span className="flex items-center gap-2 underline underline-offset-4 decoration-primary/30"><strong className="text-foreground">{user.followers}</strong> followers <span className="opacity-30">/</span> <strong className="text-foreground">{user.following}</strong> following</span>
            <span className="flex items-center gap-2"><Star className="w-3.5 h-3.5 fill-amber text-amber" /> <strong className="text-foreground">{user.avgRating}</strong> AVG RATING</span>
          </div>
        </div>
      </div>
    </>
  );
}
