"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Search } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface ListUser {
    id: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
}

interface UserListPageProps {
    type: "followers" | "following";
}

export default function UserListPage({ type }: UserListPageProps) {
    const params = useParams<{ username: string }>();
    const router = useRouter();
    const { profile } = useAuth();

    const [profileUser, setProfileUser] = useState<{ id: string; username: string; display_name: string | null } | null>(null);
    const [users, setUsers] = useState<ListUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/user/${params.username}/network?type=${type}`);
                const json = await res.json();
                if (res.ok && json.success) {
                    setProfileUser(json.data.profileUser);
                    setUsers(json.data.users);
                } else {
                    console.error("Failed to load network:", json.error);
                }
            } catch (err) {
                console.error("Error fetching network:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [params.username, type]);

    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        return (
            u.username?.toLowerCase().includes(q) ||
            u.display_name?.toLowerCase().includes(q) ||
            u.bio?.toLowerCase().includes(q)
        );
    });

    const title = type === "followers" ? "Followers" : "Following";
    const profileName = profileUser?.display_name || profileUser?.username || params.username;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h1 className="text-[15px] font-bold text-foreground">{profileName}</h1>
                        <p className="text-[12px] text-muted-foreground">{title}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search ${title.toLowerCase()}...`}
                        className="w-full bg-secondary border border-border rounded-2xl pl-10 pr-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                    />
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-32 bg-muted rounded-full" />
                                    <div className="h-2.5 w-48 bg-muted rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                            <Users className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <p className="text-[15px] font-semibold text-foreground mb-1">
                            {search ? "No results found" : `No ${title.toLowerCase()} yet`}
                        </p>
                        <p className="text-[13px] text-muted-foreground">
                            {search
                                ? "Try a different search term"
                                : type === "followers"
                                    ? `${profileName} doesn't have any followers yet.`
                                    : `${profileName} isn't following anyone yet.`}
                        </p>
                    </div>
                )}

                {/* User list */}
                {!loading && filtered.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-[12px] font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                            {filtered.length} {title}
                        </p>
                        {filtered.map((u) => {
                            const displayName = u.display_name || u.username;
                            const initials = displayName?.slice(0, 2).toUpperCase() ?? "??";

                            return (
                                <Link
                                    key={u.id}
                                    href={`/u/${u.username}`}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:bg-secondary/60 hover:border-primary/20 transition-all group cursor-pointer"
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-[15px] flex-shrink-0 overflow-hidden shadow-sm">
                                        {u.avatar_url ? (
                                            <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{initials}</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                                {displayName}
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-muted-foreground mb-1">@{u.username}</p>
                                        {u.bio && (
                                            <p className="text-[12px] text-muted-foreground/70 truncate">{u.bio}</p>
                                        )}
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex-shrink-0 text-muted-foreground/40 group-hover:text-primary/60 transition-colors text-[18px] leading-none">
                                        →
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
