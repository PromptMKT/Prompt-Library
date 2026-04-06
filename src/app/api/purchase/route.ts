import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createPurchase } from "@/services/purchase-service";

const purchaseSchema = z.object({
  promptId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = purchaseSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const result = await createPurchase(supabase, parsedBody.data.promptId);

    if (!result.success) {
      const status = result.message === "Unauthorized" ? 401 : 400;
      return NextResponse.json({ success: false, message: result.message }, { status });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Purchase failed." },
      { status: 500 }
    );
  }
}
