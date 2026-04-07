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

/**
 * Server action to update an existing prompt.
 */
export async function updatePromptAction(id: string, data: any) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership before update
    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return { success: false, error: "Unauthorized: You do not own this prompt" };
    }

    await PromptController.updatePrompt(id, data, supabase);
    revalidatePath("/explore");
    revalidatePath("/dashboard");
    revalidatePath(`/prompt/${id}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error (updatePromptAction):", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server action to delete a prompt.
 */
export async function deletePromptAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await PromptController.deletePrompt(id, supabase);
    revalidatePath("/explore");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error (deletePromptAction):", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server action to toggle the publication status.
 */
export async function togglePromptStatusAction(id: string, isPublished: boolean) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await PromptController.togglePromptStatus(id, isPublished, supabase);
    revalidatePath("/explore");
    revalidatePath("/dashboard");
    revalidatePath(`/prompt/${id}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error (togglePromptStatusAction):", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server action to add a single prompt step.
 */
export async function addPromptStepAction(promptId: string, stepData: any) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', promptId)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const step = await PromptController.addPromptStep(promptId, stepData, supabase);
    revalidatePath(`/prompt/${promptId}`);
    
    return { success: true, step };
  } catch (error: any) {
    console.error("Server Action Error (addPromptStepAction):", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server action to reorder multiple prompt steps.
 */
export async function reorderPromptStepsAction(promptId: string, updates: { id: number, step_number: number }[]) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', promptId)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await PromptController.reorderPromptSteps(promptId, updates, supabase);
    revalidatePath(`/prompt/${promptId}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error (reorderPromptStepsAction):", error);
    return { success: false, error: error.message };
  }
}
