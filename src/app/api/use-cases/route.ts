import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized: Please sign in." }, { status: 401 });
    }

    const payloadBody = await request.json();
    const { name, categoryId, subcategoryId } = payloadBody;

    if (!name || name.trim() === "") {
      return NextResponse.json({ success: false, error: "Use Case name cannot be empty." }, { status: 400 });
    }

    const payload: any = {
      name: name.trim(),
      is_custom: true
    };
    if (categoryId) payload.category_id = categoryId;
    if (subcategoryId) payload.subcategory_id = subcategoryId;

    const { data, error } = await supabase
      .from('use_cases')
      .insert(payload)
      .select('id, name')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Create Use Case Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
