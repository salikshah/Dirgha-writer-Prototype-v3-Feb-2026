import React, { useState } from 'react';
import FloatingToolbar from './FloatingToolbar';
import { ExternalLink, Bookmark, PenTool, MessageSquare, Settings, Clock, Download, Share, Sparkles, Check, X, RefreshCw, Wand2, ArrowRight, List, AlignLeft } from 'lucide-react';

const Editor: React.FC = () => {
  const [hoveredCitation, setHoveredCitation] = useState<string | null>(null);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [rewriteMode, setRewriteMode] = useState<string | null>(null); // 'menu' | 'diff' | null
  const [ghostAccepted, setGhostAccepted] = useState(false);
  const [showMobileOutline, setShowMobileOutline] = useState(false);

  // Mock Outline Data
  const outline = [
    { id: 'title', label: 'Title', active: false },
    { id: 'abstract', label: 'Abstract', active: true },
    { id: 'intro', label: 'Introduction', active: false },
    { id: 'methods', label: 'Methods', active: false },
    { id: 'results', label: 'Results', active: false },
    { id: 'discussion', label: 'Discussion', active: false },
  ];

  const handleRewriteClick = () => {
      setRewriteMode('menu');
  };

  const handleApplyRewrite = () => {
      setRewriteMode('diff');
  };

  const handleAcceptDiff = () => {
      setRewriteMode(null);
      // In a real app, this would update content state
  };

  const handleRejectDiff = () => {
      setRewriteMode(null);
  };

  return (
    <div className="flex-1 h-full bg-[#f9fafb] dark:bg-dark-bg overflow-y-auto relative flex flex-col transition-colors duration-200 scroll-smooth">
        
        {/* Container for Outline and Paper */}
        <div className="flex justify-center w-full min-h-full pt-8 pb-32">
            
            {/* Table of Contents / Outline (Left Sticky - Desktop) */}
            <div className="hidden xl:block w-48 shrink-0 mr-8 relative">
                 <div className="sticky top-12 flex flex-col border-l border-gray-200 dark:border-gray-700 ml-auto w-fit pr-4">
                     {outline.map((item) => (
                         <div key={item.id} className="relative group">
                            <div className={`absolute -left-[1px] top-2 w-[3px] h-4 rounded-full transition-colors ${item.active ? 'bg-brand-600 dark:bg-brand-500' : 'bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600'}`}></div>
                            <button className={`text-xs text-left py-2 pl-4 block transition-colors ${item.active ? 'text-brand-600 dark:text-brand-500 font-medium' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                                {item.label}
                            </button>
                         </div>
                     ))}
                 </div>
            </div>

            {/* Main Paper */}
            <div className="w-full max-w-[850px] bg-white dark:bg-dark-surface shadow-sm border border-gray-200 dark:border-dark-border min-h-[1100px] p-[30px] md:p-[80px] relative transition-colors duration-200">
                
                {/* Document Header Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-12 font-sans">
                    <div className="flex items-center gap-2">
                        {/* Mobile Outline Toggle */}
                        <button 
                            onClick={() => setShowMobileOutline(true)}
                            className="xl:hidden p-1.5 -ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            title="Show Outline"
                        >
                            <AlignLeft size={16} />
                        </button>
                        <span>The Ketogenic Diet and Marathon Running: A ...</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center gap-1.5" title="Export as PDF/Word">
                            <Download size={14} /> Export
                        </button>
                        <button className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center gap-1.5" title="Publish to Web">
                            <Share size={14} /> Publish
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="w-px h-3 bg-gray-300 dark:bg-gray-700 mx-1"></span>
                            <button className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors" title="Document Settings">
                                <Settings size={16} />
                            </button>
                            <button className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors" title="Version History">
                                <Clock size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Outline Overlay */}
                {showMobileOutline && (
                    <div className="absolute inset-0 z-50 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm p-6 md:p-12 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-gray-100">Table of Contents</h3>
                            <button 
                                onClick={() => setShowMobileOutline(false)}
                                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto">
                             {outline.map((item) => (
                                 <button 
                                    key={item.id} 
                                    onClick={() => setShowMobileOutline(false)}
                                    className={`text-left py-3 px-4 rounded-lg text-sm transition-all ${
                                        item.active 
                                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-semibold' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {item.label}
                                </button>
                             ))}
                        </div>
                        <div className="mt-auto pt-6 text-center">
                            <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Document Outline</span>
                        </div>
                    </div>
                )}

                {/* Document Content */}
                <div className="font-serif text-gray-900 dark:text-gray-100">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-8 tracking-tight" contentEditable suppressContentEditableWarning>
                        The Ketogenic Diet and Marathon Running: A Performance Paradox
                    </h1>

                    <h2 className="text-lg font-bold mb-3 font-sans" contentEditable suppressContentEditableWarning>Disclosure</h2>
                    <p className="mb-8 text-base leading-7 text-gray-700 dark:text-gray-300" contentEditable suppressContentEditableWarning>
                        Portions of this manuscript were drafted with the support of AI writing tools, and all sources have been verified by the author.
                    </p>

                    <h2 className="text-lg font-bold mb-3 font-sans" contentEditable suppressContentEditableWarning>Abstract</h2>
                    <div className="mb-8 text-base leading-7 text-gray-700 dark:text-gray-300 relative group" onMouseEnter={() => setActiveBlock('abstract')} onMouseLeave={() => setActiveBlock(null)}>
                         <p contentEditable suppressContentEditableWarning>
                        The role of macronutrient composition in optimizing sports endurance is a key topic in sports nutrition. This study investigated the impact of a ketogenic diet on marathon performance compared to a high-carbohydrate diet. Participants completed a standardized marathon race after 12 weeks on either a KD or HCD. Primary outcomes included marathon time and running pace. Secondary measures included VO2 max, fat oxidation rates, post-race glycogen depletion and subjective fatigue. The KD group exhibited slower marathon times and running pace compared to the HCD group, despite demonstrating significantly higher rates of fat oxidation 
                        {/* Hoverable Citation 1 */}
                        <span 
                            className="relative inline-block text-brand-600 dark:text-brand-400 cursor-pointer mx-1"
                            onMouseEnter={() => setHoveredCitation('cit1')}
                            onMouseLeave={() => setHoveredCitation(null)}
                        >
                            (Volek & Phinney, 2018).
                            {hoveredCitation === 'cit1' && (
                                <CitationPopover 
                                    type="Review"
                                    title="Metabolic and endocrine aspects of the ketogenic diet"
                                    authors="Volek, Phinney"
                                    journal="Journal of Endocrinology"
                                    year={2018}
                                    citations={124}
                                    impactFactor={4.12}
                                    abstract="The ketogenic diet (KD) has gained popularity not only for weight loss but also for its potential therapeutic effects on various metabolic disorders. This review explores the endocrine adaptations..."
                                />
                            )}
                        </span>
                        VO2 max was similar between groups, while post-race glycogen depletion was lower in the KD group.
                        </p>
                    </div>

                    <h2 className="text-lg font-bold mb-3 font-sans" contentEditable suppressContentEditableWarning>Introduction</h2>
                    
                    {/* Paragraph with Rewrite Feature */}
                    <div 
                        className="relative group mb-4"
                        onMouseEnter={() => setActiveBlock('intro1')}
                        onMouseLeave={() => setActiveBlock(null)}
                    >
                        {/* AI Handle */}
                        <div className={`absolute -left-10 top-1 transition-opacity duration-200 ${activeBlock === 'intro1' || rewriteMode ? 'opacity-100' : 'opacity-0'}`}>
                             <button 
                                onClick={handleRewriteClick}
                                className="p-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 shadow-sm border border-purple-100 dark:border-purple-800 transition-colors"
                                title="AI Rewrite Suggestions"
                             >
                                 <Sparkles size={16} />
                             </button>
                        </div>
                        
                        {/* Rewrite Menu Popover */}
                        {rewriteMode === 'menu' && (
                            <div className="absolute left-0 -top-12 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-1 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <button onClick={handleApplyRewrite} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md whitespace-nowrap">
                                    <Wand2 size={12} className="text-purple-500" /> Make Academic
                                </button>
                                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                                <button onClick={handleApplyRewrite} className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">Shorten</button>
                                <button onClick={handleApplyRewrite} className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">Expand</button>
                                <button onClick={() => setRewriteMode(null)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md ml-1"><X size={12} /></button>
                            </div>
                        )}

                        {/* Diff View Mode */}
                        {rewriteMode === 'diff' ? (
                            <div className="bg-white dark:bg-dark-surface p-4 rounded-lg border border-purple-100 dark:border-purple-900/50 shadow-sm relative">
                                <div className="text-base leading-7 text-gray-400 line-through decoration-red-400/50 mb-2">
                                     Marathon running places extreme physiological demands on the human body, requiring sustained energy output over several hours. Historically, high-carbohydrate diets have been the gold standard for endurance athletes to maximize glycogen stores. However, recent interest has surged regarding ketogenic diets—high-fat, low-carbohydrate regimens—as a potential alternative strategy.
                                </div>
                                <div className="text-base leading-7 text-gray-900 dark:text-gray-100 bg-green-50/50 dark:bg-green-900/10 p-1 -mx-1 rounded">
                                     Marathon running imposes severe physiological exigencies on the human organism, necessitating prolonged energy expenditure. Conventionally, high-carbohydrate nutritional protocols have constituted the gold standard for endurance athletes to optimize glycogen reserves. Nevertheless, there has been a burgeoning interest in ketogenic diets—characterized by high-fat and low-carbohydrate intake—as a viable alternative paradigm.
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <button onClick={handleAcceptDiff} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 shadow-sm">
                                        <Check size={12} /> Accept Change
                                    </button>
                                    <button onClick={handleRejectDiff} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <X size={12} /> Reject
                                    </button>
                                    <button onClick={handleApplyRewrite} className="flex items-center gap-1 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-xs font-medium ml-auto">
                                        <RefreshCw size={12} /> Regenerate
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-base leading-7 text-gray-700 dark:text-gray-300" contentEditable suppressContentEditableWarning>
                                Marathon running places extreme physiological demands on the human body, requiring sustained energy output over several hours. Historically, high-carbohydrate diets have been the gold standard for endurance athletes to maximize glycogen stores. However, recent interest has surged regarding ketogenic diets—high-fat, low-carbohydrate regimens—as a potential alternative strategy.
                            </p>
                        )}
                    </div>
                    
                    {/* Ghost Text Suggestion Paragraph */}
                    <div className="relative group">
                        <p className="mb-4 text-base leading-7 text-gray-700 dark:text-gray-300 focus:outline-none" contentEditable suppressContentEditableWarning>
                            Proponents of the ketogenic diet argue that by adapting the body to utilize fat as its primary fuel source, athletes can tap into a virtually unlimited energy reservoir. Conversely, critics maintain that the metabolic inefficiency of fat oxidation at high intensities compromises peak performance 
                            {/* Hoverable Citation 2 */}
                            <span 
                                    className="relative inline-block text-brand-600 dark:text-brand-400 cursor-pointer mx-1"
                                    onMouseEnter={() => setHoveredCitation('cit2')}
                                    onMouseLeave={() => setHoveredCitation(null)}
                                >
                                    (Helge, 2017).
                                    {hoveredCitation === 'cit2' && (
                                        <CitationPopover 
                                            type="Article"
                                            title="A high carbohydrate diet remains the evidence based choice for elite athletes"
                                            authors="Jørn W. Helge"
                                            journal="The Journal of Physiology"
                                            year={2017}
                                            citations={89}
                                            impactFactor={5.5}
                                            abstract="Despite recent interest in high-fat diets, carbohydrate availability remains the primary limiting factor for performance during prolonged, high-intensity exercise..."
                                        />
                                    )}
                            </span>
                            {!ghostAccepted ? (
                                <span className="text-gray-400 dark:text-gray-500 select-none italic">
                                    due to the obligate reliance on carbohydrate flux during anaerobic bursts.
                                    <span 
                                        className="inline-flex items-center justify-center ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px] not-italic font-sans text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                                        onClick={() => setGhostAccepted(true)}
                                        title="Press Tab to accept"
                                    >
                                        Tab <ArrowRight size={8} className="ml-1" />
                                    </span>
                                </span>
                            ) : (
                                <span>due to the obligate reliance on carbohydrate flux during anaerobic bursts.</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Right Spacer for balance (optional) */}
            <div className="hidden xl:block w-48 shrink-0 ml-8"></div>

        </div>
        
        {/* Floating Toolbar */}
        <FloatingToolbar />
    </div>
  );
};

interface CitationPopoverProps {
    type: string;
    title: string;
    authors: string;
    journal: string;
    year: number;
    citations: number;
    impactFactor: number;
    abstract: string;
}

const CitationPopover: React.FC<CitationPopoverProps> = ({ type, title, authors, journal, year, citations, impactFactor, abstract }) => {
    return (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 top-6 w-[350px] md:w-[380px] bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 rounded-lg shadow-xl p-4 animate-in fade-in zoom-in-95 duration-200 border border-gray-200 dark:border-dark-border font-sans cursor-default">
            <div className="flex items-start gap-3 mb-3">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white font-serif font-bold text-xs flex-shrink-0 ${type === 'Article' ? 'bg-gray-900 dark:bg-gray-700' : 'bg-purple-600 dark:bg-purple-700'}`}>
                    {type[0]}
                </div>
                <div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 font-sans uppercase tracking-wider mb-0.5">{type}</div>
                    <h4 className="font-bold text-sm leading-snug mb-1 text-gray-900 dark:text-gray-100">{title}</h4>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{authors}</div>
                    <div className="text-xs text-green-700 dark:text-green-400 font-medium">{journal} · {year}</div>
                </div>
            </div>
            
            <div className="flex gap-2 mb-3">
                <span className="text-[10px] border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 font-medium text-gray-600 dark:text-gray-300">Cited by {citations}</span>
                <span className="text-[10px] border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 font-medium text-gray-600 dark:text-gray-300">Impact Factor {impactFactor}</span>
                <span className="text-[10px] border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 font-medium text-gray-600 dark:text-gray-300">Open Access</span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-3">
                {abstract} <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">See more</span>
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"><PenTool size={12}/> Edit</button>
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"><MessageSquare size={12}/> Narrative</button>
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"><ExternalLink size={12}/> View</button>
                </div>
                <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700"><Bookmark size={14} /></button>
            </div>
        </div>
    );
};

export default Editor;