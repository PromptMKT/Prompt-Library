/**
 * Central router: maps a prompt's category/outputType/platform
 * to the appropriate OutputPreview component.
 */

import { TextOutput } from "./TextOutput";
import { ImageOutput } from "./ImageOutput";
import { CodeOutput } from "./CodeOutput";
import { ConversationalOutput } from "./ConversationalOutput";
import { AudioOutput } from "./AudioOutput";
import { VideoOutput } from "./VideoOutput";
import { StructuredDataOutput } from "./StructuredDataOutput";
import { ToolCallOutput } from "./ToolCallOutput";
import { MultiStepOutput } from "./MultiStepOutput";
import { MultipleOutputs } from "./MultipleOutputs";

type PromptItem = {
  title: string;
  promptText: string;
  images: string[];
  category?: string;
  subcategory?: string;
  outputType?: string;
  platform?: string;
  tags?: string[];
  steps?: any[];
  is_multi_step?: boolean;
};

type PreviewType =
  | "text"
  | "image"
  | "code"
  | "conversational"
  | "audio"
  | "video"
  | "structured"
  | "toolcall"
  | "multistep"
  | "multiple";

function normalize(s: string = "") {
  return s.toLowerCase().trim();
}

export function detectPreviewType(prompt: PromptItem): PreviewType {
  const cat = normalize(prompt.category);
  const sub = normalize(prompt.subcategory);
  const out = normalize(prompt.outputType);
  const plat = normalize(prompt.platform);
  const tags = (prompt.tags || []).map(normalize).join(" ");
  const text = normalize(prompt.promptText + " " + prompt.title + " " + tags);

  // Multi-step: check real DB steps field first
  if (prompt.is_multi_step || (prompt.steps && prompt.steps.length > 1)) return "multistep";

  // Image / Visual
  if (
    cat.includes("image") || cat.includes("visual") || cat.includes("art") ||
    out.includes("image") || out.includes("visual") ||
    plat.includes("midjourney") || plat.includes("dall-e") || plat.includes("flux") || plat.includes("stable diffusion") ||
    text.includes("midjourney") || text.includes("dall-e") || text.includes("generate image") || text.includes("visual output")
  ) return "image";

  // Video
  if (
    cat.includes("video") ||
    out.includes("video") ||
    plat.includes("runway") || plat.includes("sora") ||
    text.includes("video script") || text.includes("video generation") || text.includes("screenplay")
  ) return "video";

  // Audio / TTS
  if (
    cat.includes("audio") || cat.includes("tts") || cat.includes("voice") || cat.includes("podcast") || cat.includes("music") ||
    out.includes("audio") || out.includes("tts") || out.includes("voice") ||
    plat.includes("elevenlabs") || plat.includes("suno") || plat.includes("udio") ||
    text.includes("text-to-speech") || text.includes("audio script") || text.includes("podcast script")
  ) return "audio";

  // Code
  if (
    cat.includes("code") || cat.includes("developer") || cat.includes("development") || cat.includes("engineering") || cat.includes("programming") ||
    out.includes("code") || out.includes("script") ||
    sub.includes("code") || sub.includes("script") ||
    text.includes("generate code") || text.includes("write code") || text.includes("python") ||
    text.includes("javascript") || text.includes("typescript") || text.includes("react component") || text.includes("api integration")
  ) return "code";

  // Conversational / Chatbot
  if (
    cat.includes("conversation") || cat.includes("chat") || cat.includes("chatbot") || cat.includes("roleplay") || cat.includes("role play") ||
    out.includes("conversation") || out.includes("chat") ||
    text.includes("act as") || text.includes("roleplay") || text.includes("conversational")
  ) return "conversational";

  // Structured data / Data extraction
  if (
    cat.includes("data") || cat.includes("extract") || cat.includes("structured") || cat.includes("analytics") ||
    out.includes("json") || out.includes("csv") || out.includes("yaml") || out.includes("structured") ||
    text.includes("extract data") || text.includes("json format") || text.includes("csv output") || text.includes("schema")
  ) return "structured";

  // Agent / Tool call
  if (
    cat.includes("agent") || cat.includes("autonomous") || cat.includes("workflow") || cat.includes("tool") ||
    out.includes("tool call") || out.includes("function") || out.includes("agent") ||
    text.includes("tool call") || text.includes("function call") || text.includes("autonomous agent")
  ) return "toolcall";

  // Multi-step (text heuristic)
  if (
    cat.includes("step") || cat.includes("chain") || cat.includes("pipeline") ||
    out.includes("multi-step") || out.includes("chain") ||
    text.includes("step-by-step") || text.includes("chain of thought") || text.includes("multi-step")
  ) return "multistep";

  // Multiple outputs / A-B testing
  if (
    cat.includes("variation") || cat.includes("multiple") || cat.includes("a/b") ||
    text.includes("multiple variation") || text.includes("a/b test") || text.includes("tone variation")
  ) return "multiple";

  // Default fallback
  return "text";
}

export { TextOutput, ImageOutput, CodeOutput, ConversationalOutput, AudioOutput, VideoOutput, StructuredDataOutput, ToolCallOutput, MultiStepOutput, MultipleOutputs };

export type { PromptItem as OutputPreviewPrompt };
