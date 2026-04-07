import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user securely on the server
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile id
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    const creatorId = profile?.id || user.id;

    // Parse request body
    const body = await request.json();
    
    const {
      title,
      tagline,
      price,
      category,
      subCategory,
      platform,
      selectedModels,
      selectedUseCase,
      coverUrl,
      promptTab,
      chainSteps,
      systemText,
      promptText,
      screenshotUrls,
      promptFileUrls,
      inputNeeds,
      inputData,
      targetAudience,
      outputFormat,
      verifiedDate,
      quickSetup,
      guideSteps,
      fillVariables,
      whatToExpect,
      proTips,
      commonMistakes,
      howToAdapt,
      complexity,
      tags,
      sellerNote
    } = body;

    const isMultiStep = promptTab === 'chain';
    const stepCount = isMultiStep ? chainSteps.length : 1;

    let finalUseCaseId: number | null = null;

    if (selectedUseCase && subCategory) {
      // Try to find existing
      const { data: existingUC } = await supabase
        .from('use_cases')
        .select('id')
        .eq('subcategory_id', subCategory)
        .eq('name', selectedUseCase)
        .maybeSingle();

      if (existingUC) {
        finalUseCaseId = existingUC.id;
      } else {
        // Create new
        const { data: newUC, error: ucError } = await supabase
          .from('use_cases')
          .insert([{
            name: selectedUseCase,
            category_id: category,
            subcategory_id: subCategory,
            is_custom: true
          }])
          .select('id')
          .single();
        
        if (newUC) {
          finalUseCaseId = newUC.id;
        } else {
          console.warn("Failed to create new use case:", ucError);
        }
      }
    }

    const promptInsert = {
      creator_id: creatorId,
      title,
      tagline: tagline || title,
      description: tagline || title,
      price: parseInt(price),
      category_id: category || null,
      subcategory_id: subCategory ? parseInt(subCategory) : null,
      platform_id: platform || null,
      model_id: selectedModels.length > 0 ? selectedModels[0] : null,
      cover_image_url: coverUrl,
      is_published: true,
      is_multi_step: isMultiStep,
      step_count: stepCount,
      cover_image_provider: 'cloudinary',
      input_types: inputNeeds.filter((n: string) => n !== 'none'),
      input_data: inputData,
      prompt_file_urls: promptFileUrls,
      target_audience: targetAudience,
      output_format: outputFormat,
      use_case_id: finalUseCaseId,
      verified_at: verifiedDate ? new Date().toISOString() : null,
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

    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .insert([promptInsert])
      .select('*')
      .single();

    if (promptError) {
      return NextResponse.json({ error: promptError.message, details: promptError.details || 'None', hint: promptError.hint || 'None' }, { status: 400 });
    }

    const promptId = (promptData as any).promptid || promptData.id;

    // Insert Prompt Steps
    if (isMultiStep) {
      const stepsToInsert = chainSteps.map((s: any, idx: number) => ({
        prompt_id: promptId,
        step_number: idx + 1,
        title: `Step ${idx + 1}`,
        instruction: s.text,
        step_type: 'prompt'
      }));
      const { error: stepsError } = await supabase.from('prompt_steps').insert(stepsToInsert);
      if (stepsError) throw stepsError;
    } else {
      const instruction = promptTab === 'system' 
        ? `System: ${systemText}\n\nUser: ${promptText}`
        : promptText;
        
      const { error: stepError } = await supabase.from('prompt_steps').insert([{
        prompt_id: promptId,
        step_number: 1,
        title: 'Main Prompt',
        instruction: instruction,
        step_type: 'prompt'
      }]);
      if (stepError) throw stepError;
    }

    // Insert Prompt Images
    if (screenshotUrls && screenshotUrls.length > 0) {
      const imagesToInsert = screenshotUrls.map((url: string, idx: number) => ({
        prompt_id: promptId,
        image_url: url,
        provider: 'cloudinary',
        sort_order: idx + 1
      }));
      const { error: imagesError } = await supabase.from('prompt_images').insert(imagesToInsert);
      if (imagesError) throw imagesError;
    }

    // Insert Prompt Models
    if (selectedModels && selectedModels.length > 0) {
      const modelsToInsert = selectedModels.map((mId: string) => ({
        prompt_id: promptId,
        model_id: mId,
        platform_id: platform
      }));
      const { error: modelsError } = await supabase.from('prompt_models').insert(modelsToInsert);
      if (modelsError) throw modelsError;
    }

    return NextResponse.json({ success: true, promptId });

  } catch (error: any) {
    console.error("Server API Error publishing:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}