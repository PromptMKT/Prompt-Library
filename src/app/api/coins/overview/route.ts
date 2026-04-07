import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 200;

    const supabase = await createServerSupabaseClient();
    
    // Auth context
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || !profile?.id) {
      return NextResponse.json({ success: false, message: "User profile not found." }, { status: 404 });
    }

    // 1. Get Wallet Balance
    const { data: balData, error: balError } = await supabase
      .from("coin_transactions")
      .select("amount")
      .eq("user_id", profile.id);

    if (balError) {
      return NextResponse.json({ success: false, message: balError.message }, { status: 400 });
    }

    const balTransactions = balData ?? [];
    const totalEarned = balTransactions.filter(item => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
    const totalSpent = balTransactions.filter(item => item.amount < 0).reduce((sum, item) => sum + Math.abs(item.amount), 0);
    const balance = totalEarned - totalSpent;

    // 2. Get Transaction History
    const { data: txData, error: txError } = await supabase
      .from("coin_transactions")
      .select("id, transaction_type, amount, description, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(Number.isFinite(limit) ? limit : 200);

    if (txError) {
      return NextResponse.json({ success: false, message: txError.message }, { status: 400 });
    }

    const transactions = (txData ?? []).map(item => ({
      id: item.id,
      transactionType: item.transaction_type,
      amount: item.amount,
      description: item.description,
      createdAt: item.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: {
        summary: { balance, totalEarned, totalSpent },
        transactions,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch wallet overview." },
      { status: 500 }
    );
  }
}
