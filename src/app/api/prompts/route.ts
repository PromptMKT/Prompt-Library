import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized: Please sign in to publish." }, { status: 401 });
    }

    const data = await request.json();

    const {
      title, tagline, price, category, subCategory, platform,
      selectedModels, coverUrl, screenshotUrls, promptFileUrls,
      inputNeeds, inputData, targetAudience, outputFormat,
      verifiedDate, quickSetup, guideSteps, fillVariables,
      whatToExpect, proTips, commonMistakes, howToAdapt,
      complexity, tags, sellerNote, promptTab,
      systemText, promptText, chainSteps, useCaseId
    } = data;

    const isMultiStep = promptTab === 'chain';
    const stepCount = isMultiStep && chainSteps ? chainSteps.length : 1;

    // 1. Prepare main prompt object
    const promptInsert = {
      creator_id: user.id,
      title,
      tagline: tagline || title,
      description: tagline || title,
      price: parseInt(price) || 0,
      category_id: category || null,
      subcategory_id: (subCategory && !isNaN(parseInt(subCategory))) ? parseInt(subCategory) : null,
      use_case_id: (useCaseId && !isNaN(parseInt(useCaseId))) ? parseInt(useCaseId) : null,
      platform_id: platform || null,
      model_id: selectedModels && selectedModels.length > 0 ? selectedModels[0] : null,
      cover_image_url: coverUrl,
      is_published: true,
      is_multi_step: isMultiStep,
      step_count: stepCount,
      cover_image_provider: 'cloudinary',
      input_types: (inputNeeds || []).filter((n: string) => n !== 'none'),
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
      seller_note: sellerNote
    };

    // Transaction equivalent using standard Supabase inserts (sequential)
    const { data: newPrompt, error: promptError } = await supabase
      .from('prompts')
      .insert(promptInsert)
      .select('id')
      .single();

    if (promptError) throw promptError;

    const promptId = newPrompt.id;

    // 2. Prepare & Insert Steps
    let stepsToInsert = [];
    if (isMultiStep && chainSteps) {
      stepsToInsert = chainSteps.map((s: any, idx: number) => ({
        prompt_id: promptId,
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
        prompt_id: promptId,
        step_number: 1,
        title: 'Main Prompt',
        instruction: instruction || "",
        step_type: 'prompt'
      }];
    }

    if (stepsToInsert.length > 0) {
      const { error: stepsError } = await supabase.from('prompt_steps').insert(stepsToInsert);
      if (stepsError) throw stepsError;
    }

    // 3. Prepare & Insert Images
    if (screenshotUrls && screenshotUrls.length > 0) {
      const imagesToInsert = screenshotUrls.map((url: string, idx: number) => ({
        prompt_id: promptId,
        image_url: url,
        provider: 'cloudinary',
        sort_order: idx + 1
      }));
      const { error: imgError } = await supabase.from('prompt_images').insert(imagesToInsert);
      if (imgError) throw imgError;
    }

    // 4. Prepare & Insert Models
    if (selectedModels && selectedModels.length > 0) {
      const modelsToInsert = selectedModels.map((mId: number) => ({
        prompt_id: promptId,
        model_id: mId,
        platform_id: platform
      }));
      const { error: modError } = await supabase.from('prompt_models').insert(modelsToInsert);
      if (modError) throw modError;
    }

    return NextResponse.json({ success: true, promptId });

  } catch (error: any) {
    console.error("POST /api/prompts error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
