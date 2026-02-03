import React, { useState, useEffect } from 'react';
import LibrarySidebar from './components/LibrarySidebar';
import AssistantSidebar from './components/AssistantSidebar';
import Editor from './components/Editor';
import { Source, ChatMessage } from './types';
import { generateTextResponse } from './services/geminiService';
import { 
  Sun, Moon, Maximize2, Minimize2, Book, Edit3, MessageSquare, 
  Library, PanelRightOpen, PanelRightClose, BookOpen
} from 'lucide-react';

// Mock Data
const MOCK_SOURCES: Source[] = [
  {
    id: '1',
    title: 'A high carbohydrate diet remains the evidence based choice for elite athletes',
    authors: ['Helge'],
    journal: 'The Journal of Physiology',
    year: 2017,
    type: 'Personal Communication',
    selected: false
  },
  {
    id: '2',
    title: 'Dietary Fuels in Athletic Performance',
    authors: ['Fritzen', 'Lundsgaard', 'Kiens'],
    journal: 'Annual Review of Nutrition',
    year: 2019,
    type: 'Review',
    selected: false
  },
  {
    id: '3',
    title: 'Performance enhancement by carbohydrate intake during sport: effects of carbo...',
    authors: ['Beelen', 'Cermak', 'Loon'],
    journal: 'PubMed',
    year: 2015,
    type: 'Article',
    selected: false
  },
  {
    id: '4',
    title: 'Metabolic Effects of Ketogenic Diets: Exploring Whole-Body Metabolism in...',
    authors: ['Ahmad', 'Seo', 'Jang'],
    journal: 'International Journal of Molecular...',
    year: 2024,
    type: 'Review',
    selected: false
  },
  {
      id: '5',
      title: 'Metabolic and endocrine aspects of the ketogenic diet',
      authors: ['Volek', 'Phinney'],
      journal: 'Journal of Endocrinology',
      year: 2018,
      type: 'Review',
      selected: false
  }
];

type MobileView = 'library' | 'editor' | 'assistant';

const App: React.FC = () => {
  // Data State
  const [sources, setSources] = useState<Source[]>(MOCK_SOURCES);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // UI State
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('editor');

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleSource = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setChatHistory(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const responseText = await generateTextResponse(
          chatHistory.map(m => ({ role: m.role, text: m.text })), 
          text,
          "The user is writing a paper titled 'The Ketogenic Diet and Marathon Running: A Performance Paradox'. They argue that while fat oxidation increases, performance speed decreases."
      );
      
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Sorry, I encountered a connection error. Please ensure your API key is configured.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleZenMode = () => {
    if (leftOpen || rightOpen) {
      setLeftOpen(false);
      setRightOpen(false);
    } else {
      setLeftOpen(true);
      setRightOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 overflow-hidden font-sans transition-colors duration-200">
      
      {/* Top Navigation Bar (Desktop & Mobile Header) */}
      <div className="h-12 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface flex items-center justify-between px-4 z-50 flex-shrink-0">
         <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-brand-600 dark:text-brand-500">Writer</span>
         </div>

         <div className="flex items-center gap-1 md:gap-2">
            
            {/* Desktop Controls Group */}
            <div className="hidden md:flex items-center gap-1">
                {/* Library Toggle */}
                <button 
                  onClick={() => setLeftOpen(!leftOpen)} 
                  className={`p-2 rounded-lg transition-all ${leftOpen ? 'bg-gray-100 dark:bg-gray-700 text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  title={leftOpen ? "Close Library" : "Open Library"}
                >
                   <Library size={18} />
                </button>

                {/* AI Chat Toggle */}
                <button 
                  onClick={() => setRightOpen(!rightOpen)} 
                  className={`p-2 rounded-lg transition-all ${rightOpen ? 'bg-gray-100 dark:bg-gray-700 text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  title={rightOpen ? "Close AI Chat" : "Open AI Chat"}
                >
                   <MessageSquare size={18} />
                </button>

                <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-2"></div>

                {/* Zen Mode */}
                <button 
                    onClick={toggleZenMode}
                    className={`p-2 rounded-lg transition-colors ${(!leftOpen && !rightOpen) ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    title="Zen Mode"
                >
                    {(!leftOpen && !rightOpen) ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
            </div>

            {/* Theme Toggle (Always Visible) */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar (Library) */}
        <div className={`
          ${leftOpen ? 'w-80 border-r' : 'w-0 border-none'} 
          ${mobileView === 'library' ? 'absolute inset-0 z-40 w-full flex' : 'hidden md:flex'}
          bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0
        `}>
           <div className="w-80 h-full"> {/* Container to hold width during transition */}
              <LibrarySidebar sources={sources} onToggleSource={toggleSource} />
           </div>
        </div>

        {/* Center (Editor) */}
        <div className={`
           flex-1 flex flex-col relative bg-gray-50 dark:bg-dark-bg transition-colors duration-200
           ${mobileView !== 'editor' ? 'hidden md:flex' : 'flex'}
        `}>
           <Editor />
        </div>

        {/* Right Sidebar (Assistant) */}
        <div className={`
          ${rightOpen ? 'w-[350px] border-l' : 'w-0 border-none'}
          ${mobileView === 'assistant' ? 'absolute inset-0 z-40 w-full flex' : 'hidden md:flex'}
          bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0
        `}>
            <div className="w-[350px] h-full">
              <AssistantSidebar 
                chatHistory={chatHistory} 
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
              />
            </div>
        </div>

      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden h-16 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border flex items-center justify-around px-2 z-50">
         <button 
           onClick={() => setMobileView('library')}
           className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileView === 'library' ? 'text-brand-600 dark:text-brand-500' : 'text-gray-400 dark:text-gray-500'}`}
         >
           <Book size={20} />
           <span className="text-[10px] font-medium">Library</span>
         </button>
         
         <button 
           onClick={() => setMobileView('editor')}
           className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileView === 'editor' ? 'text-brand-600 dark:text-brand-500' : 'text-gray-400 dark:text-gray-500'}`}
         >
           <Edit3 size={20} />
           <span className="text-[10px] font-medium">Editor</span>
         </button>

         <button 
           onClick={() => setMobileView('assistant')}
           className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileView === 'assistant' ? 'text-brand-600 dark:text-brand-500' : 'text-gray-400 dark:text-gray-500'}`}
         >
           <MessageSquare size={20} />
           <span className="text-[10px] font-medium">AI Chat</span>
         </button>
      </div>

    </div>
  );
};

export default App;