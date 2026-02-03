import React from 'react';
import { PenTool, Image, Table, Quote, Sigma, Undo, Redo, Sparkles } from 'lucide-react';

const FloatingToolbar: React.FC = () => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-dark-surface shadow-lg border border-gray-200 dark:border-dark-border rounded-full px-4 py-2 z-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors mr-2">
        <Sparkles size={14} />
        Cite
      </button>
      
      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>

      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
        <PenTool size={16} />
      </button>
      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>

      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
        <Image size={16} />
      </button>
      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
        <Table size={16} />
      </button>
      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
        <Quote size={16} />
      </button>
      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
        <Sigma size={16} />
      </button>
      
      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>

      <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
        <Undo size={16} />
      </button>
      <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
        <Redo size={16} />
      </button>
      
      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium ml-3">1951 words</span>
      <span className="text-[10px] text-amber-600 dark:text-amber-500 font-medium ml-3 flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
         ! 23 citations
      </span>
    </div>
  );
};

export default FloatingToolbar;