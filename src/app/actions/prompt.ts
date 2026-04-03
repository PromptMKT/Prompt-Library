"use server";

import { revalidatePath } from "next/cache";
import { PromptController } from "@/backend/controllers/PromptController";
import { createClient } from "@/lib/supabase/server";

/**
 * Server action to publish a new prompt.
 * This encapsulates the database orchestration and revalidates the explore cache.
 */
export async function publishPromptAction(data: any) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized: Please sign in to publish." };
    }

    // Force the creatorId to be the authenticated user's ID
    const sanitizedData = {
      ...data,
      creatorId: user.id
    };

    const promptData = await PromptController.publishPrompt(sanitizedData, supabase);
    
    if (promptData) {
      // Revalidate paths to reflect new data
      revalidatePath("/explore");
      revalidatePath("/dashboard");
      return { success: true, promptId: promptData.id };
    }
    
    return { success: false, error: "Failed to publish prompt" };
  } catch (error: any) {
    console.error("Server Action Error (publishPromptAction):", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}
