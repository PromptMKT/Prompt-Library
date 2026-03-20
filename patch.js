const fs = require('fs');

try {
  let code = fs.readFileSync('src/app/upload/page.tsx.backup', 'utf8');

  // 1. imports
  code = code.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";\nimport { supabase } from "@/lib/supabase";\nimport { uploadToCloudinary } from "@/app/actions/upload-cloudinary";');

  // 2. remove PLATFORM_MODELS and SUBCATS
  code = code.replace(/const PLATFORM_MODELS: Record<string, string\[\]> = \{[\s\S]*?\};\n/, '');
  code = code.replace(/const SUBCATS: Record<string, string\[\]> = \{[\s\S]*?\};\n/, '');

  // 3. state variables for fetched data inside component
  const stateVars = `
  const [platformsData, setPlatformsData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [modelsData, setModelsData] = useState<any[]>([]);
  const [subcatsData, setSubcatsData] = useState<any[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
`;
  code = code.replace('const [completedSections, setCompletedSections] = useState<number[]>([]);', 'const [completedSections, setCompletedSections] = useState<number[]>([]);\n' + stateVars);

  // 4. useEffect hooks
  const effects = `
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
  code = code.replace('const [title, setTitle] = useState("");', effects + '\n  const [title, setTitle] = useState("");');

  // 5. the publish function
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
  code = code.replace(/const handlePublish = \(\) => \{[\s\S]*?\};\n/, publishFunc);

  // 6. UI platforms grid
  const platformsGridStr = `
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                          {platformsData.map(p => (
                            <div key={p.id} onClick={()=>setPlatform(p.id)} className={cn("px-3 py-2 border rounded-xl flex items-center justify-center text-center cursor-pointer text-[11px] font-bold transition-all", platform === p.id ? "bg-purple-50 border-purple-300 text-purple-700 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300")}>{p.name}</div>
                          ))}
                        </div>
`;
  code = code.replace(/<div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">[\s\S]*?<div className="grid grid-cols-1 mb-4">/m, platformsGridStr + '\n                        <div className="grid grid-cols-1 mb-4">');
  code = code.replace(/<div className="text-\[10px\] font-bold uppercase tracking-widest text-slate-400 mb-2">Text & Multimodal<\/div>/, '');

  // 7. Models select
  code = code.replace(/\{platform && PLATFORM_MODELS\[platform\] && \([\s\S]*?\}\)/m, `
                      {modelsData.length > 0 && (
                        <div>
                          <label className="text-[11px] font-black uppercase text-slate-500 mb-2 block">Specific model version</label>
                          <select value={modelVersion} onChange={e=>setModelVersion(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold">
                            <option value="">Select version...</option>
                            {modelsData.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                        </div>
                      )}
`);

  // 8. Categories Grid
  const catsGridStr = `
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                          {categoriesData.map(c => (
                            <div key={c.id} onClick={()=>setCategory(c.id)} className={cn("p-4 border rounded-xl cursor-pointer transition-colors flex flex-col justify-center", category===c.id?"bg-purple-50 border-purple-300 ring-1 ring-purple-300":"bg-white border-slate-200 hover:border-slate-300")}>
                               <div className={cn("text-[13px] font-bold mb-1.5 flex justify-between", category===c.id?"text-purple-800":"text-slate-800")}>{c.name} {category===c.id && <CheckCircle2 className="w-4 h-4 text-purple-500"/>}</div>
                               <div className={cn("text-[11px] leading-relaxed", category===c.id?"text-purple-600/90":"text-slate-500")}>{c.description}</div>
                            </div>
                          ))}
                        </div>
`;
  code = code.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6\">[\s\S]*?<\/div>\s*<\/div>\s*\{category && SUBCATS\[category\]/m, catsGridStr + '\n                        {subcatsData.length > 0');

  // 9. Subcats select
  code = code.replace(/\{subcatsData\.length > 0 && \([\s\S]*?\}\)/m, `
                        {subcatsData.length > 0 && (
                           <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                             <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block flex items-center gap-2">Subcategory <span className="text-[9px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 normal-case tracking-normal">OPTIONAL</span></label>
                             <select value={subCategory} onChange={e=>setSubCategory(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-500">
                               <option value="">Select specific subcategory...</option>
                               {subcatsData.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                             </select>
                           </div>
                        )}
`);

  // 10. Cover upload
  code = code.replace(/<div onClick=\{\(\) => setImagePreview\("https:\/\/images\.unsplash\.com\/photo-1618005182384-a83a8bd57fbe\?w=800"\)\} className="w-full h-32 border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden group">[\s\S]*?<\/div>/m, `
                        <input type="file" accept="image/*" className="hidden" id="coverUpload" onChange={(e) => {
                           if(e.target.files && e.target.files[0]) {
                             setCoverFile(e.target.files[0]);
                             setImagePreview(URL.createObjectURL(e.target.files[0]));
                           }
                        }} />
                        <label htmlFor="coverUpload" className="w-full h-32 border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
                           {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="" /> : <UploadCloud className="w-6 h-6 text-slate-400" />}
                        </label>
`);

  // 11. Screenshots upload
  code = code.replace(/<div onClick=\{\(\) => setScreenshots\(prev => \[\.\.\.prev, "IMG"\]\)\} className="w-full py-10 border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all">[\s\S]*?<\/div>/m, `
                      <input type="file" multiple accept="image/*,video/*" className="hidden" id="screenshotUpload" onChange={(e) => {
                        if(e.target.files) {
                          const newFiles = Array.from(e.target.files);
                          setScreenshotFiles([...screenshotFiles, ...newFiles]);
                          const newUrls = newFiles.map(f => URL.createObjectURL(f));
                          setScreenshots([...screenshots, ...newUrls]);
                        }
                      }} />
                      <label htmlFor="screenshotUpload" className="w-full py-10 border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all">
                        <UploadCloud className="w-8 h-8 text-slate-300 mb-2" />
                        <div className="text-sm font-bold text-slate-700">Drag & drop output screenshots here</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-1">PNG, JPG, GIF · Max 10MB each</div>
                      </label>
`);

  fs.writeFileSync('src/app/upload/page.tsx', code);
  console.log('Update successful');
} catch (e) {
  console.error("Error formatting:", e);
}
