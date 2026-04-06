import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { addCoinsByPackage, addCoinsCustom } from "@/services/coin-service";

const topUpSchema = z.union([
  z.object({ packageId: z.enum(["starter", "popular", "pro"]) }),
  z.object({ coins: z.number().int().positive() }),
]);

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

    const result = "packageId" in parsedBody.data
      ? await addCoinsByPackage(supabase, parsedBody.data.packageId)
      : await addCoinsCustom(supabase, parsedBody.data.coins);

    if (!result.success) {
      const status = result.message === "Unauthorized" ? 401 : 400;
      return NextResponse.json({ success: false, message: result.message }, { status });
    }

    return NextResponse.json({ success: true, message: result.message, data: result.data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Top-up failed." },
      { status: 500 }
    );
  }
}
