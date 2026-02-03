import React from 'react';
import { Search, PenTool, CheckCircle, Shield, Database, Settings, Command } from 'lucide-react';
import { ExecutionMode } from '../types';

interface ExecutionSidebarProps {
  currentMode: ExecutionMode;
  onModeChange: (mode: ExecutionMode) => void;
  onOpenDrive: () => void;
}

const ExecutionSidebar: React.FC<ExecutionSidebarProps> = ({ currentMode, onModeChange, onOpenDrive }) => {
  const modes: { id: ExecutionMode; icon: React.FC<any>; label: string }[] = [
    { id: 'find', icon: Search, label: 'Discovery' },
    { id: 'write', icon: PenTool, label: 'Studio' },
    { id: 'review', icon: CheckCircle, label: 'Peer Review' },
    { id: 'defend', icon: Shield, label: 'Defense' },
  ];

  return (
    <div className="flex flex-col h-full bg-carbon-bg border-r border-carbon-border w-14 items-center py-4 z-30">
      <div className="mb-6 text-carbon-blue font-bold text-xl tracking-tighter">
        D<span className="text-white">.</span>
      </div>

      <div className="flex-1 flex flex-col gap-4 w-full px-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`group relative flex items-center justify-center p-2 rounded-sm transition-all duration-200 ${
              currentMode === mode.id
                ? 'bg-carbon-layer text-carbon-blue border-l-2 border-carbon-blue'
                : 'text-carbon-textSecondary hover:text-white hover:bg-carbon-layerHover'
            }`}
          >
            <mode.icon size={20} strokeWidth={1.5} />
            
            {/* Tooltip */}
            <div className="absolute left-12 bg-carbon-layer border border-carbon-border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-mono">
              {mode.label}
            </div>
          </button>
        ))}

        <div className="w-full h-px bg-carbon-border my-2"></div>

        <button 
          onClick={onOpenDrive}
          className="group relative flex items-center justify-center p-2 text-carbon-textSecondary hover:text-white hover:bg-carbon-layerHover rounded-sm transition-colors"
        >
          <Database size={20} strokeWidth={1.5} />
           <div className="absolute left-12 bg-carbon-layer border border-carbon-border text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-mono">
              Knowledge Graph
            </div>
        </button>
      </div>

      <div className="mt-auto flex flex-col gap-4 w-full px-2">
         <button className="flex items-center justify-center p-2 text-carbon-textSecondary hover:text-white transition-colors">
          <Settings size={20} strokeWidth={1.5} />
        </button>
        <div className="h-8 w-8 bg-carbon-layer rounded-full flex items-center justify-center text-xs font-mono border border-carbon-border text-carbon-textSecondary">
            JS
        </div>
      </div>
    </div>
  );
};

export default ExecutionSidebar;
