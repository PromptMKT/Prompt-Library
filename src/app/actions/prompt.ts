"use server";

import { revalidatePath } from "next/cache";
import { PromptService } from "@/lib/services/PromptService";
import { createClient } from "@/lib/supabase/server";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildPromptData(data: any) {
  const {
    title, tagline, price, category, subCategory, platform,
    selectedModels, coverUrl, screenshotUrls, promptFileUrls,
    inputNeeds, inputData, targetAudience, outputFormat,
    verifiedDate, quickSetup, guideSteps, fillVariables,
    whatToExpect, proTips, commonMistakes, howToAdapt,
    complexity, tags, sellerNote, creatorId, promptTab,
    systemText, promptText, chainSteps
  } = data;

  const isMultiStep = promptTab === 'chain';
  const stepCount = isMultiStep ? chainSteps.length : 1;

  const promptData = {
    title,
    tagline: tagline || title,
    description: tagline || title,
    price: parseInt(price) || 0,
    category_id: category || null,
    subcategory_id: (subCategory && !isNaN(parseInt(subCategory))) ? parseInt(subCategory) : null,
    use_case_id: (data.useCaseId && !isNaN(parseInt(data.useCaseId))) ? parseInt(data.useCaseId) : null,
    platform_id: platform || null,
    model_id: selectedModels?.length > 0 ? selectedModels[0] : null,
    cover_image_url: coverUrl,
    is_multi_step: isMultiStep,
    step_count: stepCount,
    input_types: inputNeeds?.filter((n: string) => n !== 'none'),
    input_data: inputData,
    prompt_file_urls: promptFileUrls,
    target_audience: targetAudience,
    output_format: outputFormat,
    verified_at: verifiedDate || null,
    quick_setup: quickSetup,
    guide_steps: guideSteps,
    fill_variables: fillVariables,
    what_to_expect: whatToExpect,
    pro_tips: proTips,
    common_mistakes: commonMistakes,
    how_to_adapt: howToAdapt,
    complexity,
    tags,
    seller_note: sellerNote,
    creator_id: creatorId,
  };

  let stepsToInsert: any[] = [];
  if (isMultiStep) {
    stepsToInsert = chainSteps.map((s: any, idx: number) => ({
      step_number: idx + 1,
      title: `Step ${idx + 1}`,
      instruction: s.text,
      step_type: 'prompt'
    }));
  } else {
    const instruction = promptTab === 'system'
      ? `System: ${systemText}\n\nUser: ${promptText}`
      : promptText;
    stepsToInsert = [{
      step_number: 1,
      title: 'Main Prompt',
      instruction: instruction,
      step_type: 'prompt'
    }];
  }

  const modelsToInsert = (selectedModels || []).map((mId: number) => ({
    model_id: mId,
    platform_id: platform
  }));

  const imagesToInsert = (screenshotUrls || []).map((url: string, idx: number) => ({
    image_url: url,
    sort_order: idx
  }));

  return { promptData, stepsToInsert, modelsToInsert, imagesToInsert };
}

// ─── Server Actions ────────────────────────────────────────────────────────────

/**
 * Server action to publish a new prompt.
 */
export async function publishPromptAction(data: any) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized: Please sign in to publish." };
    }

    const sanitizedData = { ...data, creatorId: user.id };
    const { promptData, stepsToInsert, modelsToInsert, imagesToInsert } = buildPromptData(sanitizedData);

    const prompt = await PromptService.createPrompt(promptData, {
      steps: stepsToInsert,
      images: imagesToInsert,
      models: modelsToInsert
    }, supabase);

    if (prompt) {
      revalidatePath("/explore");
      revalidatePath("/dashboard");
      return { success: true, promptId: prompt.id };
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

    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return { success: false, error: "Unauthorized: You do not own this prompt" };
    }

    const { promptData, stepsToInsert, modelsToInsert } = buildPromptData({ ...data, creatorId: user.id });

    await PromptService.updateFullPrompt(id, promptData, {
      steps: stepsToInsert,
      images: [],
      models: modelsToInsert
    }, supabase);

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

    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await PromptService.deletePrompt(id, supabase);
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

    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await PromptService.togglePromptStatus(id, isPublished, supabase);
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

    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', promptId)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const step = await PromptService.addPromptStep(promptId, stepData, supabase);
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

    const { data: existing } = await supabase
      .from('prompts')
      .select('creator_id')
      .eq('id', promptId)
      .single();

    if (!existing || existing.creator_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await PromptService.reorderPromptSteps(promptId, updates, supabase);
    revalidatePath(`/prompt/${promptId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error (reorderPromptStepsAction):", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server action to dynamically create a custom use case during upload.
 */
export async function createCustomUseCaseAction(name: string, categoryId?: string, subcategoryId?: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized: Please sign in." };
    }

    if (!name || name.trim() === "") {
      return { success: false, error: "Use Case name cannot be empty." };
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

    if (error) {
      console.error("Failed to insert use case:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Create Use Case Error:", error);
    return { success: false, error: error.message || "Failed to create use case" };
  }
}
