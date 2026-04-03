import { PromptService } from "../services/PromptService";
import { UserController } from "./UserController";
import { supabase } from "@/lib/supabase";

export class PromptController {
  /**
   * Get formatted prompts for the home page.
   */
  static async getHomePrompts() {
    try {
      const data = await PromptService.getPublishedPrompts(10);
      return (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        created_at: p.created_at,
        rating: p.average_rating || 4.8,
        sales: p.purchases_count || 0,
        author: p.users?.display_name || p.users?.username || "Creator",
        platform: p.platforms?.name || "AI",
        image: p.cover_image_url
      }));
    } catch (error) {
      console.error("Controller Error (getHomePrompts):", error);
      throw error;
    }
  }

  /**
   * Get categories for the home page.
   */
  static async getCategories() {
    try {
      const { data, error } = await supabase.from('categories').select('*').limit(5);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Controller Error (getCategories):", error);
      throw error;
    }
  }

  /**
   * Get all data needed for the home page.
   */
  static async getHomeData() {
    const [prompts, categories] = await Promise.all([
      this.getHomePrompts(),
      this.getCategories()
    ]);
    return { prompts, categories };
  }

  /**
   * Get detailed prompt data with mapping for the detail page.
   */
  static async getPromptDetails(id: string, client?: any) {
    try {
      const data = await PromptService.getPromptById(id, client);
      if (!data) return null;

      return {
        id: String(data.id),
        title: data.title || "Untitled Prompt",
        tagline: data.tagline || data.short_description || data.description || "Ready-to-use prompt",
        description: data.description || data.tagline,
        platform: data.platforms?.name || "AI",
        category: data.categories?.name || "Prompt",
        subcategory: data.subcategories?.name,
        useCase: data.use_cases?.name,
        model: data.models?.name,
        price: Number(data.price || 0),
        promptText: data.prompt_text || data.promptText || "No preview available.",
        images: data.prompt_images?.length
          ? data.prompt_images.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)).map((img: any) => img.image_url)
          : data.cover_image_url ? [data.cover_image_url] : [],
        seller: {
          id: data.creator_id,
          username: "creator", 
          display_name: "",
          avatar: "",
          bio: "",
          total_sales: 0,
          average_rating: 0,
          role: "",
          total_prompts: 0,
        },
        outputType: data.output_type || data.outputType || undefined,
        tags: Array.isArray(data.tags) ? data.tags : [],
        complexity: data.complexity || "Intermediate",
        sales: Number(data.purchases_count || data.sales || 0),
        rating: Number(data.average_rating || data.rating || 4.9),
        review_count: Number(data.review_count || 0),
        lastTested: data.verified_at || data.updated_at || data.created_at || "Recent",
        is_multi_step: !!data.is_multi_step,
        steps: data.prompt_steps || [],
        reviews: data.reviews || [],
        created_at: data.created_at,
        inputTypes: data.input_types || [],
        inputData: data.input_data || {},
        promptFileUrls: data.prompt_file_urls || [],
        quick_setup: data.quick_setup,
        guide_steps: data.guide_steps || [],
        fill_variables: data.fill_variables,
        what_to_expect: data.what_to_expect,
        pro_tips: data.pro_tips,
        common_mistakes: data.common_mistakes,
        how_to_adapt: data.how_to_adapt,
        seller_note: data.seller_note
      };
    } catch (error) {
      console.error("Controller Error (getPromptDetails):", error);
      throw error;
    }
  }

  /**
   * Get all data needed for the prompt detail page.
   */
  static async getPromptPageData(id: string, userId?: string, client?: any) {
    try {
      const data = await this.getPromptDetails(id, client);
      if (!data) return null;

      let sellerDetails = data.seller;
      if (data.seller.id) {
        const profile = await UserController.getUserProfileDetails(data.seller.id, client);
        if (profile) {
          sellerDetails = {
            ...sellerDetails,
            ...profile,
          };
        }
        
        const count = await PromptService.getSellerPromptCount(data.seller.id, client);
        if (count !== null) {
          sellerDetails.total_prompts = count;
        }
      }

      const related = await this.getRelatedPrompts(client);
      
      let isPurchased = false;
      if (userId) {
        isPurchased = await UserController.checkPromptAccess(userId, id, client);
      }

      return {
        prompt: { ...data, seller: sellerDetails },
        related,
        isPurchased
      };
    } catch (error) {
      console.error("Controller Error (getPromptPageData):", error);
      throw error;
    }
  }

  /**
   * Get related prompts formatted for the UI.
   */
  static async getRelatedPrompts(client?: any) {
    try {
      const data = await PromptService.getRelatedPrompts(4, client);
      return (data || []).map((row: any) => ({
        id: String(row.id),
        title: row.title || "Untitled",
        price: row.price,
        image: row.cover_image_url,
        author: row.users?.display_name || row.users?.username || "Creator",
        platform: row.platforms?.name || "AI"
      }));
    } catch (error) {
      console.error("Controller Error (getRelatedPrompts):", error);
      throw error;
    }
  }

  /**
   * Get all data needed for the explore page.
   */
  static async getExplorePageData(client?: any) {
    try {
      const rows = await PromptService.getExploreData(400, client);
      
      const mappedPrompts = (rows || []).map((row: any) => {
        const userData = row.users || {};
        const sellerName = userData.username || userData.display_name || "Creator";

        return {
          id: String(row.id),
          title: row.title || "Untitled Prompt",
          short_description: row.description || "Prompt system that ships outcomes.",
          images: row.cover_image_url ? [row.cover_image_url] : [],
          rating: Number(row.average_rating || 4.8),
          sales: Number(row.purchases_count || 0),
          tags: [],
          seller: sellerName,
          creator_id: row.creator_id || null,
          price: Number(row.price || 0),
          platform: row.platforms?.name || "AI",
          category: row.categories?.name || "Prompt",
          subcategory: row.subcategories?.name,
          output_type: undefined,
          difficulty: undefined,
          prompt_text: undefined,
          createdAt: row.created_at,
        };
      });

      const sellerStats = new Map<string, { prompts: number; sales: number; name: string }>();
      for (const prompt of mappedPrompts) {
        const cid = prompt.creator_id || "anonymous";
        const current = sellerStats.get(cid) || { prompts: 0, sales: 0, name: prompt.seller || "Creator" };
        current.prompts += 1;
        current.sales += Number(prompt.sales || 0);
        if (current.name === "Creator" && prompt.seller !== "Creator") {
          current.name = prompt.seller;
        }
        sellerStats.set(cid, current);
      }

      const topCreators = Array.from(sellerStats.entries())
        .filter(([cid]) => cid !== "anonymous")
        .map(([cid, stats]) => ({
          name: stats.name,
          prompts: stats.prompts,
          sales: stats.sales,
          score: stats.sales * 10 + stats.prompts * 100,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      const trendingTags = Array.from(new Set(
        mappedPrompts
          .flatMap((prompt) => [prompt.category, prompt.subcategory, prompt.platform].filter(Boolean) as string[])
          .map((value) => value.trim())
          .filter(Boolean)
      )).slice(0, 12);

      return {
        topCreators,
        trendingTags: ["All", ...trendingTags],
        prompts: mappedPrompts,
      };
    } catch (error) {
      console.error("Controller Error (getExplorePageData):", error);
      throw error;
    }
  }

  /**
   * Get subcategories for a given category.
   */
  static async getSubcategories(categoryId: string, client?: any) {
    const supabaseClient = client || supabase;
    try {
      const { data, error } = await supabaseClient
        .from('subcategories')
        .select('*')
        .eq('category_id', categoryId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Controller Error (getSubcategories):", error);
      throw error;
    }
  }

  /**
   * Orchestrate the publication of a new prompt.
   */
  static async publishPrompt(data: any, client?: any) {
    try {
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

      // 1. Prepare main prompt object
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

      // 2. Prepare steps
      let stepsToInsert = [];
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

      // 3. Prepare images
      const imagesToInsert = (screenshotUrls || []).map((url: string, idx: number) => ({
        image_url: url,
        provider: 'cloudinary',
        sort_order: idx + 1
      }));

      // 4. Prepare models
      const modelsToInsert = (selectedModels || []).map((mId: number) => ({
        model_id: mId,
        platform_id: platform
      }));

      // 5. Call Service
      return await PromptService.createPrompt(promptInsert, {
        steps: stepsToInsert,
        images: imagesToInsert,
        models: modelsToInsert
      }, client);
    } catch (error) {
      console.error("Controller Error (publishPrompt):", error);
      throw error;
    }
  }
}
