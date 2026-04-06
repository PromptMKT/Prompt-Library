import React from "react";
import { PromptController } from "@/backend/controllers/PromptController";
import HomeClient from "./components/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptStore | The Premium AI Prompt Marketplace",
  description: "Buy and sell high-quality AI prompts for Midjourney, ChatGPT, DALL-E, and more. Unlock stunning outputs instantly.",
  openGraph: {
    title: "PromptStore | Premium AI Prompt Marketplace",
    description: "The world's first and largest marketplace for premium AI prompts.",
    images: ["https://promptmarket.com/og-image.jpg"], // Placeholder for real OG image
  },
};

export default async function HomePage() {
  // Fetch real data on the server
  // Fallback to empty arrays to prevent crashes if DB is empty
  let displayPrompts: any[] = [];
  let dbCategories: any[] = [];

  try {
    const data = await PromptController.getHomeData();
    displayPrompts = data.prompts || [];
    dbCategories = data.categories || [];
  } catch (err) {
    console.error("Error loading home data on server:", err);
  }

  return (
    <HomeClient 
      displayPrompts={displayPrompts} 
      dbCategories={dbCategories} 
    />
  );
}
