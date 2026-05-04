export interface ModelConfig {
  name: string;
  provider: string;
  version?: string;
}

export interface TaskConfig {
  id: string;
  name: string;
  description: string;
  models: ModelConfig[];
  optimalModel: string;
  selectionPolicy: "optimal" | "round-robin" | "random" | "cost-based" | "performance-based";
  timeoutMs?: number;
  maxRetries?: number;
}

export interface AgentRouterConfig {
  routerId: string;
  name: string;
  version: string;
  tasks: TaskConfig[];
  defaultTask: string;
  fallbackModel: string;
}

export interface AgentRequest {
  taskType: string;
  prompt: string;
  context?: Record<string, unknown>;
  preferredModel?: string;
  priority?: "low" | "medium" | "high" | "critical";
}

export interface AgentResponse {
  taskType: string;
  modelUsed: string;
  content: string;
  latencyMs: number;
  tokensUsed?: number;
  status: "success" | "error" | "fallback";
  error?: string;
}

export interface RouterLog {
  id: string;
  timestamp: Date;
  request: AgentRequest;
  response: AgentResponse;
  routingDecision: string;
}
