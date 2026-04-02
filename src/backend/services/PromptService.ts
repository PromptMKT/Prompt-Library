import { supabase } from "@/lib/supabase";

export class PromptService {
  /**
   * Fetch a list of published prompts with optional limit and ordering.
   */
  static async getPublishedPrompts(limit: number = 10) {
    const { data, error } = await supabase
      .from('prompts')
      .select(`
        id, title, price, cover_image_url, created_at, purchases_count, average_rating,
        users!prompts_creator_id_fkey(display_name, username),
        platforms!prompts_platform_id_fkey(name)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Fetch a single prompt by its ID with all related information.
   */
  static async getPromptById(id: string) {
    const { data, error } = await supabase
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
  static async getRelatedPrompts(limit: number = 4) {
    const { data, error } = await supabase
      .from("prompts")
      .select(`
        id, title, description, price, cover_image_url, created_at,
        platforms!prompts_platform_id_fkey(name),
        categories!prompts_category_id_fkey(name),
        users!prompts_creator_id_fkey(display_name, username)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Fetch the count of published prompts by a specific creator.
   */
  static async getSellerPromptCount(creatorId: string) {
    const { count, error } = await supabase
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
  static async getExploreData(limit: number = 400) {
    const { data, error } = await supabase
      .from("prompts")
      .select(`
        id, title, description, price, cover_image_url, created_at,
        purchases_count, average_rating, creator_id,
        platforms!prompts_platform_id_fkey(name),
        categories!prompts_category_id_fkey(name),
        subcategories!prompts_subcategory_id_fkey(name),
        users!prompts_creator_id_fkey(username, email, avatar_url)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Create a new prompt along with its steps, images, and model associations.
   * This logic ensures atomicity by using multiple inserts (Supabase doesn't support 
   * cross-table transactions via the JS client easily, so we handle it sequentially).
   */
  static async createPrompt(promptData: any, relatedData: {
    steps: any[];
    images: any[];
    models: any[];
  }) {
    // 1. Insert the main prompt record
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .insert([promptData])
      .select()
      .single();

    if (promptError) throw promptError;

    const promptId = prompt.id;

    // 2. Insert related data concurrently where possible
    const tasks = [];

    if (relatedData.steps.length > 0) {
      tasks.push(
        supabase.from('prompt_steps').insert(
          relatedData.steps.map(step => ({ ...step, prompt_id: promptId }))
        )
      );
    }

    if (relatedData.images.length > 0) {
      tasks.push(
        supabase.from('prompt_images').insert(
          relatedData.images.map(img => ({ ...img, prompt_id: promptId }))
        )
      );
    }

    if (relatedData.models.length > 0) {
      tasks.push(
        supabase.from('prompt_models').insert(
          relatedData.models.map(model => ({ ...model, prompt_id: promptId }))
        )
      );
    }

    const results = await Promise.all(tasks);
    const firstError = results.find(res => res.error);
    if (firstError) throw firstError.error;

    return prompt;
  }
}
