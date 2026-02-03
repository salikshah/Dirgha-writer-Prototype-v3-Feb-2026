import React, { useState } from 'react';
import { MoreHorizontal, ExternalLink, MessageSquare, Bookmark, PenTool } from 'lucide-react';
import FloatingToolbar from './FloatingToolbar';
import CommandPalette from './CommandPalette';

interface WriterEditorProps {
    onTriggerCommand: () => void;
}

const WriterEditor: React.FC<WriterEditorProps> = ({ onTriggerCommand }) => {
  const [activeCitation, setActiveCitation] = useState<string | null>(null);

  return (
    <div className="flex-1 h-full bg-[#161616] overflow-y-auto relative flex flex-col items-center pt-12 pb-32">
        
        {/* Main Paper Sheet */}
        <div className="w-full max-w-[800px] bg-[#161616] min-h-[1100px] px-8 md:px-12 relative group">
            
            {/* Floating Context HUD (Top Right of Page) */}
            <div className="absolute top-0 right-12 flex items-center gap-4 text-xs font-mono text-carbon-textSecondary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Saved</span>
                <span className="border border-carbon-border px-2 py-0.5 rounded">PDF Export</span>
            </div>

            {/* Document Content */}
            <div className="font-serif text-[#f4f4f4] max-w-2xl mx-auto">
                <div className="font-sans text-carbon-blue text-sm font-medium tracking-wide mb-6 uppercase">
                    Original Research
                </div>
                
                <h1 className="text-4xl font-light leading-tight mb-8 tracking-tight text-white border-none outline-none" contentEditable suppressContentEditableWarning>
                    The integration of Artificial Intelligence in Higher Education: A transformative paradigm
                </h1>

                <div className="flex items-center gap-4 mb-12 text-sm text-carbon-textSecondary font-sans border-b border-carbon-border pb-6">
                    <span className="font-medium text-white">Dr. Sarah Al-Zahrani</span>
                    <span>•</span>
                    <span>October 24, 2024</span>
                    <span>•</span>
                    <span className="font-mono text-xs border border-carbon-border px-1">DRAFT_V2</span>
                </div>

                <h2 className="text-xl font-medium mb-4 font-sans text-white" contentEditable suppressContentEditableWarning>Abstract</h2>
                <p className="mb-8 text-lg leading-relaxed text-gray-300 font-light" contentEditable suppressContentEditableWarning>
                    The pervasive technological integration extends profoundly into research and education, where AI promises transformative advancements in learning methodologies, administrative efficiencies, and the very conduct of scientific inquiry.
                </p>

                <h2 className="text-xl font-medium mb-4 font-sans text-white" contentEditable suppressContentEditableWarning>Introduction</h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-300 font-light">
                   As noted in recent studies, the rapid deployment of generative models has shifted the pedagogical landscape. This shift is not merely instrumental but ontological, reshaping how knowledge is curated and disseminated. 
                   <span 
                        className="relative inline-block text-carbon-blue cursor-pointer hover:underline decoration-carbon-blue/30 ml-1"
                        onMouseEnter={() => setActiveCitation('cit1')}
                        onMouseLeave={() => setActiveCitation(null)}
                   >
                        (Al-Zahrani & Alasmari, 2024).
                        
                        {/* THE CITATION POPOVER */}
                        {activeCitation === 'cit1' && (
                            <div className="absolute z-50 left-1/2 -translate-x-1/2 top-6 w-[400px] bg-white text-gray-900 rounded-lg shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 border border-gray-200">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="h-6 w-6 bg-black rounded-full flex items-center justify-center text-white font-serif font-bold text-xs flex-shrink-0">n</div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-sans uppercase tracking-wider mb-0.5">Article</div>
                                        <h4 className="font-bold text-sm leading-snug mb-1">Exploring the impact of artificial intelligence on higher education: The dynamics of ethical, social, and educational implications</h4>
                                        <div className="text-xs text-gray-600 mb-1">Al-Zahrani, Alasmari</div>
                                        <div className="text-xs text-green-700 font-medium">Humanities and Social Sciences Communications · 2024</div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 mb-3">
                                    <span className="text-[10px] border border-gray-300 rounded px-1.5 py-0.5 bg-gray-50 font-medium text-gray-600">Cited by 46</span>
                                    <span className="text-[10px] border border-gray-300 rounded px-1.5 py-0.5 bg-gray-50 font-medium text-gray-600">Impact Factor 1.94</span>
                                    <span className="text-[10px] border border-gray-300 rounded px-1.5 py-0.5 bg-gray-50 font-medium text-gray-600">Open Access</span>
                                </div>

                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-3">
                                    The research on AI in higher education is a dynamic and ever-evolving field. As AI gains prominence, it becomes essential to explore its impact on the education... <span className="text-blue-600 cursor-pointer">See more</span>
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-1 text-xs font-semibold hover:bg-gray-100 px-2 py-1 rounded transition-colors"><PenTool size={12}/> Edit</button>
                                        <button className="flex items-center gap-1 text-xs font-semibold hover:bg-gray-100 px-2 py-1 rounded transition-colors"><MessageSquare size={12}/> Narrative</button>
                                        <button className="flex items-center gap-1 text-xs font-semibold hover:bg-gray-100 px-2 py-1 rounded transition-colors"><ExternalLink size={12}/> View</button>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-900"><Bookmark size={14} /></button>
                                </div>
                            </div>
                        )}
                   </span>
                </p>
                
                 <p className="mb-6 text-lg leading-relaxed text-gray-300 font-light" contentEditable suppressContentEditableWarning>
                   Furthermore, the integration of Large Language Models (LLMs) requires a re-evaluation of academic integrity policies.
                   <br/><br/>
                   <span className="font-mono text-sm text-carbon-textSecondary bg-carbon-layer px-2 py-1 rounded border border-carbon-border block w-fit">
                       {'$$ \\lim_{x \\to \\infty} \\frac{e^x}{x^n} = \\infty $$'}
                   </span>
                   <br/>
                   This mathematical representation of exponential growth parallels the adoption rate of generative tools in STEM fields.
                </p>
            </div>
        </div>
        
        {/* Bottom Status Bar */}
        <div className="fixed bottom-4 left-20 right-[370px] flex justify-between items-center px-6 py-2 bg-carbon-layer/80 backdrop-blur border border-carbon-border rounded-full text-xs font-mono text-carbon-textSecondary z-40">
             <div className="flex gap-4">
                 <span>Ln 42, Col 12</span>
                 <span>1,204 words</span>
                 <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> AI Active</span>
             </div>
             <div className="flex gap-2">
                 <kbd className="bg-carbon-bg border border-carbon-border px-1.5 rounded text-[10px]">/</kbd> to command
             </div>
        </div>
    </div>
  );
};

export default WriterEditor;