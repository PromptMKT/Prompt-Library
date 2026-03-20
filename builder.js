const fs = require('fs');
let lines = fs.readFileSync('src/app/upload/page.tsx', 'utf8').split('\n');

// Help fn to find line indices by substring
function f(startStr, fromIdx = 0) {
  for (let i = fromIdx; i < lines.length; i++) {
    if (lines[i].includes(startStr)) return i;
  }
  return -1;
}

// 1. imports
lines[f('import { useState }')] = 'import { useState, useEffect } from "react";\nimport { supabase } from "@/lib/supabase";\nimport { uploadToCloudinary } from "@/app/actions/upload-cloudinary";';

// 2. Remove PLATFORM_MODELS and SUBCATS
let pmStart = f('const PLATFORM_MODELS');
let scEnd = f('};', f('const SUBCATS'));
for(let i=pmStart; i<=scEnd; i++) lines[i] = '';

// 3. States & Effects
let compSec = f('const [completedSections');
const stateVars = `
  const [platformsData, setPlatformsData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [modelsData, setModelsData] = useState<any[]>([]);
  const [subcatsData, setSubcatsData] = useState<any[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  
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
       supabase.from('models').select('*, model_groups!inner(platform_id)').eq('model_groups.platform_id', platform).then(({data}) => {
          if(data) setModelsData(data || []);
       });
    } else {
       setModelsData([]);
    }
  }, [platform]);
`;
lines.splice(compSec + 1, 0, stateVars);

// 4. handlePublish (find start and end)
let hpStart = f('const handlePublish = () => {');
let hpEnd = hpStart;
while (!lines[hpEnd].includes('  };') || lines[hpEnd].indexOf('}') !== 2) hpEnd++; // Find the closing brace of handlePublish

const publishFunc = `
  const handlePublish = async () => {
    if (completenessPct < 100) return;
    setIsPublishing(true);
    try {
      let coverUrl = "";
      if (coverFile) {
        const fd = new FormData();
        fd.append('file', coverFile);
        coverUrl = await uploadToCloudinary(fd);
      }
      
      const screenshotUrls = [];
      for (const file of screenshotFiles) {
        const fd = new FormData();
        fd.append('file', file);
        const url = await uploadToCloudinary(fd);
        screenshotUrls.push(url);
      }

      let pText = promptText;
      if (promptTab === 'system') pText = \`System: \${systemText}\\n\\nUser: \${promptText}\`;
      if (promptTab === 'chain') pText = JSON.stringify(chainSteps);

      const submitData = {
         title,
         tagline,
         prompt_text: pText,
         price: parseInt(price),
         category_id: category || null,
         subcategory_id: subCategory || null,
         platform_id: platform || null,
         model_id: modelVersion || null,
         cover_image: coverUrl,
         screenshots: screenshotUrls,
         tags: tags,
         complexity: complexity
      };
      
      const { error } = await supabase.from('prompts').insert([submitData]);
      if (error) throw error;
      
      setIsPublished(true);
    } catch (err: any) {
      alert("Error publishing: " + err.message);
    } finally {
      setIsPublishing(false);
    }
  };
`;
lines.splice(hpStart, hpEnd - hpStart + 1, publishFunc);

// 5. Platforms grid
// The block spans from "AI platform <span" down to the next specific block.
let platStart = f('AI platform <span');
let specMod = f('Specific model version');
// Replace the big hardcoded chunk directly avoiding messy splicing
// I will just erase the lines between platStart + 1 and specMod - 3
for (let i = platStart + 1; i < specMod - 3; i++) {
  lines[i] = '';
}
lines[platStart + 1] = `
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                          {platformsData.map(p => (
                            <div key={p.id} onClick={()=>setPlatform(p.id)} className={cn("px-3 py-2 border rounded-xl flex items-center justify-center text-center cursor-pointer text-[11px] font-bold transition-all", platform === p.id ? "bg-purple-50 border-purple-300 text-purple-700 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300")}>{p.name}</div>
                          ))}
                        </div>
`;

// 6. Models select
let modStart = specMod - 2;
let modEnd = f('{PLATFORM_MODELS[platform].map', modStart);
if (modEnd !== -1) {
  lines[modStart] = `                      {modelsData.length > 0 && (`;
  lines[modEnd] = `                            {modelsData.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}`;
}

