import type { AgentRouterConfig } from "./types";

export const defaultRouterConfig: AgentRouterConfig = {
  routerId: "doo_v1_cf6bbf525b39d8f018a5842d4b9151cce70ae562fab8443a5c626f17e7bd751f",
  name: "DOO Agent Router",
  version: "1.0.0",
  defaultTask: "code-generation",
  fallbackModel: "gpt-4o-mini",
  tasks: [
    {
      id: "bug-fixing",
      name: "Bug Fixing",
      description: "Identify, diagnose, and resolve bugs in existing code. Includes interpreting error messages, tracing logic errors, and generating patches for reported issues.",
      models: [
        { name: "deepseek-3.2", provider: "deepseek", version: "3.2" },
        { name: "claude-opus-4", provider: "anthropic", version: "4" },
        { name: "gpt-5.4", provider: "openai", version: "5.4" },
      ],
      optimalModel: "deepseek-3.2",
      selectionPolicy: "optimal",
      timeoutMs: 30000,
      maxRetries: 2,
    },
    {
      id: "code-generation",
      name: "Code Generation",
      description: "Generate standalone functions, code snippets, and complex multi-file implementations, including feature development, refactoring, and optimization.",
      models: [
        { name: "claude-opus-4-7", provider: "anthropic", version: "4.7" },
        { name: "gpt-oss-120b", provider: "openai", version: "120b" },
      ],
      optimalModel: "claude-opus-4-7",
      selectionPolicy: "optimal",
      timeoutMs: 60000,
      maxRetries: 1,
    },
    {
      id: "test-writing-code-verification",
      name: "Test Writing & Code Verification",
      description: "Write unit tests, generate test cases, or verify code correctness via test output prediction.",
      models: [
        { name: "claude-opus-4-6", provider: "anthropic", version: "4.6" },
        { name: "claude-sonnet-4-6", provider: "anthropic", version: "4.6" },
        { name: "gpt-5.4", provider: "openai", version: "5.4" },
      ],
      optimalModel: "claude-opus-4-6",
      selectionPolicy: "optimal",
      timeoutMs: 45000,
      maxRetries: 2,
    },
    {
      id: "code-performance-optimization",
      name: "Code Performance Optimization",
      description: "Optimize code for efficiency, refactor for performance, or reduce resource usage.",
      models: [
        { name: "deepseek-3.2", provider: "deepseek", version: "3.2" },
        { name: "claude-sonnet-4-6", provider: "anthropic", version: "4.6" },
        { name: "gpt-5.2", provider: "openai", version: "5.2" },
      ],
      optimalModel: "deepseek-3.2",
      selectionPolicy: "optimal",
      timeoutMs: 30000,
      maxRetries: 1,
    },
  ],
};

export function getTaskConfig(config: AgentRouterConfig, taskId: string) {
  return config.tasks.find((t) => t.id === taskId) ?? null;
}

export function getModelForTask(config: AgentRouterConfig, taskId: string, policy?: string): string {
  const task = getTaskConfig(config, taskId);
  if (!task) return config.fallbackModel;

  const effectivePolicy = policy || task.selectionPolicy;

  switch (effectivePolicy) {
    case "optimal":
      return task.optimalModel;
    case "round-robin": {
      const idx = Math.floor(Date.now() / 1000) % task.models.length;
      return task.models[idx].name;
    }
    case "random": {
      const idx = Math.floor(Math.random() * task.models.length);
      return task.models[idx].name;
    }
    case "cost-based":
      return task.models[task.models.length - 1]?.name ?? task.optimalModel;
    default:
      return task.optimalModel;
  }
}
