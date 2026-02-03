export interface Source {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  type: 'Article' | 'Review' | 'Personal Communication';
  citations?: number;
  impactFactor?: number;
  openAccess?: boolean;
  abstract?: string;
  selected?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp?: number;
}

export interface AgentTask {
  id: string;
  agentName: string; // e.g., 'DeepSeek-R1', 'Perplexity', 'ZoteroSync'
  status: 'running' | 'completed' | 'failed' | 'idle';
  message: string;
  timestamp: string;
}

export interface DocumentState {
  title: string;
  content: string;
}

export type ExecutionMode = 'find' | 'write' | 'review' | 'defend';
