import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data: rpcData, error: rpcError } = await (supabase as any).rpc("execute_coin_prompt_purchase", {
      p_prompt_id: parsedBody.data.promptId,
      p_auth_user_id: user.id,
    });

    if (rpcError) {
      return NextResponse.json({ success: false, message: rpcError.message }, { status: 400 });
    }

    const rpcResult = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as { success?: boolean; message?: string } | null;

    if (!rpcResult?.success) {
      return NextResponse.json({ success: false, message: rpcResult?.message || "Purchase failed." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: rpcResult.message || "Prompt purchased successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Purchase failed." },
      { status: 500 }
    );
  }
}
