export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audiences: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string | null
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          description?: string | null
          id: string
          name: string
        }
        Update: {
          color?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          related_entity_id: string | null
          related_entity_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_prompts: {
        Row: {
          collection_id: string
          prompt_id: string
          sort_order: number | null
        }
        Insert: {
          collection_id: string
          prompt_id: string
          sort_order?: number | null
        }
        Update: {
          collection_id?: string
          prompt_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_prompts_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_prompts_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_published: boolean | null
          price: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          price?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          price?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      model_groups: {
        Row: {
          id: number
          name: string
          platform_id: string
        }
        Insert: {
          id?: number
          name: string
          platform_id: string
        }
        Update: {
          id?: number
          name?: string
          platform_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_groups_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      model_tags: {
        Row: {
          model_id: number
          tag_id: number
        }
        Insert: {
          model_id: number
          tag_id: number
        }
        Update: {
          model_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "model_tags_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          description: string | null
          group_id: number
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          group_id: number
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          group_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "models_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "model_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      money_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_gateway_id: string | null
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_gateway_id?: string | null
          status: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_gateway_id?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "money_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      outputs: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          period_end: string | null
          period_start: string | null
          seller_id: string
          status: string
          stripe_transfer_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          seller_id: string
          status?: string
          stripe_transfer_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          seller_id?: string
          status?: string
          stripe_transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      platforms: {
        Row: {
          category: string | null
          color: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          description?: string | null
          id: string
          name: string
        }
        Update: {
          category?: string | null
          color?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      prompt_bulk_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          creator_id: string
          error_log: Json | null
          failed: number | null
          id: string
          source: string | null
          status: string
          succeeded: number | null
          total_prompts: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          creator_id: string
          error_log?: Json | null
          failed?: number | null
          id?: string
          source?: string | null
          status?: string
          succeeded?: number | null
          total_prompts?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          creator_id?: string
          error_log?: Json | null
          failed?: number | null
          id?: string
          source?: string | null
          status?: string
          succeeded?: number | null
          total_prompts?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_bulk_jobs_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          height: number | null
          id: number
          image_url: string
          is_cover: boolean | null
          prompt_id: string
          provider: string
          public_id: string | null
          sort_order: number | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          height?: number | null
          id?: number
          image_url: string
          is_cover?: boolean | null
          prompt_id: string
          provider?: string
          public_id?: string | null
          sort_order?: number | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          height?: number | null
          id?: number
          image_url?: string
          is_cover?: boolean | null
          prompt_id?: string
          provider?: string
          public_id?: string | null
          sort_order?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_images_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_models: {
        Row: {
          id: number
          is_primary: boolean | null
          model_id: number
          platform_id: string
          prompt_id: string
          sort_order: number | null
        }
        Insert: {
          id?: number
          is_primary?: boolean | null
          model_id: number
          platform_id: string
          prompt_id: string
          sort_order?: number | null
        }
        Update: {
          id?: number
          is_primary?: boolean | null
          model_id?: number
          platform_id?: string
          prompt_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_models_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_models_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_models_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_steps: {
        Row: {
          created_at: string | null
          expected_output: string | null
          id: number
          image_id: number | null
          instruction: string
          model_id: number | null
          notes: string | null
          platform_id: string | null
          prompt_id: string
          step_number: number
          step_type: string
          title: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          expected_output?: string | null
          id?: number
          image_id?: number | null
          instruction: string
          model_id?: number | null
          notes?: string | null
          platform_id?: string | null
          prompt_id: string
          step_number: number
          step_type?: string
          title?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          expected_output?: string | null
          id?: number
          image_id?: number | null
          instruction?: string
          model_id?: number | null
          notes?: string | null
          platform_id?: string | null
          prompt_id?: string
          step_number?: number
          step_type?: string
          title?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_steps_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "prompt_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_steps_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_steps_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_steps_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          average_rating: number | null
          bulk_job_id: string | null
          category_id: string | null
          common_mistakes: string | null
          complexity: string | null
          cover_image_provider: string | null
          cover_image_public_id: string | null
          cover_image_url: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          fill_variables: string | null
          guide_steps: string[] | null
          how_to_adapt: string | null
          id: string
          input_data: Json | null
          input_types: string[] | null
          is_free: boolean | null
          is_multi_step: boolean | null
          views_count: number | null
          is_published: boolean | null
          model_id: number | null
          output_format: string | null
          platform_id: string | null
          price: number | null
          pro_tips: string | null
          prompt_file_urls: string[] | null
          purchases_count: number | null
          quick_setup: string | null
          review_count: number | null
          search_vec: unknown
          seller_note: string | null
          step_count: number | null
          subcategory_id: number | null
          tagline: string | null
          tags: string[] | null
          target_audience: string | null
          title: string | null
          updated_at: string | null
          use_case_id: number | null
          verified_at: string | null
          what_to_expect: string | null
        }
        Insert: {
          average_rating?: number | null
          bulk_job_id?: string | null
          category_id?: string | null
          common_mistakes?: string | null
          complexity?: string | null
          cover_image_provider?: string | null
          cover_image_public_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          fill_variables?: string | null
          guide_steps?: string[] | null
          how_to_adapt?: string | null
          id?: string
          input_data?: Json | null
          input_types?: string[] | null
          is_free?: boolean | null
          is_multi_step?: boolean | null
          is_published?: boolean | null
          model_id?: number | null
          output_format?: string | null
          platform_id?: string | null
          price?: number | null
          pro_tips?: string | null
          prompt_file_urls?: string[] | null
          purchases_count?: number | null
          quick_setup?: string | null
          review_count?: number | null
          search_vec?: unknown
          seller_note?: string | null
          step_count?: number | null
          subcategory_id?: number | null
          tagline?: string | null
          tags?: string[] | null
          target_audience?: string | null
          title?: string | null
          updated_at?: string | null
          use_case_id?: number | null
          verified_at?: string | null
          what_to_expect?: string | null
        }
        Update: {
          average_rating?: number | null
          bulk_job_id?: string | null
          category_id?: string | null
          common_mistakes?: string | null
          complexity?: string | null
          cover_image_provider?: string | null
          cover_image_public_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          fill_variables?: string | null
          guide_steps?: string[] | null
          how_to_adapt?: string | null
          id?: string
          input_data?: Json | null
          input_types?: string[] | null
          is_free?: boolean | null
          is_multi_step?: boolean | null
          is_published?: boolean | null
          model_id?: number | null
          output_format?: string | null
          platform_id?: string | null
          price?: number | null
          pro_tips?: string | null
          prompt_file_urls?: string[] | null
          purchases_count?: number | null
          quick_setup?: string | null
          review_count?: number | null
          search_vec?: unknown
          seller_note?: string | null
          step_count?: number | null
          subcategory_id?: number | null
          tagline?: string | null
          tags?: string[] | null
          target_audience?: string | null
          title?: string | null
          updated_at?: string | null
          use_case_id?: number | null
          verified_at?: string | null
          what_to_expect?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_bulk_job_id_fkey"
            columns: ["bulk_job_id"]
            isOneToOne: false
            referencedRelation: "prompt_bulk_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["creator_id"]
          },
          {
            foreignKeyName: "prompts_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_use_case_id_fkey"
            columns: ["use_case_id"]
            isOneToOne: false
            referencedRelation: "use_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          amount_paid: number
          currency: string
          id: string
          is_free_claim: boolean | null
          platform_fee: number | null
          prompt_id: string
          purchased_at: string | null
          seller_payout: number | null
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number
          currency?: string
          id?: string
          is_free_claim?: boolean | null
          platform_fee?: number | null
          prompt_id: string
          purchased_at?: string | null
          seller_payout?: number | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          currency?: string
          id?: string
          is_free_claim?: boolean | null
          platform_fee?: number | null
          prompt_id?: string
          purchased_at?: string | null
          seller_payout?: number | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string | null
          flagged: boolean | null
          id: number
          is_visible: boolean | null
          prompt_id: string
          rating: number
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          flagged?: boolean | null
          id?: number
          is_visible?: boolean | null
          prompt_id: string
          rating: number
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          flagged?: boolean | null
          id?: number
          is_visible?: boolean | null
          prompt_id?: string
          rating?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategory_audience: {
        Row: {
          audience_id: number
          subcategory_id: number
        }
        Insert: {
          audience_id: number
          subcategory_id: number
        }
        Update: {
          audience_id?: number
          subcategory_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "subcategory_audience_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcategory_audience_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategory_output: {
        Row: {
          output_id: number
          subcategory_id: number
        }
        Insert: {
          output_id: number
          subcategory_id: number
        }
        Update: {
          output_id?: number
          subcategory_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "subcategory_output_output_id_fkey"
            columns: ["output_id"]
            isOneToOne: false
            referencedRelation: "outputs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcategory_output_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      use_cases: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: number
          is_custom: boolean | null
          name: string
          subcategory_id: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: number
          is_custom?: boolean | null
          name: string
          subcategory_id?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: number
          is_custom?: boolean | null
          name?: string
          subcategory_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "use_cases_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "use_cases_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string
          avatar_provider: string | null
          avatar_public_id: string | null
          avatar_url: string | null
          average_rating: number | null
          bio: string | null
          created_at: string | null
          creator_id: string | null
          email: string
          followers_count: number | null
          following_count: number | null
          id: string
          interests: string[] | null
          is_active: boolean | null
          is_verified: boolean | null
          payout_enabled: boolean | null
          role: string
          stripe_account_id: string | null
          total_coins: number
          total_purchases: number | null
          total_sales: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          auth_user_id: string
          avatar_provider?: string | null
          avatar_public_id?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          bio?: string | null
          created_at?: string | null
          creator_id?: string | null
          email: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          is_verified?: boolean | null
          payout_enabled?: boolean | null
          role?: string
          stripe_account_id?: string | null
          total_coins?: number
          total_purchases?: number | null
          total_sales?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          auth_user_id?: string
          avatar_provider?: string | null
          avatar_public_id?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          bio?: string | null
          created_at?: string | null
          creator_id?: string | null
          email?: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          is_verified?: boolean | null
          payout_enabled?: boolean | null
          role?: string
          stripe_account_id?: string | null
          total_coins?: number
          total_purchases?: number | null
          total_sales?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          added_at: string | null
          id: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          prompt_id: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      backfill_existing_users_coins: { Args: never; Returns: undefined }
      execute_coin_prompt_purchase: {
        Args: { p_auth_user_id: string; p_prompt_id: string }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
