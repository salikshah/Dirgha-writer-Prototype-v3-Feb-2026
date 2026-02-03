import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, Upload, MoreHorizontal, CheckSquare, Square } from 'lucide-react';
import { Source } from '../types';

interface LibrarySidebarProps {
  sources: Source[];
  onToggleSource: (id: string) => void;
}

const LibrarySidebar: React.FC<LibrarySidebarProps> = ({ sources, onToggleSource }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSources = sources.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 flex-shrink-0 w-full">
      <div className="p-4 border-b border-gray-100 dark:border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-800 dark:bg-gray-700 text-white rounded flex items-center justify-center text-xs">
              <span className="relative top-[1px]">=</span>
            </div>
            Library
          </h2>
          <button className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            <Upload size={16} />
          </button>
        </div>
        
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder={`Search ${sources.length} sources...`}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:text-gray-200 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-md">Sources</button>
          <button className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">Collections</button>
          <button className="px-2 py-1.5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-dark-border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
            <Filter size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredSources.map((source) => (
          <div key={source.id} className="group p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
            <div className="flex items-start gap-3">
              <button 
                onClick={() => onToggleSource(source.id)}
                className="mt-1 text-gray-300 dark:text-gray-600 hover:text-blue-500 transition-colors"
              >
                {source.selected ? <CheckSquare size={16} className="text-blue-600 dark:text-blue-500" /> : <Square size={16} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                    source.type === 'Article' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                    source.type === 'Review' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {source.type}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-1 line-clamp-2">
                  {source.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                  {source.authors.join(', ')}
                </p>
                <div className="flex items-center text-xs text-brand-600 dark:text-brand-400 font-medium mb-3">
                  {source.journal} · {source.year}
                </div>
                
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    <Plus size={12} /> Cite
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                    <FileText size={12} /> Details
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 ml-auto">
                    <Upload size={12} /> Upload PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibrarySidebar;