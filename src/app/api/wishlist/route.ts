import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ promptIds: [] });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select('prompt_id')
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ promptIds: [] });
    }

    return NextResponse.json({ promptIds: data.map((item: any) => item.prompt_id) });
  } catch {
    return NextResponse.json({ promptIds: [] });
  }
}
