import { Suspense } from "react";
import { PromptController } from "@/backend/controllers/PromptController";
import { createClient } from "@/lib/supabase/server";
import PromptDetailClient from "./components/PromptDetailClient";
import { type PromptItem } from "@/backend/models/Prompt";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate metadata for the prompt detail page (ID 27 alignment).
 * This ensures SEO-friendly titles and social sharing previews.
 */
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const data = await PromptController.getPromptDetails(id);
  
  if (!data) return { title: "Prompt Not Found" };

  return {
    title: `${data.title} | Prompt Library`,
    description: data.description || `Buy and download the best ${data.platform} prompt for ${data.category}.`,
    openGraph: {
      images: data.images?.[0] ? [data.images[0]] : [],
    },
  };
}

async function PromptDataFetcher({ id }: { id: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const data = await PromptController.getPromptPageData(id, user?.id, supabase);
    
    if (!data || !data.prompt) {
      return notFound();
    }

    return (
      <PromptDetailClient 
        prompt={data.prompt as PromptItem} 
        initialIsPurchased={data.isPurchased} 
        relatedPrompts={data.related as unknown as PromptItem[]}
        user={user}
      />
    );
  } catch (err) {
    console.error("Error fetching prompt details on server:", err);
    return notFound();
  }
}

/**
 * Prompt Detail Page (Server Component)
 */
export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PromptDataFetcher id={id} />
    </Suspense>
  );
}
