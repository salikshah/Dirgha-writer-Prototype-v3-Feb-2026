import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Globe, Terminal, Activity, MicOff, Volume2, Cpu, Database, ChevronRight } from 'lucide-react';
import { ChatMessage, AgentTask } from '../types';
import { GeminiLiveService } from '../services/geminiLiveService';

interface AgentSidecarProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isGenerating: boolean;
}

const AgentSidecar: React.FC<AgentSidecarProps> = ({ chatHistory, onSendMessage, isGenerating }) => {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simulated Agent Tasks
  const [tasks, setTasks] = useState<AgentTask[]>([
      { id: '1', agentName: 'System', status: 'idle', message: 'Dirgha OS v2.4 initialized', timestamp: '10:00:01' },
      { id: '2', agentName: 'Zotero', status: 'completed', message: 'Synced 1,240 references', timestamp: '10:00:05' }
  ]);
  
  // Live Voice State
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveService] = useState(() => new GeminiLiveService());
  const [liveStatus, setLiveStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, tasks]);

  // Simulate incoming tasks randomly
  useEffect(() => {
    const interval = setInterval(() => {
        if(Math.random() > 0.7) {
            const newTasks = [
                { id: Date.now().toString(), agentName: 'DeepSeek-R1', status: 'running', message: 'Verifying logical consistency in Abstract...', timestamp: new Date().toLocaleTimeString() },
                { id: Date.now().toString(), agentName: 'Perplexity', status: 'completed', message: 'Found 3 new sources on "AI Ethics"', timestamp: new Date().toLocaleTimeString() }
            ];
            const task = newTasks[Math.floor(Math.random() * newTasks.length)];
             // @ts-ignore
            setTasks(prev => [...prev.slice(-4), task]); 
        }
    }, 8000);
    return () => clearInterval(interval);
  }, []);


  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const text = input;
    setInput('');
    await onSendMessage(text);
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
          (text) => console.log(text),
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
        setLiveStatus('disconnected');
        setIsLiveActive(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-carbon-layer border-l border-carbon-border w-[360px] flex-shrink-0 z-20 shadow-xl">
      
      {/* Tab Switcher */}
      <div className="flex items-center border-b border-carbon-border bg-carbon-bg">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-carbon-blue text-white' : 'border-transparent text-carbon-textSecondary hover:text-white'}`}
          >
            <Terminal size={12} /> Agent Console
          </button>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'knowledge' ? 'border-carbon-blue text-white' : 'border-transparent text-carbon-textSecondary hover:text-white'}`}
          >
            <Database size={12} /> Knowledge
          </button>
      </div>

      {activeTab === 'chat' ? (
      <>
        {/* Agent Task Log (Terminal Style) */}
        <div className="bg-[#000000] p-3 font-mono text-[10px] h-[120px] overflow-y-auto border-b border-carbon-border">
            {tasks.map((task) => (
                <div key={task.id} className="mb-1.5 flex gap-2 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="text-gray-500">[{task.timestamp}]</span>
                    <span className={`${
                        task.agentName === 'System' ? 'text-green-500' : 
                        task.agentName === 'DeepSeek-R1' ? 'text-purple-400' : 'text-blue-400'
                    }`}>{task.agentName}</span>
                    <span className="text-gray-300">>> {task.message}</span>
                    {task.status === 'running' && <span className="animate-pulse text-yellow-500">_</span>}
                </div>
            ))}
            <div ref={messagesEndRef}></div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-carbon-bg">
            {chatHistory.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-carbon-textSecondary opacity-50 space-y-4">
                    <Cpu size={48} strokeWidth={1} />
                    <p className="font-mono text-xs text-center">Ready for input.<br/>Awaiting commands.</p>
                 </div>
            )}
            {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0 text-[10px] font-mono border ${msg.role === 'user' ? 'bg-carbon-layer border-carbon-border text-white' : 'bg-carbon-blue border-carbon-blue text-white'}`}>
                {msg.role === 'user' ? 'USR' : 'AI'}
                </div>
                <div className={`flex-1 text-sm leading-relaxed p-3 ${msg.role === 'user' ? 'text-gray-300 bg-carbon-layer border border-carbon-border' : 'text-gray-200 bg-transparent'}`}>
                {msg.text}
                </div>
            </div>
            ))}
             {isGenerating && (
                 <div className="flex gap-2 items-center text-xs font-mono text-carbon-blue animate-pulse pl-10">
                    <Activity size={12} /> GENERATING_RESPONSE...
                 </div>
             )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-carbon-border bg-carbon-layer">
             <div className="flex items-center gap-2 mb-2 justify-between">
                <button 
                    onClick={toggleLiveMode}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wide border transition-all ${isLiveActive ? 'bg-red-900/30 border-red-800 text-red-400 animate-pulse' : 'bg-carbon-bg border-carbon-border text-carbon-textSecondary hover:text-white'}`}
                >
                    {isLiveActive ? <><MicOff size={10} /> Live Active</> : <><Mic size={10} /> Voice Mode</>}
                </button>
             </div>
            <div className="relative">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Message Agent..."
                className="w-full min-h-[60px] p-3 pr-10 text-sm bg-carbon-bg border border-carbon-border focus:border-carbon-blue focus:outline-none text-white resize-none font-sans placeholder:font-mono placeholder:text-gray-600"
            />
            <button 
                onClick={handleSend}
                className="absolute bottom-3 right-3 text-carbon-textSecondary hover:text-carbon-blue transition-colors"
            >
                <Send size={14} />
            </button>
            </div>
        </div>
      </>
      ) : (
          <div className="flex-1 bg-carbon-bg p-4 overflow-y-auto">
              <h3 className="text-xs font-mono text-carbon-textSecondary uppercase mb-4">Referenced Entities</h3>
              {[1,2,3].map(i => (
                  <div key={i} className="mb-3 p-3 bg-carbon-layer border border-carbon-border hover:border-carbon-textSecondary transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">Ketogenic Diet</span>
                          <ChevronRight size={12} className="text-gray-600 group-hover:text-white" />
                      </div>
                      <p className="text-[10px] text-gray-400 leading-normal">
                          Defined as a high-fat, adequate-protein, low-carbohydrate diet that in medicine is used primarily to treat difficult-to-control (refractory) epilepsy in children.
                      </p>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default AgentSidecar;
