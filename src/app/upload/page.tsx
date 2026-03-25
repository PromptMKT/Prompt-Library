"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Eye, Heart, Share2, UploadCloud, CheckCircle2, ChevronDown, LayoutGrid, Type, AlignLeft, Tags, Code, Images, FileText, MousePointerClick, DollarSign, ListChecks, ArrowRight, Play, Zap, FileJson, Link as LinkIcon, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { uploadToCloudinary } from "@/app/actions/upload-cloudinary";

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const PLATFORM_MODELS: Record<string, string[]> = {
  ChatGPT:['GPT-5.1 (latest)','GPT-5','GPT-5 Mini','GPT-4o','GPT-4o Mini','GPT-4 Turbo','o4','o4 Mini','o3','o3 Mini','o1','GPT-3.5 Turbo'],
  Claude:['Claude Opus 4.5 (latest)','Claude Opus 4','Claude Sonnet 4.6','Claude Sonnet 4.5','Claude Haiku 4.5','Claude 3.5 Sonnet','Claude 3.5 Haiku','Claude 3 Opus','Claude 3 Sonnet','Claude 3 Haiku'],
  Gemini:['Gemini 3 Pro (latest)','Gemini 3 Flash','Gemini 2.5 Pro','Gemini 2.5 Flash','Gemini 2.5 Nano','Gemini 2.0 Pro','Gemini 2.0 Flash','Gemini 1.5 Pro','Gemini 1.5 Flash'],
  Grok:['Grok 4.1 (latest)','Grok 4','Grok-3','Grok-3 Mini','Grok-2'],
  'Meta / Llama':['Llama 4 Ultra 500B (latest)','Llama 4 Super 100B','Llama 4 Nano 30B','Llama 3.3 70B','Llama 3.1 405B','Llama 3.1 70B','Llama 3.1 8B'],
  Mistral:['Mistral Large 2 (latest)','Pixtral Large','Mistral Small 3.1','Codestral','Mistral Nemo','Mixtral 8x22B','Mixtral 8x7B','Mistral 7B'],
  DeepSeek:['DeepSeek V3 (latest)','DeepSeek V3 0324','DeepSeek R1','DeepSeek R1 Distill 70B','DeepSeek R1 Distill 8B','DeepSeek Coder V2'],
  Perplexity:['Sonar Reasoning Pro (latest)','Sonar Large','Sonar Small','Sonar Reasoning'],
  Cohere:['Command R+ (latest)','Command R','Command Light','Embed v3 English','Embed v3 Multilingual'],
  Midjourney:['v7 (latest)','v6.1','v6.0','v5.2','v5.1','Niji v6','Niji v5'],
  FLUX:['FLUX 2 Dev (latest)','FLUX 2 Pro','FLUX 1.1 Pro Ultra','FLUX 1.1 Pro','FLUX.1 Pro','FLUX.1 Dev','FLUX.1 Schnell'],
  'Stable Diffusion':['SD 3.5 Large (latest)','SD 3.5 Large Turbo','SD 3.5 Medium','SDXL 1.0','SDXL Turbo','SDXL Lightning','SD 2.1','SD 1.5'],
  'DALL-E':['GPT Image 1.5 (latest)','DALL-E 3 HD','DALL-E 3','DALL-E 2'],
  'Adobe Firefly':['Firefly Image 3 (latest)','Firefly Image 2','Firefly Video','Firefly Vector','Firefly Design'],
  Ideogram:['v2 (latest)','v2 Turbo','v1'],
  Recraft:['V3 (latest)','V2'],
  'Google Imagen':['Imagen 4 (latest)','Imagen 3','Imagen 2'],
  Runway:['Gen-3 Alpha (latest)','Gen-3 Alpha Turbo','Gen-2'],
  Sora:['Sora 2 (latest)','Sora 1.0'],
  Kling:['Kling o1 (latest)','Kling 1.6','Kling 1.5'],
  Veo:['Veo 3.1 (latest)','Veo 3','Veo 2'],
  ElevenLabs:['Multilingual v2 (latest)','Turbo v2.5','English v2','Flash v2.5'],
  Suno:['v4.5 (latest)','v4','v3.5'],
  Udio:['Udio 130 (latest)','Udio 32'],
  Cursor:['Claude 3.5 Sonnet (via Cursor)','GPT-4o (via Cursor)','Cursor-small'],
  'GitHub Copilot':['GPT-4o (Copilot)','Claude 3.5 Sonnet (Copilot)','Gemini 1.5 Pro (Copilot)','Copilot Autocomplete'],
  Other:['Custom / not listed']
};

const SUBCATS: Record<string, string[]> = {
  'Text generation':['Marketing & advertising copy','Email marketing','Blog & articles','Social media copy','Website & landing page copy','Video & podcast scripts','Technical writing','Academic & research writing','Business & professional writing','Creative & fiction writing','UX & interface copy','Conversational & chat scripts','Translation & localisation'],
  'Image & visual generation':['Photography & realism','Illustration & art','UI & product mockups','3D & CGI rendering','Brand & identity visuals','Data visualisation & infographics','Video & motion direction'],
  'Code & technical':['Frontend development','Backend & API development','Data engineering & analytics','DevOps & infrastructure','AI & machine learning','Mobile development','Security & testing','Automation & scripting','Architecture & system design'],
  'Data & analysis':['Research & literature synthesis','Competitive & market intelligence','Financial analysis','Survey & qualitative analysis','Document & contract review','Fact-checking & verification'],
  'Audio & voice':['Podcast scripts & show notes','Voice UI & IVR scripts','Audiobook & narration','Music & lyrics','Presentation & speech writing'],
  'Video generation':['Text-to-video prompts','Scene & shot descriptions','Storyboards','Video style direction'],
  'Agentic & workflow':['Task automation prompts','AI agent personas & system prompts','RAG & retrieval prompts','Chain-of-thought & reasoning','Tool-use & function calling','Evaluation & testing prompts'],
  'Role & persona simulation':['Expert advisor personas','Customer & user simulation','Interviewer & evaluator','Historical & cultural personas','Game & interactive characters'],
  'Strategy & planning':['Business strategy','Product strategy','Marketing strategy','Operations & process design','Personal & career planning','Risk & scenario planning','Event & project planning'],
  'Learning & education':['Concept explanation & tutoring','Curriculum & lesson design','Language learning','Corporate & professional training','Test & exam preparation'],
  'Legal':['Contract drafting','Compliance & risk','Legal research'],
  'Medical & healthcare':['Patient education','Clinical documentation','Medical research','Wellness & mental health','Fitness & nutrition'],
  'Finance & investment':['Investment research','Financial modelling','Personal finance'],
  'Science & engineering':['Scientific writing','Lab reports','Engineering specifications','Research methodology'],
  'HR & people ops':['Job descriptions','Performance reviews','Interview frameworks','Onboarding & culture'],
  'Architecture & built environment':['Design briefs','Planning statements','Sustainability reports'],
  'Real estate':['Listing descriptions','Market analysis','Investment briefs'],
  'Agriculture & environment':['Crop management','Sustainability reports','Environmental impact']
};

