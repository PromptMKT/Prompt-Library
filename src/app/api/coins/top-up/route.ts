import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const topUpSchema = z.union([
  z.object({ packageId: z.enum(["starter", "popular", "pro"]) }),
  z.object({ coins: z.number().int().positive() }),
]);

const TOP_UP_PACKAGES: Record<string, { coins: number; rupees: number; label: string }> = {
  starter: { coins: 100, rupees: 89, label: "Starter pack" },
  popular: { coins: 500, rupees: 399, label: "Popular pack" },
  pro: { coins: 1200, rupees: 849, label: "Pro pack" },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = topUpSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Logic to add coins
    if ("packageId" in parsedBody.data) {
      const packageId = parsedBody.data.packageId;
      const selectedPackage = TOP_UP_PACKAGES[packageId];
      if (!selectedPackage) {
        return NextResponse.json({ success: false, message: "Invalid top-up package selected." }, { status: 400 });
      }

      const { data: rpcData, error: rpcError } = await (supabase as any).rpc("execute_coin_topup", {
        p_package_id: packageId,
        p_auth_user_id: user.id,
      });

      if (rpcError) {
        return NextResponse.json({ success: false, message: rpcError.message }, { status: 400 });
      }

      const rpcResult = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as { success?: boolean; message?: string } | null;

      if (!rpcResult?.success) {
        return NextResponse.json({ success: false, message: rpcResult?.message || "Top-up failed." }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: rpcResult.message || `${selectedPackage.coins} coins added successfully!`,
        data: { coins: selectedPackage.coins },
      });
      
    } else {
      const coins = parsedBody.data.coins;
      const normalizedCoins = Math.floor(coins);
      if (!Number.isFinite(normalizedCoins) || normalizedCoins <= 0) {
        return NextResponse.json({ success: false, message: "Please enter a valid coin amount." }, { status: 400 });
      }

      const { data: rpcData, error: rpcError } = await (supabase as any).rpc("execute_coin_topup_custom", {
        p_coins: normalizedCoins,
        p_auth_user_id: user.id,
      });

      if (rpcError) {
         return NextResponse.json({ success: false, message: rpcError.message }, { status: 400 });
      }

      const rpcResult = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as { success?: boolean; message?: string } | null;

      if (!rpcResult?.success) {
        return NextResponse.json({ success: false, message: rpcResult?.message || "Top-up failed." }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: rpcResult.message || `${normalizedCoins} coins added successfully!`,
        data: { coins: normalizedCoins },
      });
    }

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Top-up failed." },
      { status: 500 }
    );
  }
}
