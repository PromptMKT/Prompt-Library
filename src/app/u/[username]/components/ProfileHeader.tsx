"use client";

import { Camera, Edit, MapPin, Link as LinkIcon, Star, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProfileHeaderProps {
  user: any;
  isFollowing: boolean;
  onFollow: () => void;
  onCopyLink: () => void;
  isOwner?: boolean;
}

export function ProfileHeader({ user, isFollowing, onFollow, onCopyLink, isOwner = false }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const handleSave = async () => {
    try {
      const dbPayload = {
        id: user.id, // Will match existing profile or create a new one with same ID as Auth
        auth_user_id: user.auth_user_id || user.id,
        email: user.email,
        username: user.username || `user_${user.id.substring(0,8)}`,
        display_name: editForm.name,
        bio: editForm.bio,
      };

      const { error } = await supabase
        .from("users")
        .upsert(dbPayload, { onConflict: "id" });

      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      window.location.reload();
    } catch (err: any) {
      toast.error("Failed to update profile: " + err.message);
    }
  };

  const getInitials = () => {
    if (user.display_name) return user.display_name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase();
    if (user.name) return user.name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase();
    return (user.username || user.email || "?")[0].toUpperCase();
  };

  return (
    <>
      <div className="h-[200px] relative overflow-hidden bg-gradient-to-br from-[#0d0420] via-[#1a0b3b] to-[#0d1f3c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(124,58,237,0.25),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.1),transparent_40%)]" />
        {isOwner && (
          <button 
            className="absolute top-[14px] right-[14px] py-[6px] px-[14px] rounded-[20px] text-[11px] font-semibold border border-white/15 bg-black/30 backdrop-blur-[8px] text-white/80 hover:bg-black/50 hover:text-white transition-all flex items-center gap-[5px] z-20"
            onClick={() => toast("Cover editor coming soon")}
          >
            <Edit className="w-3 h-3" /> Edit cover
          </button>
        )}
      </div>

      <div className="max-w-[1200px] mx-auto px-7 relative">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="relative mt-[-56px] mb-4">
            <div className="w-[108px] h-[108px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-[36px] font-black tracking-[-0.04em] text-white border-[4px] border-background shadow-[0_0_0_1px_var(--border2)] relative z-10 overflow-hidden">
               {user.avatar ? (
                 <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
               ) : (
                 <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.username || 'default'}&backgroundColor=8B5CF6`} alt="Random Avatar" className="w-full h-full object-cover" />
               )}
               {isOwner && (
                 <div 
                   className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-[11] text-[10px] font-black text-white uppercase tracking-widest"
                   onClick={() => toast("Photo upload coming soon")}
                 >
                    <Camera className="w-4 h-4 mr-1" /> Change
                 </div>
               )}
            </div>
            <div className="absolute bottom-2 right-1 w-4 h-4 bg-[#22d3ee] border-[3px] border-background rounded-full z-20" title="Online now" />
          </div>
          
          <div className="flex items-center gap-2 pb-3">
            {isOwner ? (
              <button 
                className="py-[9px] px-[22px] rounded-[2rem] text-[13px] font-bold transition-all shadow-sm border border-border2 hover:bg-secondary text-foreground"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
            ) : (
              <>
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
              </>
            )}
            <button className="w-[36px] h-[36px] rounded-full border border-border2 bg-transparent flex items-center justify-center text-muted-foreground hover:border-[#8B5CF6] hover:text-foreground transition-all" onClick={onCopyLink}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="pb-5 mt-4 border-b border-border transition-colors animate-in fade-in slide-in-from-top-2">
            <div className="space-y-4 max-w-[500px]">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Display Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Bio</label>
                <textarea 
                  value={editForm.bio}
                  onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:border-primary outline-none h-24 resize-none"
                />
              </div>
              <button onClick={handleSave} className="py-2 px-6 bg-primary text-white text-sm font-bold rounded-full">
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="pb-5 border-b border-border transition-colors">
            <div className="space-y-1">
              <div className="text-xl font-black tracking-[-0.08em] flex items-center gap-1">
                {user.name && <span className="text-foreground uppercase italic tracking-normal">{user.name}</span>}
              </div>
              <p className="text-[12px] text-muted-foreground font-black uppercase tracking-widest">@{user.username || "user"} <span className="mx-2 opacity-30">|</span> MEMBER SINCE {user.memberSince?.toUpperCase()}</p>
            </div>
            <p className="text-[14px] text-foreground/80 font-bold max-w-[620px] leading-[1.6] my-4">
              {user.bio || "No bio available."}
            </p>
            <div className="flex flex-wrap gap-2 mb-4 mt-2">
              {["B2B Marketing", "Email", "ChatGPT", "Claude", "Content"].map(tag => (
                <span key={tag} className="py-1.5 px-[14px] rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary/80">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2 underline underline-offset-4 decoration-primary/30"><strong className="text-foreground">{user.followers || 0}</strong> followers <span className="opacity-30">/</span> <strong className="text-foreground">{user.following || 0}</strong> following</span>
              <span className="flex items-center gap-2"><Star className="w-3.5 h-3.5 fill-amber text-amber" /> <strong className="text-foreground">{user.avgRating || "5.0"}</strong> AVG RATING</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
