import React, { useState, useEffect, useRef } from 'react';
import { Search, PenTool, Quote, Hash, FileText, Sparkles, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (cmd: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onCommand }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const suggestions = [
    { icon: Sparkles, text: 'Analyze Methodology (DeepSeek-R1)', type: 'agent' },
    { icon: Quote, text: 'Insert Citation (Zotero)', type: 'action' },
    { icon: Hash, text: 'Insert Math Block (LaTeX)', type: 'action' },
    { icon: FileText, text: 'Draft Abstract', type: 'generate' },
  ].filter(s => s.text.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] z-50">
      <div className="bg-carbon-layer border border-carbon-border shadow-2xl overflow-hidden rounded-sm backdrop-blur-sm bg-opacity-95">
        <div className="flex items-center px-4 py-3 border-b border-carbon-border">
          <Search size={18} className="text-carbon-textSecondary" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-carbon-text px-3 font-mono text-sm placeholder-carbon-textSecondary"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
            }}
          />
          <button onClick={onClose}>
            <X size={16} className="text-carbon-textSecondary hover:text-white" />
          </button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1 text-[10px] font-mono text-carbon-textSecondary uppercase tracking-wider">Suggested</div>
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                      onCommand(item.text);
                      onClose();
                  }}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-carbon-layerHover transition-colors group border-l-2 border-transparent hover:border-carbon-blue"
                >
                  <item.icon size={16} className={`text-carbon-textSecondary group-hover:text-carbon-blue`} />
                  <span className="text-sm text-carbon-text font-sans">{item.text}</span>
                  {item.type === 'agent' && (
                    <span className="ml-auto text-[10px] bg-carbon-bg px-1.5 py-0.5 border border-carbon-border rounded text-carbon-textSecondary font-mono">
                        AGENT
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-carbon-textSecondary text-sm font-sans">
                No commands found for "{query}"
            </div>
          )}
        </div>
        
        <div className="px-4 py-2 bg-carbon-bg border-t border-carbon-border flex items-center justify-between text-[10px] text-carbon-textSecondary font-mono">
            <div className="flex gap-2">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
            </div>
            <div>Dirgha OS v1.0</div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