export default function PromptUploadPage() {
  const { user, profile } = useAuth();
  const [activeSection, setActiveSection] = useState<number>(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const [platformsData, setPlatformsData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [modelsData, setModelsData] = useState<any[]>([]);
  const [subcatsData, setSubcatsData] = useState<any[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);

  // ── S1 ──
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [inputNeeds, setInputNeeds] = useState<string[]>([]);
  const [prefillOn, setPrefillOn] = useState(false);
  const [prefillText, setPrefillText] = useState("");
  const [promptTab, setPromptTab] = useState("single");
  const [promptText, setPromptText] = useState("");
  const [systemText, setSystemText] = useState("");
  const [chainSteps, setChainSteps] = useState([{id: 1, text: ""}]);

  // ── S2 ──
  const [platform, setPlatform] = useState("");
  const [selectedModels, setSelectedModels] = useState<number[]>([]);
  const [verifiedDate, setVerifiedDate] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ── S3 ──
  const [categoryType, setCategoryType] = useState<"output" | "goal" | "domain">("output");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState("");

  // ── S4 ──
  const [screenshots, setScreenshots] = useState<string[]>([]);

  // ── S5 ──
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [complexity, setComplexity] = useState("");
  const [sellerNote, setSellerNote] = useState("");

  // ── S6 ──
  const [price, setPrice] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    async function init() {
      const [cats, plats] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('platforms').select('*')
      ]);
      if (cats.data) setCategoriesData(cats.data);
      if (plats.data) setPlatformsData(plats.data);
    }
    init();
  }, []);

  useEffect(() => {
    if (category) {
      supabase.from('subcategories').select('*').eq('category_id', category).then(({data}) => {
         if(data) setSubcatsData(data || []);
      });
    } else {
      setSubcatsData([]);
    }
  }, [category]);

  useEffect(() => {
    if (platform) {
       supabase.from('models')
         .select('*, model_groups!inner(id, platform_id, name), model_tags(tags(id, name))')
         .eq('model_groups.platform_id', platform)
         .then(({data}) => {
            if(data) setModelsData(data);
         });
    } else {
       setModelsData([]);
    }
  }, [platform]);

  // Functions
  const handlePublish = async () => {
    if (completenessPct < 100 || !user) return;
    setIsPublishing(true);
    try {
      // 1. Upload Cover Image
      let coverUrl = "";
      if (coverFile) {
        const fd = new FormData();
        fd.append('file', coverFile);
        coverUrl = await uploadToCloudinary(fd);
      }
      
      // 2. Upload Screenshots
      const screenshotUrls = [];
      for (const file of screenshotFiles) {
        const fd = new FormData();
        fd.append('file', file);
        const url = await uploadToCloudinary(fd);
        screenshotUrls.push(url);
      }

      // 3. Prepare Prompt Data
      // Must use profile.id to satisfy the foreign key constraint to consumer_profiles/users
      if (!profile?.id) {
        alert("User profile not found. Please try logging out and back in to sync your profile.");
        setIsPublishing(false);
        return;
      }
      const creatorId = profile.id;

      const isMultiStep = promptTab === 'chain';
      const stepCount = isMultiStep ? chainSteps.length : 1;

      const promptInsert = {
         creator_id: creatorId,
         title,
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
         cover_image_provider: 'cloudinary'
      };
      
      const { data: promptData, error: promptError } = await supabase
        .from('prompts')
        .insert([promptInsert])
        .select('id')
        .single();

      if (promptError) throw promptError;
      const promptId = promptData.id;

      // 4. Insert Prompt Steps
      if (isMultiStep) {
        const stepsToInsert = chainSteps.map((s, idx) => ({
          prompt_id: promptId,
          step_number: idx + 1,
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
          instruction: instruction,
          step_type: 'prompt'
        }]);
        if (stepError) throw stepError;
      }

      // 5. Insert Prompt Images (Screenshots)
      if (screenshotUrls.length > 0) {
        const imagesToInsert = screenshotUrls.map((url, idx) => ({
          prompt_id: promptId,
          image_url: url,
          provider: 'cloudinary',
          sort_order: idx + 1
        }));
        const { error: imagesError } = await supabase.from('prompt_images').insert(imagesToInsert);
        if (imagesError) throw imagesError;
      }

      // 6. Insert Prompt Models (if multiple models selected)
      if (selectedModels.length > 0) {
        const modelsToInsert = selectedModels.map(mId => ({
          prompt_id: promptId,
          model_id: mId,
          platform_id: platform
        }));
        const { error: modelsError } = await supabase.from('prompt_models').insert(modelsToInsert);
        if (modelsError) throw modelsError;
      }
      
      setIsPublished(true);
    } catch (err: any) {
      console.error("Error publishing:", err);
      alert("Error publishing: " + err.message);
    } finally {
      setIsPublishing(false);
    }
  };
  const toggleInputNeed = (need: string) => {
    if (need === 'none') return setInputNeeds(['none']);
    setInputNeeds(prev => prev.includes('none') ? [need] : prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]);
  };
  const toggleAudience = (aud: string) => setTargetAudience(prev => prev.includes(aud) ? prev.filter(a => a !== aud) : [...prev, aud]);
  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' && tagsInput.trim()) { setTags([...tags, tagsInput.trim()]); setTagsInput(""); } };
  const getVarsCount = () => (promptText.match(/\[[A-Z_]+\]/g) || []).filter((v,i,a) => a.indexOf(v)===i).length;

  const checks = [
    { label: "Prompt text", done: promptTab === 'chain' ? chainSteps.some(s => s.text.length > 10) : promptText.length > 10 },
    { label: "Title", done: title.length > 2 },
    { label: "Platform selected", done: platform !== "" },
    { label: "Category selected", done: category !== "" },
    { label: "Target audience", done: targetAudience.length > 0 },
    { label: "Output format", done: outputFormat !== "" },
    { label: "1+ screenshot", done: screenshots.length >= 1 },
    { label: "Price set", done: parseInt(price) >= 10 }
  ];
  const completenessPct = Math.round((checks.filter(c => c.done).length / checks.length) * 100);

  const SectionHeader = ({ num, titleStr, desc }: { num: number; titleStr: string; desc: string }) => {
    const isActive = activeSection === num;
    const isChecksPass = checks.filter(c => c.done).length > 0; // Simplified for visual
    return (
      <div onClick={() => setActiveSection(isActive ? 0 : num)} className="flex items-center gap-4 p-5 md:p-6 cursor-pointer hover:bg-slate-50 transition-colors">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors", completedSections.includes(num) ? "bg-emerald-500 text-white" : isActive ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-400")}>
          {completedSections.includes(num) && !isActive ? <CheckCircle2 className="w-4 h-4" /> : num}
        </div>
        <div className="flex-1">
          <h3 className="text-[17px] font-black text-slate-900 tracking-tight">{titleStr}</h3>
          {!isActive && <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-400 mt-1">{desc}</p>}
        </div>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", isActive ? "rotate-180 text-purple-600" : "")} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-900 font-sans pb-32">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-12">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-4xl md:text-[44px] leading-none font-black tracking-tighter text-slate-900 mb-3">List a prompt</h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Share what works. Earn coins every time someone buys. Sections expand as you fill — save your draft anytime.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          
          <div className="space-y-4">
            {/* --- 1. WRITE YOUR PROMPT --- */}
            <motion.div className={cn("bg-white rounded-[20px] border transition-all duration-300 overflow-hidden", activeSection === 1 ? "border-purple-300 shadow-xl shadow-purple-500/5" : "border-slate-200/80")}>
              <SectionHeader num={1} titleStr="Write your prompt" desc={title || "Name, syntax, variables"} />
              <AnimatePresence>
                {activeSection === 1 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-5 md:p-6 pt-0 border-t border-slate-100 mt-2 space-y-8">
                      {/* Name & Tagline */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-2">Short name <span className="text-rose-500">*</span></label>
                          <input type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={60} placeholder="e.g. Cold Email that Converts — B2B Framework" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-500"/>
                          <div className="flex justify-between mt-1"><span className="text-[11px] text-slate-400 font-medium">Shown on the prompt card</span><span className="text-[11px] font-mono text-slate-400">{title.length} / 60</span></div>
                        </div>
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-2">Tagline</label>
                          <input type="text" value={tagline} onChange={e => setTagline(e.target.value)} maxLength={120} placeholder="One sentence — what does the buyer get as a result?" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-500"/>
                          <div className="flex justify-between mt-1"><span className="text-[11px] text-slate-400 font-medium">Mention the outcome</span><span className="text-[11px] font-mono text-slate-400">{tagline.length} / 120</span></div>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />

                      {/* What inputs */}
                      <div>
                        <label className="text-[13px] font-bold text-slate-800 mb-1 block">What inputs does your prompt need?</label>
                        <p className="text-[11px] font-medium text-slate-500 mb-4">Select everything buyers must provide when running your prompt.</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                          {[
                            {id: 'text', label: 'Text / variables', col: 'bg-purple-500'}, {id: 'image', label: 'Image file', col: 'bg-pink-500'},
                            {id: 'doc', label: 'Document / PDF', col: 'bg-purple-500'}, {id: 'audio', label: 'Audio file', col: 'bg-orange-500'},
                            {id: 'url', label: 'URL / webpage', col: 'bg-sky-500'}, {id: 'data', label: 'Data file (CSV)', col: 'bg-emerald-500'},
                            {id: 'code', label: 'Code / repo', col: 'bg-purple-500'}, {id: 'none', label: 'No input needed', col: 'bg-slate-400'}
                          ].map(inp => (
                            <div key={inp.id} onClick={() => toggleInputNeed(inp.id)} className={cn("px-3 py-2 border rounded-xl flex items-center gap-2 cursor-pointer text-xs font-semibold transition-all", inputNeeds.includes(inp.id) ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:border-purple-200")}>
                               <div className={cn("w-2 h-2 rounded-full", inp.col)} /> {inp.label}
                            </div>
                          ))}
                        </div>
                        {inputNeeds.includes('text') && (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                             <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Configure Text / Variables</div>
                             <textarea placeholder="Describe what buyers fill in — e.g. [COMPANY_NAME]" className="w-full p-3 border border-slate-200 rounded-lg text-xs font-mono"></textarea>
                          </div>
                        )}
                        {inputNeeds.includes('doc') && (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                             <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Configure Document</div>
                             <input type="text" placeholder="Accepted formats (PDF, DOCX)" className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
                          </div>
                        )}
                      </div>

                      <div className="h-px bg-slate-100" />

                      {/* File Upload & Prefill */}
                      <div>
                        <label className="text-[13px] font-bold text-slate-800 mb-1 block">Upload prompt file <span className="font-normal text-slate-400 text-[10px] ml-2">OPTIONAL</span></label>
                        <p className="text-[11px] font-medium text-slate-500 mb-4">If your prompt lives in a file (.md, .json), upload it here.</p>
                        <div className="w-full py-8 border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-slate-50">
                           <FileJson className="w-6 h-6 text-slate-400 mb-2" />
                           <span className="text-xs font-bold text-slate-600">Drop your prompt file here</span>
                        </div>
                        
                        <div onClick={() => setPrefillOn(!prefillOn)} className="flex items-center justify-between p-3 border border-slate-200 hover:border-purple-300 rounded-xl mt-4 cursor-pointer transition-colors bg-white">
                          <div>
                            <div className="text-xs font-bold text-slate-800">Link assistant prefill</div>
                            <div className="text-[10px] text-slate-500 font-medium">Pre-loaded assistant turn that steers format or tone</div>
                          </div>
                          <div className={cn("w-9 h-5 rounded-full relative transition-colors", prefillOn ? "bg-emerald-500" : "bg-slate-300")}>
                            <div className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform", prefillOn ? "translate-x-4" : "")} />
                          </div>
                        </div>
                        {prefillOn && (
                          <textarea value={prefillText} onChange={e=>setPrefillText(e.target.value)} placeholder="Here is my structured analysis:&#10;&#10;1." className="w-full mt-2 p-3 border border-slate-200 rounded-xl text-xs font-mono min-h-[80px]" />
                        )}
                      </div>

                      <div className="h-px bg-slate-100" />

                      {/* Prompt Text */}
                      <div>
                        <label className="text-[13px] font-bold text-slate-800 mb-4 block flex items-center gap-2">Prompt text <span className="text-rose-500 text-xs">*</span></label>
                        <div className="flex border-b border-slate-200 mb-4 gap-6">
                           {['single', 'system', 'chain'].map(t => (
                             <div key={t} onClick={() => setPromptTab(t)} className={cn("text-xs font-bold pb-2 cursor-pointer transition-colors", promptTab === t ? "text-purple-600 border-b-2 border-purple-600" : "text-slate-500 hover:text-slate-800")}>
                                {t === 'single' ? "Single prompt" : t === 'system' ? "With system prompt" : "Chain (multi-step)"}
                             </div>
                           ))}
                        </div>

                        {promptTab === 'single' && (
                          <div>
                            <textarea value={promptText} onChange={e=>setPromptText(e.target.value)} placeholder="Paste or write your prompt here..." className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-purple-500" />
                            <div className="flex justify-between mt-2"><span className={cn("text-[11px] font-medium", getVarsCount() > 0 ? "text-purple-600" : "text-slate-400")}>Variables detected: {getVarsCount() > 0 ? getVarsCount() : "none yet"}</span><span className="text-[11px] font-mono text-slate-400">{promptText.length} chars</span></div>
                          </div>
                        )}

                        {promptTab === 'system' && (
                          <div className="space-y-4">
                            <div><label className="text-[11px] font-black uppercase text-slate-500 mb-2 block">System prompt</label><textarea value={systemText} onChange={e=>setSystemText(e.target.value)} placeholder="You are [PERSONA]..." className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-purple-500" /></div>
                            <div><label className="text-[11px] font-black uppercase text-slate-500 mb-2 block">User prompt</label><textarea value={promptText} onChange={e=>setPromptText(e.target.value)} placeholder="Analyse [INPUT]..." className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-purple-500" /></div>
                          </div>
                        )}

                        {promptTab === 'chain' && (
                          <div className="space-y-3">
                            {chainSteps.map((s, idx) => (
                              <div key={s.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                 <div className="bg-slate-50 p-2 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700"><span>Step {idx+1}</span></div>
                                 <textarea value={s.text} onChange={e => { const nc = [...chainSteps]; nc[idx].text = e.target.value; setChainSteps(nc); }} className="w-full p-3 text-xs font-mono border-none outline-none min-h-[80px]" placeholder="Step prompt..." />
                              </div>
                            ))}
                            <button onClick={()=>setChainSteps([...chainSteps, {id: Date.now(), text: ""}])} className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">+ Add step</button>
                          </div>
                        )}
                      </div>

                      <div className="pt-5 flex items-center gap-3 border-t border-slate-100 mt-4">
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Save draft</button>
                        <button onClick={() => { setCompletedSections(prev => [...prev.filter(x => x!==1), 1]); setActiveSection(2); }} className="flex-1 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm">Save & continue →</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* --- 2. PLATFORM & MODEL --- */}
            <motion.div className={cn("bg-white rounded-[20px] border transition-all duration-300 overflow-hidden", activeSection === 2 ? "border-purple-300 shadow-xl shadow-purple-500/5" : "border-slate-200/80")}>
              <SectionHeader num={2} titleStr="Platform & model" desc={platform ? `${platform} ${selectedModels.length > 0 ? `· ${selectedModels.length} model(s)` : ''}` : "Select target AI stack"} />
              <AnimatePresence>
                {activeSection === 2 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-5 md:p-6 pt-0 border-t border-slate-100 mt-2 space-y-6">
                      
                      <div>
                        <label className="text-[13px] font-bold text-slate-800 mb-4 block">AI platform <span className="text-rose-500 text-xs">*</span></label>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                          {platformsData.map(p => (
                            <div key={p.id} onClick={()=>setPlatform(p.id)} className={cn("px-3 py-2 border rounded-xl flex items-center justify-center text-center cursor-pointer text-[11px] font-bold transition-all", platform === p.id ? "bg-purple-50 border-purple-300 text-purple-700 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300")}>{p.name}</div>
                          ))}
                        </div>
                      </div>

                      {modelsData.length > 0 && (
                        <div className="space-y-4">
                          {Object.entries(
                            modelsData.reduce((acc: any, m: any) => {
                              const groupName = m.model_groups?.name || 'Other';
                              if (!acc[groupName]) acc[groupName] = [];
                              acc[groupName].push(m);
                              return acc;
                            }, {})
                          ).map(([group, models]: any) => (
                            <div key={group}>
                              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 block">{group}</label>
                              <div className="flex flex-wrap gap-2">
                                {models.map((m: any) => {
                                  const isSelected = selectedModels.includes(m.id);
                                  let tagStr = "";
                                  if (m.model_tags && m.model_tags.length > 0) {
                                    tagStr = m.model_tags.map((mt: any) => mt.tags?.name).filter(Boolean).join(" · ");
                                  }
                                  return (
                                    <div 
                                      key={m.id} 
                                      onClick={() => {
                                        if (isSelected) {
                                          setSelectedModels(prev => prev.filter(id => id !== m.id));
                                        } else {
                                          setSelectedModels(prev => [...prev, m.id]);
                                        }
                                      }}
                                      className={cn(
                                        "px-4 py-2 border rounded-full cursor-pointer transition-all flex flex-col items-center justify-center text-center",
                                        isSelected 
                                          ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/20" 
                                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                      )}
                                    >
                                      <div className="text-[12px] font-bold flex items-center justify-center">
                                         {m.name} {isSelected && <span className="ml-1.5 opacity-80 text-[10px]">✕</span>}
                                      </div>
                                      {tagStr && (
                                        <div className={cn("text-[9.5px] font-semibold mt-0.5", isSelected ? "text-slate-300" : "text-slate-400")}>
                                          {tagStr}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div>
                         <label className="text-[11px] font-black uppercase text-slate-500 mb-2 block">Last verified date</label>
                         <input type="text" value={verifiedDate} onChange={e=>setVerifiedDate(e.target.value)} placeholder="e.g. March 2025" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" />
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="text-[11px] font-black uppercase text-slate-500 mb-2 block">Cover Image (Live Preview)</label>
                        <input type="file" accept="image/*" className="hidden" id="coverUpload" onChange={(e) => {
                           if(e.target.files && e.target.files[0]) {
                             setCoverFile(e.target.files[0]);
                             setImagePreview(URL.createObjectURL(e.target.files[0]));
                           }
                        }} />
                        <label htmlFor="coverUpload" className="w-full h-32 border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
                           {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="" /> : <UploadCloud className="w-6 h-6 text-slate-400" />}
                        </label>
                      </div>

                      <div className="pt-5 flex items-center gap-3 border-t border-slate-100 mt-5">
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Save draft</button>
                        <button onClick={() => { setCompletedSections(prev => [...prev.filter(x => x!==2), 2]); setActiveSection(3); }} className="flex-1 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm">Save & continue →</button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* --- 3. CATEGORY & AUDIENCE --- */}
            <motion.div className={cn("bg-white rounded-[20px] border transition-all duration-300 overflow-hidden", activeSection === 3 ? "border-purple-300 shadow-xl shadow-purple-500/5" : "border-slate-200/80")}>
              <SectionHeader num={3} titleStr="Category, audience & output format" desc={category || "Define who it's for"} />
              <AnimatePresence>
                {activeSection === 3 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-5 md:p-6 pt-0 border-t border-slate-100 mt-2 space-y-8">
                      
                      <div>
                        <label className="text-[13px] font-bold text-slate-800 mb-1 block">Primary category <span className="text-rose-500 text-xs">*</span></label>
                        <p className="text-[11px] font-medium text-slate-500 mb-4">Every prompt belongs to exactly one main category. Select the grouping below to find the best fit.</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {categoriesData.map((c: any) => (
                            <div 
                              key={c.id} 
                              onClick={()=>setCategory(c.id)} 
                              className={cn(
                                "px-4 py-2 border rounded-full cursor-pointer transition-all flex flex-col items-center justify-center text-center", 
                                category===c.id 
                                  ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20" 
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                              )}
                            >
                               <div className="text-[12px] font-bold flex items-center justify-center">
                                 {c.name}
                               </div>
                               {c.description && (
                                 <div className={cn("text-[9.5px] font-semibold mt-0.5", category===c.id ? "text-purple-100" : "text-slate-400")}>
                                   {c.description}
                                 </div>
                               )}
                            </div>
                          ))}
                        </div>

                        {subcatsData.length > 0 && (
                           <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                             <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block flex items-center gap-2">Subcategory <span className="text-[9px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 normal-case tracking-normal">OPTIONAL</span></label>
                             <div className="flex flex-wrap gap-2">
                               <div 
                                 onClick={()=>setSubCategory("")} 
                                 className={cn(
                                   "px-4 py-2 border rounded-full cursor-pointer transition-all flex flex-col items-center justify-center text-center text-[12px] font-bold", 
                                   subCategory === "" 
                                     ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20" 
                                     : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                 )}
                               >
                                 Any subcategory
                               </div>
                               {subcatsData.map((s: any) => (
                                 <div 
                                   key={s.id} 
                                   onClick={()=>setSubCategory(s.id)} 
                                   className={cn(
                                     "px-4 py-2 border rounded-full cursor-pointer transition-all flex flex-col items-center justify-center text-center", 
                                     subCategory === s.id 
                                       ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20" 
                                       : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                   )}
                                 >
                                   <div className="text-[12px] font-bold flex items-center justify-center">
                                     {s.name}
                                   </div>
                                   {s.description && (
                                     <div className={cn("text-[9.5px] font-semibold mt-0.5", subCategory === s.id ? "text-purple-100" : "text-slate-400")}>
                                       {s.description}
                                     </div>
                                   )}
                                 </div>
                               ))}
                             </div>
                             <p className="text-[11px] font-medium text-slate-500 mt-2">Deeply categorizing helps buyers find your prompt faster in filtered searches.</p>
                           </div>
                        )}
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <label className="text-[13px] font-bold text-slate-800 mb-1 block flex items-center gap-2">Target audience <span className="text-rose-500 text-xs">*</span></label>
                        <p className="text-[11px] font-medium text-slate-500 mb-4">Select all roles that would find this prompt valuable.</p>
                        <div className="flex flex-wrap gap-2">
                          {["Designers", "Developers", "Marketers", "Founders", "Writers", "Students", "Creators", "Analysts", "Sales"].map(a => (
                             <div key={a} onClick={()=>toggleAudience(a)} className={cn("px-4 py-2 border rounded-full text-center text-[11px] font-bold cursor-pointer transition-all", targetAudience.includes(a)?"bg-slate-900 border-slate-900 text-white":"bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50")}>{a} {targetAudience.includes(a) && "✕"}</div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <label className="text-[13px] font-bold text-slate-800 mb-4 block">Output format <span className="text-rose-500 text-xs">*</span></label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            {n: 'Long-form text', d: 'Articles, essays, reports, documentation', i: AlignLeft},
                            {n: 'Short copy', d: 'Emails, ads, captions, taglines', i: Type},
                            {n: 'Structured data', d: 'JSON, tables, lists, YAML, XML', i: LayoutGrid},
                            {n: 'Code', d: 'Scripts, components, queries, configs', i: Code},
                            {n: 'Image / visual', d: 'Midjourney, DALL-E, FLUX, SD', i: Images},
                            {n: 'Audio / music', d: 'TTS, voice clone, song, sound effects', i: Play},
                            {n: 'Video', d: 'Sora, Runway, Kling, Veo output', i: Play},
                            {n: 'Conversational', d: 'Multi-turn, roleplay, agent dialogue', i: FileText},
                            {n: 'Tool call / function', d: 'API call, function output, action', i: Zap},
                            {n: 'Multiple outputs', d: 'Variations, batch results, ranked', i: ListChecks}
                          ].map(f => {
                             const Icon = f.i;
                             return (
                             <div key={f.n} onClick={()=>setOutputFormat(f.n)} className={cn("p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3", outputFormat===f.n?"bg-purple-50 border-purple-300 ring-1 ring-purple-300 shadow-sm":"bg-white border-slate-200 hover:border-slate-300")}>
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", outputFormat===f.n ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-500")}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className={cn("text-[13px] font-bold mb-0.5", outputFormat===f.n?"text-purple-800":"text-slate-800")}>{f.n}</div>
                                  <div className={cn("text-[11px] leading-relaxed", outputFormat===f.n?"text-purple-600/90":"text-slate-500")}>{f.d}</div>
                                </div>
                             </div>
                             )
                          })}
                        </div>
                      </div>

                      <div className="pt-5 flex items-center gap-3 border-t border-slate-100 mt-4">
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Save draft</button>
                        <button onClick={() => { setCompletedSections(prev => [...prev.filter(x => x!==3), 3]); setActiveSection(4); }} className="flex-1 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm">Save & continue →</button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* --- 4. SCREENSHOTS --- */}
            <motion.div className={cn("bg-white rounded-[20px] border transition-all duration-300 overflow-hidden", activeSection === 4 ? "border-purple-300 shadow-xl shadow-purple-500/5" : "border-slate-200/80")}>
              <SectionHeader num={4} titleStr="Upload output screenshots" desc={screenshots.length > 0 ? `${screenshots.length} screenshot(s)` : "Show proof of execution"} />
              <AnimatePresence>
                {activeSection === 4 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-5 md:p-6 pt-0 border-t border-slate-100 mt-2 space-y-6">
                      
                      <input type="file" multiple accept="image/*,video/*" className="hidden" id="screenshotUpload" onChange={(e) => {
                        if(e.target.files) {
                          const newFiles = Array.from(e.target.files);
                          setScreenshotFiles(prev => [...prev, ...newFiles]);
                          const newUrls = newFiles.map(f => URL.createObjectURL(f));
                          setScreenshots(prev => [...prev, ...newUrls]);
                        }
                      }} />
                      <label htmlFor="screenshotUpload" className="w-full py-10 border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all">
                        <UploadCloud className="w-8 h-8 text-slate-300 mb-2" />
                        <div className="text-sm font-bold text-slate-700">Drag & drop output screenshots here</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-1">PNG, JPG, GIF · Max 10MB each</div>
                      </label>

                      {screenshots.length > 0 && (
                        <div className="flex gap-3 flex-wrap mt-4">
                          {screenshots.map((src, idx) => (
                            <div key={idx} className="w-20 h-20 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center animate-in zoom-in relative overflow-hidden">
                              <img src={src} className="w-full h-full object-cover" alt="" />
                              <div onClick={(e) => { e.stopPropagation(); setScreenshots(s => s.filter((_, i) => i !== idx)); setScreenshotFiles(s => s.filter((_, i) => i !== idx)); }} className="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-rose-500">
                                <span className="text-[10px]">✕</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl text-[11px] text-slate-600 leading-relaxed font-medium">
                        Show the <strong>full output</strong> — buyers want to see everything.<br/>
                        Upload outputs from <strong>different runs</strong> to prove consistency.
                      </div>

                      <div className="pt-5 flex items-center gap-3 border-t border-slate-100 mt-4">
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Save draft</button>
                        <button onClick={() => { setCompletedSections(prev => [...prev.filter(x => x!==4), 4]); setActiveSection(5); }} className="flex-1 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm">Save & continue →</button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* --- 5. DETAILS & TAGS --- */}
            <motion.div className={cn("bg-white rounded-[20px] border transition-all duration-300 overflow-hidden", activeSection === 5 ? "border-purple-300 shadow-xl shadow-purple-500/5" : "border-slate-200/80")}>
              <SectionHeader num={5} titleStr="Details & tags" desc="Complexity and best uses" />
              <AnimatePresence>
                {activeSection === 5 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-5 md:p-6 pt-0 border-t border-slate-100 mt-2 space-y-6">
                      
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Works best for</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {tags.map(t => (
                            <div key={t} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2">
                              {t} <span onClick={() => setTags(tags.filter(tg => tg !== t))} className="text-slate-400 hover:text-rose-500 cursor-pointer">✕</span>
                            </div>
                          ))}
                        </div>
                        <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} onKeyDown={handleTagAdd} placeholder="Type a use case and press Enter..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-500" />
                      </div>

                      <div>
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Complexity level</label>
                        <select value={complexity} onChange={e => setComplexity(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold">
                          <option value="">Select complexity...</option>
                          <option>Beginner — simple to use</option>
                          <option>Intermediate — some familiarity helpful</option>
                          <option>Advanced — requires understanding</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Seller note</label>
                        <textarea value={sellerNote} onChange={e=>setSellerNote(e.target.value)} placeholder="Describe a specific scenario where this prompt shines..." className="w-full min-h-[100px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-500 resize-y" />
                      </div>

                      <div className="pt-5 flex items-center gap-3 border-t border-slate-100 mt-4">
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Save draft</button>
                        <button onClick={() => { setCompletedSections(prev => [...prev.filter(x => x!==5), 5]); setActiveSection(6); }} className="flex-1 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm">Save & continue →</button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* --- 6. PRICE --- */}
            <motion.div className={cn("bg-white rounded-[20px] border transition-all duration-300 overflow-hidden", activeSection === 6 ? "border-purple-300 shadow-xl shadow-purple-500/5" : "border-slate-200/80")}>
              <SectionHeader num={6} titleStr="Set your price" desc={price ? `◈ ${price} coins` : "Coin value per purchase"} />
              <AnimatePresence>
                {activeSection === 6 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-5 md:p-6 pt-0 border-t border-slate-100 mt-2 space-y-6">
                      
                      <div className="flex flex-col gap-6">
                        
                        {/* Header & Quick Select */}
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <label className="text-[13px] font-bold text-slate-800 block">Price per purchase <span className="text-rose-500 text-xs">*</span></label>
                            <p className="text-[11px] font-medium text-slate-500">Set the coin value buyers pay to unlock your prompt.</p>
                          </div>
                          <div className="flex gap-2 hidden sm:flex">
                             {[20, 50, 99].map(val => (
                               <button key={val} onClick={() => setPrice(val.toString())} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 text-[11px] font-bold transition-colors">◈ {val}</button>
                             ))}
                          </div>
                        </div>

                        {/* Main Input Area */}
                        <div className="flex flex-col md:flex-row gap-6 md:items-center bg-slate-50/50 p-6 border border-slate-200 rounded-[24px]">
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                               <span className="text-lg font-black text-amber-600">◈</span>
                            </div>
                            <input type="number" 
                               value={price} 
                               onChange={e => setPrice(e.target.value)} 
                               placeholder="0" 
                               min="10"
                               className="w-full md:w-48 pl-14 pr-6 py-4 bg-white border-2 border-slate-200 hover:border-amber-300 rounded-[18px] text-2xl font-black text-slate-900 shadow-sm focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all" />
                          </div>
                          
                          <div className="hidden md:block h-12 w-px bg-slate-200"></div>
                          <div className="md:hidden w-full h-px bg-slate-200"></div>
                          
                          <div className="flex-1">
                            {parseInt(price) > 0 ? (
                              <div className="flex items-center justify-between px-2 py-1 animate-in slide-in-from-right-2">
                                 <div>
                                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Platform Fee (10%)</div>
                                   <div className="text-sm font-bold text-slate-400 line-through">◈ {Math.round(parseInt(price)*0.1)}</div>
                                 </div>
                                 <div className="text-right">
                                   <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1.5">You Earn</div>
                                   <div className="text-[28px] leading-none font-black text-emerald-600">◈ {Math.round(parseInt(price)*0.9)}</div>
                                 </div>
                              </div>
                            ) : (
                              <div className="text-sm font-bold text-slate-400 px-2 py-4">Enter a price to calculate your earnings.</div>
                            )}
                          </div>
                        </div>

                        {/* Guidance Cards */}
                        <div className="pt-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Pricing Guide</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                             {[
                               {t: 'Under ◈ 30', d: 'Impulse buys. Good for simple, single-use prompts.', match: (p:number) => p > 0 && p < 30},
                               {t: '◈ 30 – 70', d: 'The sweet spot. High volume for quality prompts.', match: (p:number) => p >= 30 && p <= 70},
                               {t: '◈ 70 – 150', d: 'Premium tier. Requires strong proof and use-case.', match: (p:number) => p > 70 && p <= 150},
                               {t: 'Above ◈ 150', d: 'Specialist expert prompts. High value per sale.', match: (p:number) => p > 150}
                             ].map((card, i) => {
                                const isMatch = card.match(parseInt(price) || 0);
                                return (
                                  <div key={i} className={cn("p-4 rounded-xl border transition-all duration-300 relative overflow-hidden", isMatch ? "bg-amber-50 border-amber-300 ring-4 ring-amber-50 shadow-md" : "bg-white border-slate-200 opacity-70 hover:opacity-100")}>
                                     {isMatch && <div className="absolute top-0 right-0 w-8 h-8 bg-amber-200/50 rounded-bl-full"/>}
                                     <div className={cn("text-[13px] font-bold font-mono mb-1.5", isMatch ? "text-amber-800" : "text-slate-700")}>{card.t}</div>
                                     <div className={cn("text-[11px] leading-relaxed", isMatch ? "text-amber-700/80" : "text-slate-500")}>{card.d}</div>
                                     {isMatch && <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-1"><CheckCircle2 className="w-3.5 h-3.5"/> Recommended</div>}
                                  </div>
                                )
                             })}
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 flex items-center gap-3 border-t border-slate-100 mt-8">
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Save draft</button>
                        <button onClick={() => { setCompletedSections(prev => [...prev.filter(x => x!==6), 6]); setActiveSection(7); }} className="flex-1 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm">Save & continue →</button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* --- 7. REVIEW --- */}
            <motion.div className={cn("bg-white rounded-[20px] border transition-all duration-300 overflow-hidden", activeSection === 7 ? "border-purple-300 shadow-xl shadow-purple-500/5" : "border-slate-200/80")}>
              <SectionHeader num={7} titleStr="Review & publish" desc="Final check before live" />
              <AnimatePresence>
                {activeSection === 7 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-5 md:p-6 pt-0 mt-2 space-y-4">
                      
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="flex justify-between items-center p-3 border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Prompt</span><span className="text-purple-600 cursor-pointer" onClick={()=>setActiveSection(1)}>Edit →</span></div>
                        <div className="p-3 px-4 text-xs font-medium flex justify-between border-b border-slate-100"><span className="text-slate-500">Title</span><span className="font-bold text-slate-900">{title || '—'}</span></div>
                        <div className="p-3 px-4 text-xs font-medium flex justify-between"><span className="text-slate-500">Variables</span><span className="font-bold whitespace-pre font-mono text-slate-900">{getVarsCount() ? `${getVarsCount()} detected` : '—'}</span></div>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="flex justify-between items-center p-3 border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Platform & Category</span><span className="text-purple-600 cursor-pointer" onClick={()=>setActiveSection(2)}>Edit →</span></div>
                        <div className="p-3 px-4 text-xs font-medium flex justify-between border-b border-slate-100"><span className="text-slate-500">Platform</span><span className="font-bold text-slate-900">{platform || '—'}</span></div>
                        <div className="p-3 px-4 text-xs font-medium flex justify-between"><span className="text-slate-500">Category</span><span className="font-bold text-slate-900">{category || '—'}</span></div>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="flex justify-between items-center p-3 border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Pricing</span><span className="text-purple-600 cursor-pointer" onClick={()=>setActiveSection(6)}>Edit →</span></div>
                        <div className="p-3 px-4 text-xs font-medium flex justify-between"><span className="text-slate-500">Price</span><span className="font-bold text-slate-900 font-mono">{price ? `◈ ${price}` : '—'}</span></div>
                      </div>

                      <div className="p-4 bg-purple-50/50 border border-purple-100 text-slate-700 rounded-xl text-xs font-medium leading-relaxed mt-4">
                        By publishing you confirm this is your original work and that you have personally tested it. Prompt text is locked after the first purchase.
                      </div>

                      <div className="pt-4 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <button className="px-6 py-4 bg-white border border-slate-200 text-slate-500 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Save draft</button>
                          <button 
                            onClick={handlePublish}
                            disabled={completenessPct < 100 || isPublishing}
                            className={cn("flex-1 py-4 text-white text-sm font-bold rounded-xl transition-all shadow-md relative overflow-hidden", (completenessPct === 100 && !isPublishing) ? "bg-purple-600 hover:bg-purple-700 active:scale-95" : "bg-slate-300 opacity-50 cursor-not-allowed")}>
                             {isPublishing ? (
                               <div className="flex items-center justify-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                  <span>Publishing...</span>
                               </div>
                             ) : "Publish prompt 🚀"}
                             {isPublishing && <motion.div layoutId="load" className="absolute bottom-0 left-0 h-1 bg-white/40" initial={{width:0}} animate={{width:'100%'}} transition={{duration:2}} />}
                          </button>
                        </div>
                        {completenessPct < 100 && (
                          <p className="text-[11px] font-bold text-slate-400 text-center animate-in fade-in slide-in-from-top-1 flex items-center justify-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> {checks.length - checks.filter(c=>c.done).length} more field(s) to go before you can publish.</p>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>


          {/* ── SUCCESS SCREEN OVERLAY ── */}
          <AnimatePresence>
            {isPublished && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 z-50 bg-[#f8f9fc] flex items-center justify-center p-6 text-center">
                <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 relative overflow-hidden">
                   <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                   <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                   
                   <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <CheckCircle2 className="w-12 h-12 stroke-[3px]" />
                   </div>
                   
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Prompt Published!</h2>
                   <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">Your prompt <strong>"{title}"</strong> is now live on the marketplace. Sellers can start earning coins immediately.</p>
                   
                   <div className="flex flex-col gap-3">
                      <button onClick={() => window.location.reload()} className="w-full py-4 bg-purple-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98]">View listings</button>
                      <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-100 text-slate-600 font-bold text-sm rounded-2xl hover:bg-slate-200 transition-all">List another prompt</button>
                   </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* ── RIGHT COLUMN: STICKY PREVIEW & TRACKER ── */}
          <div className="sticky top-28 space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
                <Eye className="w-4 h-4 text-purple-600" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Live Preview</h2>
              </div>
              
              <div className="pt-2">
                <div className="w-full bg-white rounded-xl overflow-hidden border border-slate-200 transition-colors flex flex-col group cursor-pointer shadow-md">
                  <div className="h-[200px] w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
                    {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" /> : <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">Image</span>}
                    <span className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-md z-10">{platform || "Platform"}</span>
                  </div>
                  <div className="p-3 flex flex-col h-full bg-white relative">
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px]"><span className="text-amber-500 tracking-widest">★★★★★</span><span className="font-mono font-bold text-slate-900">0.0</span></div>
                    <div className="text-xs font-bold leading-snug text-slate-900 mb-2 line-clamp-2 min-h-[32px]">{title || "Untitled Prompt Configuration"}</div>
                    <div className="flex gap-1.5 flex-wrap mb-3 min-h-[22px]">
                      {category && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold">{category}</span>}
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 mt-auto">
                      <div className="w-4 h-4 rounded-full bg-purple-500 shadow-sm shrink-0" />
                      <div className="text-[10px] font-medium text-slate-700 flex-1 truncate">You</div>
                      <div className="text-xs font-bold font-mono text-amber-500">◈ {price || "0"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4"><span className="text-[13px] font-bold text-slate-700 tracking-tight">Listing completeness</span><span className="text-base font-black text-amber-500 font-mono">{completenessPct}%</span></div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-500 ease-out" style={{ width: `${completenessPct}%` }}/></div>
              <div className="space-y-3">
                {checks.map((chk, i) => (
                  <div key={i} className="flex items-center gap-3"><div className={cn("w-1.5 h-1.5 rounded-full", chk.done ? "bg-emerald-500" : "bg-slate-200")} /><span className={cn("text-xs font-semibold", chk.done ? "text-slate-400" : "text-slate-600")}>{chk.label}</span></div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
