import { supabase } from "@/lib/supabase";

export class PromptService {
  /**
   * Fetch all published prompts.
   */
  static async getAllPrompts(limit: number = 100, client?: any) {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("prompts")
      .select(`
        id, title, description, price, cover_image_url, created_at,
        purchases_count, average_rating, creator_id, views_count,
        platforms!prompts_platform_id_fkey(name),
        categories!prompts_category_id_fkey(name),
        users!prompts_creator_id_fkey(username, email, avatar_url)
      `)
      .eq("is_published", true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Fetch a single prompt by its ID with all related information.
   */
  static async getPromptById(id: string, client?: any) {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("prompts")
      .select(`
        *,
        platforms!prompts_platform_id_fkey(name),
        categories!prompts_category_id_fkey(name),
        subcategories!prompts_subcategory_id_fkey(name),
        use_cases!prompts_use_case_id_fkey(name),
        models!prompts_model_id_fkey(name),
        prompt_steps!prompt_steps_prompt_id_fkey(id, step_number, title, instruction, step_type),
        prompt_images!prompt_images_prompt_id_fkey(image_url, sort_order),
        reviews!reviews_prompt_id_fkey(*)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Fetch related prompts for a given prompt (e.g., in the same category).
   */
  static async getRelatedPrompts(limit: number = 4, client?: any) {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("prompts")
      .select(`
        id, title, description, price, cover_image_url, created_at,
        platforms!prompts_platform_id_fkey(name),
        categories!prompts_category_id_fkey(name),
        users!prompts_creator_id_fkey(display_name, username)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Fetch the count of published prompts by a specific creator.
   */
  static async getSellerPromptCount(creatorId: string, client?: any) {
    const supabaseClient = client || supabase;
    const { count, error } = await supabaseClient
      .from("prompts")
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creatorId)
      .eq('is_published', true);

    if (error) throw error;
    return count;
  }

  /**
   * Fetch a comprehensive dataset for the explore page.
   */
  static async getExploreData(limit: number = 400, client?: any) {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from("prompts")
      .select(`
        id, title, description, price, cover_image_url, created_at,
        purchases_count, average_rating, creator_id, views_count,
        target_audience, output_format,
        platforms!prompts_platform_id_fkey(name),
        categories!prompts_category_id_fkey(name),
        subcategories!prompts_subcategory_id_fkey(name),
        users!prompts_creator_id_fkey(username, email, avatar_url)
      `)
      .eq('is_published', true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Create a new prompt along with its steps, images, and model associations.
   */
  static async createPrompt(promptData: any, relatedData: {
    steps: any[];
    images: any[];
    models: any[];
  }, client?: any) {
    const supabaseClient = client || supabase;

    const { data: prompt, error: promptError } = await supabaseClient
      .from('prompts')
      .insert([promptData])
      .select()
      .single();

    if (promptError) throw promptError;

    const promptId = prompt.id;
    const tasks = [];

    if (relatedData.steps.length > 0) {
      tasks.push(
        supabaseClient.from('prompt_steps').insert(
          relatedData.steps.map(step => ({ ...step, prompt_id: promptId }))
        )
      );
    }

    if (relatedData.images.length > 0) {
      tasks.push(
        supabaseClient.from('prompt_images').insert(
          relatedData.images.map(img => ({ ...img, prompt_id: promptId }))
        )
      );
    }

    if (relatedData.models.length > 0) {
      tasks.push(
        supabaseClient.from('prompt_models').insert(
          relatedData.models.map(model => ({ ...model, prompt_id: promptId }))
        )
      );
    }

    const results = await Promise.all(tasks);
    const firstError = results.find(res => res.error);
    if (firstError) throw firstError.error;

    return prompt;
  }

  /**
   * Update an existing prompt and its related data by replacing them.
   */
  static async updateFullPrompt(id: string, promptData: any, relatedData: {
    steps: any[];
    images: any[];
    models: any[];
  }, client?: any) {
    const supabaseClient = client || supabase;

    const { data: updated, error: promptError } = await supabaseClient
      .from('prompts')
      .update(promptData)
      .eq('id', id)
      .select()
      .single();

    if (promptError) throw promptError;

    // Delete steps and models, then re-insert
    const tasks = [
      supabaseClient.from('prompt_steps').delete().eq('prompt_id', id),
      supabaseClient.from('prompt_models').delete().eq('prompt_id', id)
    ];

    await Promise.all(tasks);

    const reInsertTasks = [];
    if (relatedData.steps.length > 0) {
      reInsertTasks.push(
        supabaseClient.from('prompt_steps').insert(
          relatedData.steps.map(step => ({ ...step, prompt_id: id }))
        )
      );
    }

    if (relatedData.models.length > 0) {
      reInsertTasks.push(
        supabaseClient.from('prompt_models').insert(
          relatedData.models.map(model => ({ ...model, prompt_id: id }))
        )
      );
    }

    if (relatedData.images.length > 0) {
      reInsertTasks.push(
        supabaseClient.from('prompt_images').insert(
          relatedData.images.map(img => ({ ...img, prompt_id: id }))
        )
      );
    }

    const results = await Promise.all(reInsertTasks);
    const firstError = results.find(res => res.error);
    if (firstError) throw firstError.error;

    return updated;
  }

  /**
   * Delete a prompt.
   */
  static async deletePrompt(id: string, client?: any) {
    const supabaseClient = client || supabase;
    const { error } = await supabaseClient
      .from('prompts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  /**
   * Toggle the publication status of a prompt.
   */
  static async togglePromptStatus(id: string, isPublished: boolean, client?: any) {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('prompts')
      .update({ is_published: isPublished })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Add a single prompt step.
   */
  static async addPromptStep(promptId: string, stepData: any, client?: any) {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('prompt_steps')
      .insert({ ...stepData, prompt_id: promptId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Reorder multiple prompt steps at once.
   */
  static async reorderPromptSteps(promptId: string, updates: { id: number, step_number: number }[], client?: any) {
    const supabaseClient = client || supabase;

    const { data, error } = await supabaseClient
      .from('prompt_steps')
      .upsert(updates, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data;
  }
}
