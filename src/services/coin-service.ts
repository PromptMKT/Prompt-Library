import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type { ServiceResult, TopUpPackageId, WalletSummary, WalletTransaction } from "@/types/coin";

type AppSupabaseClient = SupabaseClient<Database>;

type UserContext = {
  authUserId: string;
  profileId: string;
};

const TOP_UP_PACKAGES: Record<TopUpPackageId, { coins: number; rupees: number; label: string }> = {
  starter: { coins: 100, rupees: 89, label: "Starter pack" },
  popular: { coins: 500, rupees: 399, label: "Popular pack" },
  pro: { coins: 1200, rupees: 849, label: "Pro pack" },
};

async function callCustomRpc<TArgs extends Record<string, unknown>>(
  supabase: AppSupabaseClient,
  rpcName: string,
  args: TArgs
) {
  return (supabase as any).rpc(rpcName, args) as Promise<{ data: unknown; error: { message: string } | null }>;
}

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

export async function getWalletBalance(supabase: AppSupabaseClient): Promise<ServiceResult<WalletSummary>> {
  const context = await getAuthenticatedUserContext(supabase);
  if (!context.success || !context.data) {
    return { success: false, message: context.message };
  }

  const { data, error } = await supabase
    .from("coin_transactions")
    .select("amount")
    .eq("user_id", context.data.profileId);

  if (error) {
    return { success: false, message: error.message };
  }

  const transactions = data ?? [];
  const totalEarned = transactions.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = transactions.filter((item) => item.amount < 0).reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const balance = totalEarned - totalSpent;

  return {
    success: true,
    data: {
      balance,
      totalEarned,
      totalSpent,
    },
  };
}

export async function getTransactionHistory(
  supabase: AppSupabaseClient,
  limit = 100
): Promise<ServiceResult<WalletTransaction[]>> {
  const context = await getAuthenticatedUserContext(supabase);
  if (!context.success || !context.data) {
    return { success: false, message: context.message };
  }

  const { data, error } = await supabase
    .from("coin_transactions")
    .select("id, transaction_type, amount, description, created_at")
    .eq("user_id", context.data.profileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { success: false, message: error.message };
  }

  const transactions: WalletTransaction[] = (data ?? []).map((item) => ({
    id: item.id,
    transactionType: item.transaction_type,
    amount: item.amount,
    description: item.description,
    createdAt: item.created_at,
  }));

  return { success: true, data: transactions };
}

export async function addCoinsByPackage(
  supabase: AppSupabaseClient,
  packageId: TopUpPackageId
): Promise<ServiceResult<{ coins: number }>> {
  const context = await getAuthenticatedUserContext(supabase);
  if (!context.success || !context.data) {
    return { success: false, message: context.message };
  }

  const selectedPackage = TOP_UP_PACKAGES[packageId];
  if (!selectedPackage) {
    return { success: false, message: "Invalid top-up package selected." };
  }

  const { data: rpcData, error: rpcError } = await callCustomRpc(supabase, "execute_coin_topup", {
    p_package_id: packageId,
    p_auth_user_id: context.data.authUserId,
  });

  if (rpcError) {
    return { success: false, message: rpcError.message };
  }

  const rpcResult = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as
    | { success?: boolean; message?: string }
    | null;

  if (!rpcResult?.success) {
    return { success: false, message: rpcResult?.message || "Top-up failed." };
  }

  return {
    success: true,
    message: rpcResult.message || `${selectedPackage.coins} coins added successfully!`,
    data: { coins: selectedPackage.coins },
  };
}

export async function addCoinsCustom(
  supabase: AppSupabaseClient,
  coins: number
): Promise<ServiceResult<{ coins: number }>> {
  const context = await getAuthenticatedUserContext(supabase);
  if (!context.success || !context.data) {
    return { success: false, message: context.message };
  }

  const normalizedCoins = Math.floor(coins);
  if (!Number.isFinite(normalizedCoins) || normalizedCoins <= 0) {
    return { success: false, message: "Please enter a valid coin amount." };
  }

  const { data: rpcData, error: rpcError } = await callCustomRpc(supabase, "execute_coin_topup_custom", {
    p_coins: normalizedCoins,
    p_auth_user_id: context.data.authUserId,
  });

  if (rpcError) {
    return { success: false, message: rpcError.message };
  }

  const rpcResult = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as
    | { success?: boolean; message?: string }
    | null;

  if (!rpcResult?.success) {
    return { success: false, message: rpcResult?.message || "Top-up failed." };
  }

  return {
    success: true,
    message: rpcResult.message || `${normalizedCoins} coins added successfully!`,
    data: { coins: normalizedCoins },
  };
}
