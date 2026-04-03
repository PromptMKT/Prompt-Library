"use client";

import { Camera, Edit, MapPin, Link as LinkIcon, Share2, Flag, Loader2, CheckCircle2, XCircle, X, Plus } from "lucide-react";
import Link from "next/link";
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
    displayName: user.displayName || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    interests: (user.interests || []) as string[],
    technicalSkills: (user.technicalSkills || []) as string[],
  });
  const [interestInput, setInterestInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    try {
      if (type === "avatar") setIsUploadingAvatar(true);
      else setIsUploadingCover(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.auth_user_id || user.id}-${type}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("profiles")
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from("profiles").getPublicUrl(fileName);

      const filterCol = user.auth_user_id ? "auth_user_id" : "id";
      const filterVal = user.auth_user_id || user.id;
      const updatePayload = type === "avatar" ? { avatar_url: publicUrl } : { cover_url: publicUrl };

      const { error: dbError } = await supabase.from("users").update(updatePayload).eq(filterCol, filterVal);
      if (dbError) throw dbError;

      toast.success(`${type === "avatar" ? "Profile picture" : "Cover photo"} updated!`);
      // Reload is safest here so AuthProvider re-fetches the navbar avatar as well
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      if (type === "avatar") setIsUploadingAvatar(false);
      else setIsUploadingCover(false);
      if (e.target) e.target.value = "";
    }
  };

  // Username availability check state
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "unchanged">("idle");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Check username availability with debounce
  useEffect(() => {
    if (!isEditing) return;
    const trimmed = editForm.username.trim().toLowerCase();

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

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [editForm.username, isEditing, user.username]);

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      username: user.username || "",
      displayName: user.displayName || "",
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
      interests: user.interests || [],
      technicalSkills: user.technicalSkills || [],
    });
    setInterestInput("");
    setSkillInput("");
    setUsernameStatus("idle");
  };

  const handleSave = async () => {
    const trimmedUsername = editForm.username.trim().toLowerCase();

    if (trimmedUsername.length < 3) { toast.error("Username must be at least 3 characters"); return; }
    if (!/^[a-z0-9_]+$/.test(trimmedUsername)) { toast.error("Username can only contain letters, numbers, and underscores"); return; }
    if (usernameStatus === "taken") { toast.error("That username is already taken"); return; }
    if (usernameStatus === "checking") { toast("Still checking username availability..."); return; }

    try {
      const filterCol = user.auth_user_id ? "auth_user_id" : "id";
      const filterVal = user.auth_user_id || user.id;

      const updates: Record<string, any> = {
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website,
        interests: editForm.interests,
        technical_skills: editForm.technicalSkills,
      };
      if (editForm.displayName.trim()) updates.display_name = editForm.displayName.trim();
      if (trimmedUsername !== user.username?.toLowerCase()) updates.username = trimmedUsername;

      const { error } = await supabase.from("users").update(updates).eq(filterCol, filterVal);
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

  // Tag helpers
  const addInterest = () => {
    const v = interestInput.trim();
    if (v && !editForm.interests.includes(v) && editForm.interests.length < 10) {
      setEditForm(f => ({ ...f, interests: [...f.interests, v] }));
    }
    setInterestInput("");
  };
  const removeInterest = (tag: string) => setEditForm(f => ({ ...f, interests: f.interests.filter(t => t !== tag) }));

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !editForm.technicalSkills.includes(v) && editForm.technicalSkills.length < 15) {
      setEditForm(f => ({ ...f, technicalSkills: [...f.technicalSkills, v] }));
    }
    setSkillInput("");
  };
  const removeSkill = (s: string) => setEditForm(f => ({ ...f, technicalSkills: f.technicalSkills.filter(t => t !== s) }));

  const displayName = user.displayName || user.name;
  const isEmailAsName = displayName?.includes("@");
  const prettyName = isEmailAsName ? displayName.split("@")[0] : displayName;

  return (
    <>
      {/* ── Cover ── */}
      <div className="h-[180px] relative overflow-hidden bg-[#0a0514]">
        {user.cover_url ? (
          <img src={user.cover_url} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0420] via-[#1a0b3b] to-[#0d1f3c]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(124,58,237,0.25),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.1),transparent_40%)]" />
          </div>
        )}
        {isOwner && (
          <>
            <input type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={(e) => handleImageUpload(e, "cover")} />
            <button
              disabled={isUploadingCover}
              className="absolute top-3 right-3 py-1.5 px-4 rounded-full text-[11px] font-semibold border border-white/15 bg-black/40 backdrop-blur-md text-white/90 hover:bg-black/60 transition-all flex items-center gap-1.5 z-20 disabled:opacity-50"
              onClick={() => coverInputRef.current?.click()}
            >
              {isUploadingCover ? <Loader2 className="w-3 h-3 animate-spin" /> : <Edit className="w-3 h-3" />}
              {isUploadingCover ? "Uploading..." : "Edit cover"}
            </button>
          </>
        )}
      </div>

      {/* ── Header content ── */}
      <div className="max-w-[1400px] mx-auto px-7 relative">
        {/* Avatar + action buttons row */}
        <div className="flex items-end justify-between gap-4">
          {/* Avatar */}
          <div className="relative mt-[-50px] flex-shrink-0">
            <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-[38px] font-black text-white border-4 border-background shadow-lg relative z-10 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="tracking-tighter">{prettyName?.[0]?.toUpperCase()}{prettyName?.[1]?.toUpperCase()}</span>
              )}
              {isOwner && (
                <>
                  <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, "avatar")} />
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    {isUploadingAvatar ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Camera className="w-5 h-5 text-white" />}
                  </div>
                </>
              )}
            </div>
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
            {!isOwner && (
              <button
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-red-500/40 hover:text-red-500 transition-all ml-1"
                onClick={() => toast("Report profile feature coming soon")}
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Info section ── */}
        {isEditing ? (
          /* ════ EDIT FORM ════ */
          <div className="py-6 border-b border-border animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[820px]">

              {/* Display Name */}
              <div>
                <label className="label-xs">Display Name</label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={e => setEditForm(f => ({ ...f, displayName: e.target.value }))}
                  placeholder="Your full name"
                  maxLength={50}
                  className="edit-input"
                />
              </div>

              {/* Username */}
              <div>
                <label className="label-xs">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={e => setEditForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
                    placeholder="your_username"
                    maxLength={30}
                    className={cn(
                      "edit-input !pl-8",
                      usernameStatus === "taken" ? "border-red-500 focus:border-red-500" :
                        usernameStatus === "available" ? "border-green-500 focus:border-green-500" : ""
                    )}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                    {usernameStatus === "available" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {usernameStatus === "taken" && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
                <p className={cn("text-[10px] mt-1 font-medium",
                  usernameStatus === "taken" ? "text-red-500" :
                    usernameStatus === "available" ? "text-green-500" : "text-muted-foreground"
                )}>
                  {usernameStatus === "taken" && "Username already taken"}
                  {usernameStatus === "available" && "Username is available!"}
                  {usernameStatus === "unchanged" && "This is your current username"}
                  {(usernameStatus === "idle" || usernameStatus === "checking") && "3–30 chars, letters, numbers, underscores only"}
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="label-xs">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="City, Country"
                  maxLength={80}
                  className="edit-input"
                />
              </div>

              {/* Website */}
              <div>
                <label className="label-xs">Website</label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={e => setEditForm(f => ({ ...f, website: e.target.value }))}
                  placeholder="https://yoursite.com"
                  maxLength={120}
                  className="edit-input"
                />
              </div>

              {/* Bio — full width */}
              <div className="md:col-span-2">
                <label className="label-xs">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell visitors about yourself..."
                  maxLength={300}
                  className="edit-input resize-none h-24"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5 text-right">{editForm.bio.length}/300</p>
              </div>



              {/* Technical Skills */}
              <div className="md:col-span-2">
                <label className="label-xs">Technical Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    placeholder="e.g. React, Python, UI Design..."
                    className="edit-input flex-1"
                  />
                  <button onClick={addSkill} className="px-3 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editForm.technicalSkills.map(s => (
                    <span key={s} className="flex items-center gap-1 text-[11px] py-1 px-3 rounded-full bg-secondary border border-border text-foreground/80">
                      {s}
                      <button onClick={() => removeSkill(s)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Save button */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={usernameStatus === "taken" || usernameStatus === "checking"}
                className="py-2.5 px-7 bg-primary text-white text-[11px] font-bold rounded-full uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="py-2.5 px-5 text-[11px] font-bold rounded-full border border-border text-muted-foreground hover:bg-secondary transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* ════ VIEW MODE ════ */
          <div className="py-2">
            {/* Name + Verified Badge */}
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[22px] font-extrabold tracking-tight text-foreground">{prettyName}</h1>
              {user.verified && (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-cyan-700 dark:border-cyan-700 bg-cyan-950/50 dark:bg-cyan-950/50 text-cyan-400 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified creator
                </span>
              )}
            </div>

            {/* Handle + member since */}
            <p className="text-[12px] text-muted-foreground/80 font-medium mb-4">
              @{user.username} <span className="mx-2 opacity-40">·</span> Member since {user.memberSince}
            </p>

            {/* Bio */}
            {user.bio && (
              <p className="text-[13.5px] text-foreground/80 max-w-[700px] leading-relaxed mb-4">{user.bio}</p>
            )}

            {/* Technical Skills / Tags row */}
            {user.technicalSkills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {user.technicalSkills.map((skill: string) => (
                  <span key={skill} className="text-[12px] py-1.5 px-4 rounded-full bg-secondary dark:bg-[#201538] text-foreground/70 dark:text-[#c4b5fd] border border-border dark:border-[#3b276b]/50 shadow-sm transition-colors cursor-default font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            )}



            {/* Meta row — location, website, followers */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-muted-foreground font-medium">
              {user.location && (
                <span className="flex items-center gap-2 text-[13px]"><MapPin className="w-4 h-4 text-red-400/80" /> {user.location}</span>
              )}
              {user.website && (
                <a href={user.website.startsWith("http") ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors text-[14px]">
                  <LinkIcon className="w-3.5 h-3.5" /> {user.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              <span className="flex items-center gap-2 text-[14px]">
                <Link href={`/u/${user.username}/followers`} className="hover:text-primary transition-colors flex items-center gap-1">
                  <strong className="text-foreground font-bold hover:text-primary">{(user.followers || 0).toLocaleString()}</strong> followers
                </Link>
                <span className="opacity-30 mx-1">·</span>
                <Link href={`/u/${user.username}/following`} className="hover:text-primary transition-colors flex items-center gap-1">
                  <strong className="text-foreground font-bold hover:text-primary">{(user.following || 0).toLocaleString()}</strong> following
                </Link>
              </span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .label-xs {
          display: block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          margin-bottom: 4px;
        }
        .edit-input {
          width: 100%;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13px;
          color: var(--foreground);
          outline: none;
          transition: border-color 0.15s;
        }
        .edit-input:focus {
          border-color: hsl(var(--primary));
        }
      `}</style>
    </>
  );
}
