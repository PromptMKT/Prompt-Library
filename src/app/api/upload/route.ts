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
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    const creatorId = profile?.id || user.id;

    // Parse request body
    const body = await request.json();
    
    const {
      title, tagline, price, category, subCategory, platform,
      selectedModels, coverUrl, screenshotUrls, promptFileUrls,
      inputNeeds, inputData, targetAudience, outputFormat,
      verifiedDate, quickSetup, guideSteps, fillVariables,
      whatToExpect, proTips, commonMistakes, howToAdapt,
      complexity, tags, sellerNote, promptTab,
      systemText, promptText, chainSteps, useCaseId, selectedUseCase
    } = body;

    const isMultiStep = promptTab === 'chain';
    const stepCount = isMultiStep ? chainSteps?.length : 1;

    let finalUseCaseId = (useCaseId && !isNaN(parseInt(useCaseId))) ? parseInt(useCaseId) : null;

    // Handle Use Case Auto-creation (Legacy main-2 style)
    if (!finalUseCaseId && selectedUseCase && subCategory) {
      const { data: existingUC } = await supabase
        .from('use_cases')
        .select('id')
        .eq('subcategory_id', subCategory)
        .eq('name', selectedUseCase)
        .maybeSingle();

      if (existingUC) {
        finalUseCaseId = existingUC.id;
      } else {
        const { data: newUC } = await supabase
          .from('use_cases')
          .insert([{
            name: selectedUseCase,
            category_id: category,
            subcategory_id: subCategory,
            is_custom: true
          }])
          .select('id')
          .single();
        if (newUC) finalUseCaseId = newUC.id;
      }
    }

    const promptInsert = {
      creator_id: creatorId,
      title,
      tagline: tagline || title,
      description: tagline || title,
      price: parseInt(price) || 0,
      category_id: category || null,
      subcategory_id: (subCategory && !isNaN(parseInt(subCategory))) ? parseInt(subCategory) : null,
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
      use_case_id: finalUseCaseId,
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

    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .insert([promptInsert])
      .select('*')
      .single();

    if (promptError) return NextResponse.json({ error: promptError.message }, { status: 400 });

    const promptId = promptData.id;

    // Insert Steps
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
    await supabase.from('prompt_steps').insert(stepsToInsert);

    // Insert Images
    if (screenshotUrls && screenshotUrls.length > 0) {
      const imagesToInsert = screenshotUrls.map((url: string, idx: number) => ({
        prompt_id: promptId,
        image_url: url,
        provider: 'cloudinary',
        sort_order: idx + 1
      }));
      await supabase.from('prompt_images').insert(imagesToInsert);
    }

    // Insert Models
    if (selectedModels && selectedModels.length > 0) {
      const modelsToInsert = selectedModels.map((mId: number) => ({
        prompt_id: promptId,
        model_id: mId,
        platform_id: platform
      }));
      await supabase.from('prompt_models').insert(modelsToInsert);
    }

    return NextResponse.json({ success: true, promptId });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    
    // Check ownership
    const { data: existing } = await supabase.from('prompts').select('creator_id').eq('id', id).single();
    if (!existing || existing.creator_id !== user.id) {
       // Check if creator_id matches auth_user_id (legacy fallback)
       const { data: profile } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();
       if (!profile || existing?.creator_id !== profile.id) {
         return NextResponse.json({ error: "Unauthorized: You do not own this prompt" }, { status: 403 });
       }
    }

    // Map frontend camelCase to backend snake_case if necessary, 
    // but the current update logic expects the raw object or needs careful mapping.
    // In sid_main2, we were passing the mapped object.
    
    const updateData: any = {
      title: data.title,
      tagline: data.tagline,
      price: parseInt(data.price),
      category_id: data.category,
      subcategory_id: data.subCategory ? parseInt(data.subCategory) : null,
      use_case_id: data.useCaseId ? parseInt(data.useCaseId) : null,
      platform_id: data.platform,
      cover_image_url: data.coverUrl,
      input_types: data.inputNeeds,
      input_data: data.inputData,
      target_audience: data.targetAudience,
      output_format: data.outputFormat,
      quick_setup: data.quickSetup,
      guide_steps: data.guideSteps,
      fill_variables: data.fillVariables,
      what_to_expect: data.whatToExpect,
      pro_tips: data.proTips,
      common_mistakes: data.commonMistakes,
      how_to_adapt: data.how_to_adapt,
      complexity: data.complexity,
      tags: data.tags,
      seller_note: data.sellerNote
    };

    const { error } = await supabase.from('prompts').update(updateData).eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}