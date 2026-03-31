"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function purchasePromptWithCoins(promptId: string) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // No-op in server action context.
            }
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Please sign in to continue.");
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc("execute_coin_prompt_purchase", {
      p_prompt_id: promptId,
      p_auth_user_id: user.id,
    });

    if (rpcError) {
      throw new Error(`Failed to create purchase record: ${rpcError.message}`);
    }

    const rpcResult = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as
      | { success?: boolean; message?: string }
      | null;

    if (!rpcResult?.success) {
      return {
        success: false,
        message: rpcResult?.message || "Purchase failed.",
      };
    }

    revalidatePath(`/prompt/${promptId}`);
    revalidatePath("/wallet");
    revalidatePath("/purchased");

    return { success: true, message: rpcResult.message || "Prompt purchased successfully!" };

  } catch (error: any) {
    console.error("Purchase failed:", error);
    return { success: false, message: error.message || "An unexpected error occurred during purchase." };
  }
}
