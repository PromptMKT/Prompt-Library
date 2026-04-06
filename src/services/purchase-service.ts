import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type { ServiceResult } from "@/types/coin";

type AppSupabaseClient = SupabaseClient<Database>;

type UserContext = {
  authUserId: string;
  profileId: string;
};

type PurchaseHistoryItem = {
  id: string;
  purchased_at: string;
  amount_paid: number;
  prompts: {
    id: string;
    title: string | null;
    cover_image_url: string | null;
    platforms: { name: string | null } | null;
    users: { username: string | null } | null;
  } | null;
};

async function getAuthenticatedUserContext(supabase: AppSupabaseClient): Promise<ServiceResult<UserContext>> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "Unauthorized" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile?.id) {
    return { success: false, message: "User profile not found." };
  }

  return {
    success: true,
    data: {
      authUserId: user.id,
      profileId: profile.id,
    },
  };
}

export async function createPurchase(
  supabase: AppSupabaseClient,
  promptId: string
): Promise<ServiceResult<null>> {
  const context = await getAuthenticatedUserContext(supabase);
  if (!context.success || !context.data) {
    return { success: false, message: context.message };
  }

  const { data: rpcData, error: rpcError } = await supabase.rpc("execute_coin_prompt_purchase", {
    p_prompt_id: promptId,
    p_auth_user_id: context.data.authUserId,
  });

  if (rpcError) {
    return { success: false, message: rpcError.message };
  }

  const rpcResult = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as
    | { success?: boolean; message?: string }
    | null;

  if (!rpcResult?.success) {
    return { success: false, message: rpcResult?.message || "Purchase failed." };
  }

  return { success: true, message: rpcResult.message || "Prompt purchased successfully." };
}

export async function getPurchaseHistory(
  supabase: AppSupabaseClient
): Promise<ServiceResult<PurchaseHistoryItem[]>> {
  const context = await getAuthenticatedUserContext(supabase);
  if (!context.success || !context.data) {
    return { success: false, message: context.message };
  }

  const { data, error } = await supabase
    .from("purchases")
    .select(`
      id,
      purchased_at,
      amount_paid,
      prompts (
        id,
        title,
        cover_image_url,
        platforms (name),
        users!prompts_creator_id_fkey (username)
      )
    `)
    .eq("user_id", context.data.profileId)
    .eq("status", "completed")
    .order("purchased_at", { ascending: false });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: (data ?? []) as PurchaseHistoryItem[] };
}

export async function hasPurchasedPrompt(
  supabase: AppSupabaseClient,
  promptId: string
): Promise<ServiceResult<{ purchased: boolean }>> {
  const context = await getAuthenticatedUserContext(supabase);
  if (!context.success || !context.data) {
    return { success: false, message: context.message };
  }

  const { data, error } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", context.data.profileId)
    .eq("prompt_id", promptId)
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: { purchased: !!data } };
}
