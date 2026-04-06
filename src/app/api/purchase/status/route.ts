import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasPurchasedPrompt } from "@/services/purchase-service";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function GET(request: NextRequest) {
  try {
    const promptId = request.nextUrl.searchParams.get("promptId");
    if (!promptId) {
      return NextResponse.json({ success: false, message: "promptId is required." }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const result = await hasPurchasedPrompt(supabase, promptId);

    if (!result.success) {
      const status = result.message === "Unauthorized" ? 401 : 400;
      return NextResponse.json({ success: false, message: result.message }, { status });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error, "Failed to check purchase status.") },
      { status: 500 }
    );
  }
}