// 7. Cover Image Upload
let covStart = f('Cover Image (Live Preview)');
let covDiv = covStart + 1;
// It spans 3 lines
lines[covDiv] = `                        <input type="file" accept="image/*" className="hidden" id="coverUpload" onChange={(e) => {
                           if(e.target.files && e.target.files[0]) {
                             setCoverFile(e.target.files[0]);
                             setImagePreview(URL.createObjectURL(e.target.files[0]));
                           }
                        }} />
                        <label htmlFor="coverUpload" className="w-full h-32 border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
                           {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="" /> : <UploadCloud className="w-6 h-6 text-slate-400" />}
                        </label>`;
lines[covDiv + 1] = '';
lines[covDiv + 2] = '';

// 8. Categories Grid
let catStart = f('Primary category <span');
let audStart = f('Target audience <span');
// Hardcoded section spans from catStart + 4 to audStart - 4
for (let i = catStart + 4; i < audStart - 4; i++) {
  lines[i] = '';
}
lines[catStart + 4] = `
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                          {categoriesData.map((c: any) => (
                            <div key={c.id} onClick={()=>setCategory(c.id)} className={cn("p-4 border rounded-xl cursor-pointer transition-colors flex flex-col justify-center", category===c.id?"bg-purple-50 border-purple-300 ring-1 ring-purple-300":"bg-white border-slate-200 hover:border-slate-300")}>
                               <div className={cn("text-[13px] font-bold mb-1.5 flex justify-between", category===c.id?"text-purple-800":"text-slate-800")}>{c.name} {category===c.id && <CheckCircle2 className="w-4 h-4 text-purple-500"/>}</div>
                               <div className={cn("text-[11px] leading-relaxed", category===c.id?"text-purple-600/90":"text-slate-500")}>{c.description}</div>
                            </div>
                          ))}
                        </div>
                        {subcatsData.length > 0 && (
                           <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                             <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block flex items-center gap-2">Subcategory <span className="text-[9px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 normal-case tracking-normal">OPTIONAL</span></label>
                             <select value={subCategory} onChange={e=>setSubCategory(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-500">
                               <option value="">Select specific subcategory...</option>
                               {subcatsData.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                             </select>
                           </div>
                        )}
`;

// 9. Screenshots upload
let dropStart = f('Upload output screenshots');
let ssStart = f('<div onClick={() => setScreenshots', dropStart);
// spans ~5 lines
for (let i = ssStart; i < ssStart + 5; i++) lines[i] = '';
lines[ssStart] = `
                      <input type="file" multiple accept="image/*,video/*" className="hidden" id="screenshotUpload" onChange={(e) => {
                        if(e.target.files) {
                          const newFiles = Array.from(e.target.files);
                          setScreenshotFiles([...screenshotFiles, ...newFiles]);
                          const newUrls = newFiles.map(f => URL.createObjectURL(f));
                          setScreenshots(prev => [...prev, ...newUrls]);
                        }
                      }} />
                      <label htmlFor="screenshotUpload" className="w-full py-10 border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all">
                        <UploadCloud className="w-8 h-8 text-slate-300 mb-2" />
                        <div className="text-sm font-bold text-slate-700">Drag & drop output screenshots here</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-1">PNG, JPG, GIF · Max 10MB each</div>
                      </label>
`;

// Fix array mapping inside screenshots
let mapi = f('screenshots.map((_, idx)', dropStart);
if (mapi !== -1) {
  lines[mapi] = '                          {screenshots.map((src, idx) => (';
  let ssdel = f('setScreenshots(s => s.filter((_, i) => i !== idx)', mapi);
  if (ssdel !== -1) {
    lines[ssdel] = '                              <div onClick={(e) => { e.stopPropagation(); setScreenshots(s => s.filter((_, i) => i !== idx)); setScreenshotFiles(s => s.filter((_, i) => i !== idx)); }} className="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-rose-500">';
  }
}

fs.writeFileSync('src/app/upload/page.tsx', lines.join('\n'));
console.log('Update robust applied!');
