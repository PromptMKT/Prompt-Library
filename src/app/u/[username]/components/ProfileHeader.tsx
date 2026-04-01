"use client";

import { Camera, Edit, MapPin, Link as LinkIcon, Star, Share2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface ProfileHeaderProps {
  user: any;
  isFollowing: boolean;
  onFollow: () => void;
  onCopyLink: () => void;
  isOwner?: boolean;
  onSave?: (updates: { username: string; bio: string }) => void;
}

export function ProfileHeader({ user, isFollowing, onFollow, onCopyLink, isOwner = false, onSave }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user.username || "",
    bio: user.bio || "",
  });

  // Username availability check state
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "unchanged">("idle");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Check username availability with debounce
  useEffect(() => {
    if (!isEditing) return;
    const trimmed = editForm.username.trim().toLowerCase();

    // If same as original, mark unchanged
    if (trimmed === user.username?.toLowerCase()) {
      setUsernameStatus("unchanged");
      return;
    }

    if (trimmed.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("username", trimmed)
        .maybeSingle();

      setUsernameStatus(data ? "taken" : "available");
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editForm.username, isEditing, user.username]);

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ username: user.username || "", bio: user.bio || "" });
    setUsernameStatus("idle");
  };

  const handleSave = async () => {
    const trimmedUsername = editForm.username.trim().toLowerCase();

    // Validate username
    if (trimmedUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
      toast.error("Username can only contain letters, numbers, and underscores");
      return;
    }

    // Block if username is taken
    if (usernameStatus === "taken") {
      toast.error("That username is already taken");
      return;
    }

    // If still checking, wait
    if (usernameStatus === "checking") {
      toast("Still checking username availability...");
      return;
    }

    try {
      const filterCol = user.auth_user_id ? "auth_user_id" : "id";
      const filterVal = user.auth_user_id || user.id;

      const updates: Record<string, string> = { bio: editForm.bio };
      // Only include username in update if it actually changed
      if (trimmedUsername !== user.username?.toLowerCase()) {
        updates.username = trimmedUsername;
      }

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq(filterCol, filterVal);

      if (error) throw error;

      toast.success("Profile updated!");
      setIsEditing(false);

      if (onSave) {
        onSave({ username: updates.username ?? user.username, bio: editForm.bio });
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      toast.error("Failed to update: " + err.message);
    }
  };

  // Display name with smart fallback
  const displayName = user.displayName || user.name;
  const isEmailAsName = displayName?.includes("@");
  const prettyName = isEmailAsName ? displayName.split("@")[0] : displayName;

  return (
    <>
      {/* ── Cover ── */}
      <div className="h-[180px] relative overflow-hidden bg-gradient-to-br from-[#0d0420] via-[#1a0b3b] to-[#0d1f3c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(124,58,237,0.25),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.1),transparent_40%)]" />
        {isOwner && (
          <button
            className="absolute top-3 right-3 py-1.5 px-4 rounded-full text-[11px] font-semibold border border-white/15 bg-black/30 backdrop-blur-md text-white/80 hover:bg-black/50 transition-all flex items-center gap-1.5 z-20"
            onClick={() => toast("Cover editor coming soon")}
          >
            <Edit className="w-3 h-3" /> Edit cover
          </button>
        )}
      </div>

      {/* ── Header content ── */}
      <div className="max-w-[1400px] mx-auto px-7 relative">
        {/* Avatar + action buttons row */}
        <div className="flex items-end justify-between gap-4">
          {/* Avatar */}
          <div className="relative mt-[-50px] flex-shrink-0">
            <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-[32px] font-black text-white border-4 border-background shadow-lg relative z-10 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.username || 'default'}&backgroundColor=8B5CF6`} alt="Avatar" className="w-full h-full object-cover" />
              )}
              {isOwner && (
                <div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => toast("Photo upload coming soon")}
                >
                  <Camera className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="absolute bottom-1.5 right-1 w-3.5 h-3.5 bg-[#22d3ee] border-[3px] border-background rounded-full z-20" />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pb-3">
            {isOwner ? (
              <button
                className="py-2 px-5 rounded-full text-[12px] font-bold border border-border hover:bg-secondary text-foreground transition-all"
                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            ) : (
              <>
                <button
                  className={cn(
                    "py-2 px-5 rounded-full text-[12px] font-bold transition-all",
                    isFollowing
                      ? "bg-secondary border border-border text-muted-foreground"
                      : "bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] text-white shadow-md shadow-primary/20 hover:opacity-90 active:scale-95"
                  )}
                  onClick={onFollow}
                >
                  {isFollowing ? "✓ Following" : "+ Follow"}
                </button>
                <button
                  className="py-2 px-4 rounded-full text-[12px] font-semibold border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
                  onClick={() => toast("Message feature coming soon")}
                >
                  ✉ Message
                </button>
              </>
            )}
            <button
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
              onClick={onCopyLink}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Info section */}
        {isEditing ? (
          <div className="py-5 border-b border-border animate-in fade-in">
            <div className="space-y-4 max-w-[480px]">

              {/* Username field */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black block mb-1">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                    placeholder="your_username"
                    maxLength={30}
                    className={cn(
                      "w-full bg-background border rounded-xl pl-8 pr-10 py-2.5 text-sm text-foreground outline-none transition-colors",
                      usernameStatus === "taken" ? "border-red-500 focus:border-red-500" :
                        usernameStatus === "available" ? "border-green-500 focus:border-green-500" :
                          "border-border focus:border-primary"
                    )}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                    {usernameStatus === "available" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {usernameStatus === "taken" && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
                <p className={cn(
                  "text-[10px] mt-1 font-medium",
                  usernameStatus === "taken" ? "text-red-500" :
                    usernameStatus === "available" ? "text-green-500" :
                      "text-muted-foreground"
                )}>
                  {usernameStatus === "taken" && "Username already taken"}
                  {usernameStatus === "available" && "Username is available!"}
                  {usernameStatus === "unchanged" && "This is your current username"}
                  {(usernameStatus === "idle" || usernameStatus === "checking") && "3–30 chars, letters, numbers, underscores only"}
                </p>
              </div>

              {/* Bio field */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black block mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell visitors about yourself..."
                  maxLength={200}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary outline-none h-20 resize-none transition-colors"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5 text-right">{editForm.bio.length}/200</p>
              </div>

              <button
                onClick={handleSave}
                disabled={usernameStatus === "taken" || usernameStatus === "checking"}
                className="py-2.5 px-6 bg-primary text-white text-[11px] font-bold rounded-full uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4 border-b border-border">
            {/* Name + verified badge */}
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl font-black tracking-tight text-foreground">{prettyName}</h1>
              {user.verified && (
                <span className="text-[9px] font-bold py-1 px-2.5 rounded-full bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.2)] text-[#22d3ee] uppercase tracking-wider">✓ Verified</span>
              )}
            </div>

            {/* Handle + member since */}
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest mb-3">
              @{user.username} <span className="mx-1.5 opacity-30">·</span> Member since {user.memberSince}
            </p>

            {/* Bio */}
            {user.bio && (
              <p className="text-[13px] text-foreground/70 max-w-[580px] leading-relaxed mb-3">{user.bio}</p>
            )}

            {/* Interest tags */}
            {user.interests?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {user.interests.map((tag: string) => (
                  <span key={tag} className="py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/15 bg-primary/5 text-primary/70">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
              {user.location && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.location}</span>
              )}
              {user.website && (
                <a href={user.website.startsWith("http") ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <LinkIcon className="w-3 h-3" /> {user.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <strong className="text-foreground font-bold">{(user.followers || 0).toLocaleString()}</strong> followers
                <span className="opacity-30">/</span>
                <strong className="text-foreground font-bold">{(user.following || 0).toLocaleString()}</strong> following
              </span>
              {user.avgRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#e8a838] text-[#e8a838]" />
                  <strong className="text-foreground font-bold">{user.avgRating.toFixed(1)}</strong> avg rating
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
