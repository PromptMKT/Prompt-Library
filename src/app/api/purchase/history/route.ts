import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPurchaseHistory } from "@/services/purchase-service";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const result = await getPurchaseHistory(supabase);

    if (!result.success) {
      const status = result.message === "Unauthorized" ? 401 : 400;
      return NextResponse.json({ success: false, message: result.message }, { status });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error, "Failed to fetch purchase history.") },
      { status: 500 }
    );
  }
}
