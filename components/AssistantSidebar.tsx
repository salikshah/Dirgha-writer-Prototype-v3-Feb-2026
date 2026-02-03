import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Send, Paperclip, Globe, Plus, FileText, X, Sparkles, 
  MicOff, Volume2, ChevronRight, BookOpen, Folder, Library as LibraryIcon, 
  Copy, ThumbsUp, ThumbsDown 
} from 'lucide-react';
import { ChatMessage } from '../types';
import { GeminiLiveService } from '../services/geminiLiveService';

interface AssistantSidebarProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isGenerating: boolean;
}

const AssistantSidebar: React.FC<AssistantSidebarProps> = ({ chatHistory, onSendMessage, isGenerating }) => {
  const [input, setInput] = useState('');
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  // Live Voice State
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveService] = useState(() => new GeminiLiveService());
  const [liveStatus, setLiveStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const text = input;
    setInput('');
    await onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleLiveMode = async () => {
    if (isLiveActive) {
      await liveService.disconnect();
      setIsLiveActive(false);
      setLiveStatus('disconnected');
    } else {
      setLiveStatus('connecting');
      try {
        await liveService.connect(
          (text) => console.log("Live Transcript:", text), // Optional transcript handling
          (active) => {
            if (active) {
                setLiveStatus('connected');
                setIsLiveActive(true);
            } else {
                setLiveStatus('disconnected');
                setIsLiveActive(false);
            }
          }
        );
      } catch (e) {
        console.error(e);
        setLiveStatus('disconnected');
        setIsLiveActive(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-surface border-l border-gray-200 dark:border-dark-border w-full flex-shrink-0 relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between bg-white dark:bg-dark-surface z-10">
        <div className="flex items-center gap-2">
          <div className="text-gray-400 dark:text-gray-500">
             <span className="font-serif italic text-lg">»</span>
          </div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">AI Chat</h2>
        </div>
        <div className="flex items-center gap-2">
           {/* Live Voice Toggle */}
          <button 
            onClick={toggleLiveMode}
            className={`p-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                isLiveActive 
                ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-2 ring-red-100 dark:ring-red-900' 
                : liveStatus === 'connecting' 
                    ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Toggle Live Voice Mode"
          >
            {liveStatus === 'connecting' ? (
                 <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full" />
            ) : isLiveActive ? (
                <>
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <MicOff size={16} />
                </>
            ) : (
                <Mic size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {chatHistory.length === 0 ? (
          <div className="mt-8 space-y-8 animate-in fade-in duration-700">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Research questions</h3>
              <div className="space-y-2">
                <SuggestionButton text="Find research ideas for the" highlight="topic" onClick={onSendMessage} />
                <SuggestionButton text="Explain in simple words this" highlight="concept" onClick={onSendMessage} />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Writing help</h3>
              <div className="space-y-2">
                 <SuggestionButton text="Help me outline a paper on" highlight="topic" onClick={onSendMessage} />
                 <SuggestionButton text="Review my draft for clarity" onClick={onSendMessage} />
                 <SuggestionButton text="Draft an abstract and keywords" onClick={onSendMessage} />
              </div>
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} group`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-800 dark:bg-gray-600 text-white' : 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'}`}>
                {msg.role === 'user' ? <span className="text-xs">You</span> : <Sparkles size={14} />}
              </div>
              <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`text-sm leading-relaxed p-3 rounded-2xl ${msg.role === 'user' ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tr-none' : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-200 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                  
                  {/* AI Message Actions (Copy/Rate) */}
                  {msg.role === 'model' && (
                      <div className="flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-gray-700" title="Copy">
                              <Copy size={12} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-gray-700" title="Good response">
                              <ThumbsUp size={12} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded hover:bg-gray-50 dark:hover:bg-gray-700" title="Bad response">
                              <ThumbsDown size={12} />
                          </button>
                      </div>
                  )}
              </div>
            </div>
          ))
        )}
        {isGenerating && (
             <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="animate-pulse" />
              </div>
              <div className="flex-1 p-3 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm rounded-2xl rounded-tl-none">
                <div className="flex space-x-1 h-5 items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-0"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface">
        {isLiveActive && (
             <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded border border-red-100 dark:border-red-900/50 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <Volume2 size={12} className="animate-pulse" />
                    Live Voice Session Active
                </span>
                <button onClick={toggleLiveMode} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                    <X size={12} />
                </button>
             </div>
        )}
        <div className="flex items-center gap-2 mb-2 px-1 relative">
             {/* Context Menu Trigger */}
             <div className="relative" ref={contextMenuRef}>
                 <button 
                    onClick={() => setContextMenuOpen(!contextMenuOpen)}
                    className={`p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors ${contextMenuOpen ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200' : ''}`}
                 >
                    <Plus size={16} />
                 </button>

                 {/* Context Popover Menu */}
                 {contextMenuOpen && (
                     <div className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                            Context Sources
                        </div>
                        
                        <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                             <div className="flex items-center gap-2">
                                <BookOpen size={14} className="text-gray-400 group-hover:text-blue-500" />
                                <span>Sources</span>
                             </div>
                             <ChevronRight size={14} className="text-gray-300" />
                        </button>

                        <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                             <div className="flex items-center gap-2">
                                <Folder size={14} className="text-gray-400 group-hover:text-blue-500" />
                                <span>Collections</span>
                             </div>
                             <ChevronRight size={14} className="text-gray-300" />
                        </button>
                        
                        <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>

                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                            <Globe size={14} className="text-gray-400 group-hover:text-blue-500" />
                            <span>Web</span>
                        </button>

                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                            <LibraryIcon size={14} className="text-gray-400 group-hover:text-blue-500" />
                            <span>Library</span>
                        </button>

                        <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>

                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                            <Copy size={14} className="text-gray-400 group-hover:text-blue-500" />
                            <span>Copy</span>
                        </button>
                     </div>
                 )}
             </div>

             <button className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <FileText size={12} /> Current document
                <X size={10} className="ml-1 opacity-50 hover:opacity-100" />
             </button>
        </div>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask assistant, use @ to mention specific PDFs..."
            className="w-full min-h-[80px] p-3 pr-12 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 focus:border-brand-400 dark:text-gray-200 resize-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 font-sans"
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-3 text-gray-400 dark:text-gray-500">
             <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">@</button>
             <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Paperclip size={16} /></button>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
             <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Globe size={16} />
             </button>
             <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
             <button 
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    input.trim() && !isGenerating
                    ? 'bg-brand-600 text-white shadow-md hover:bg-brand-700' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
             >
                Send <Send size={12} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuggestionButton: React.FC<{ text: string, highlight?: string, onClick: (t: string) => void }> = ({ text, highlight, onClick }) => (
    <button 
      onClick={() => onClick(text + (highlight ? ` ${highlight}` : ''))}
      className="w-full text-left p-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
    >
        {text} {highlight && <span className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-400 dark:text-gray-400 text-xs font-mono group-hover:bg-white dark:group-hover:bg-gray-700">{highlight}</span>}
    </button>
);

export default AssistantSidebar;