import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTransactionHistory, getWalletBalance } from "@/services/coin-service";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 200;

    const supabase = await createServerSupabaseClient();
    const [balanceResult, transactionsResult] = await Promise.all([
      getWalletBalance(supabase),
      getTransactionHistory(supabase, Number.isFinite(limit) ? limit : 200),
    ]);

    if (!balanceResult.success || !transactionsResult.success) {
      const message = balanceResult.message || transactionsResult.message || "Failed to fetch wallet overview.";
      const status = message === "Unauthorized" ? 401 : 400;
      return NextResponse.json({ success: false, message }, { status });
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: balanceResult.data,
        transactions: transactionsResult.data,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error, "Failed to fetch wallet overview.") },
      { status: 500 }
    );
  }
}
