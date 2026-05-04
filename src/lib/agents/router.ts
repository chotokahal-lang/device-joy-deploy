import type { AgentRequest, AgentResponse, RouterLog, AgentRouterConfig } from "./types";
import { getModelForTask } from "./config";

export class AgentRouter {
  private config: AgentRouterConfig;
  private logs: RouterLog[] = [];
  private requestCount = 0;

  constructor(config: AgentRouterConfig) {
    this.config = config;
  }

  async route(request: AgentRequest): Promise<AgentResponse> {
    const startTime = performance.now();
    const taskId = request.taskType || this.config.defaultTask;
    const model = request.preferredModel || getModelForTask(this.config, taskId);

    let status: AgentResponse["status"] = "success";
    let content = "";
    let error: string | undefined;

    try {
      content = await this.executeModel(model, request);
    } catch (err) {
      status = "error";
      error = err instanceof Error ? err.message : String(err);

      try {
        const fallback = this.config.fallbackModel;
        content = await this.executeModel(fallback, request);
        status = "fallback";
      } catch (fallbackErr) {
        error += `; Fallback also failed: ${fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)}`;
      }
    }

    const latencyMs = Math.round(performance.now() - startTime);

    const response: AgentResponse = {
      taskType: taskId,
      modelUsed: model,
      content,
      latencyMs,
      status,
      error,
    };

    const log: RouterLog = {
      id: `req-${++this.requestCount}`,
      timestamp: new Date(),
      request,
      response,
      routingDecision: `${taskId} -> ${model} (${status})`,
    };
    this.logs.push(log);

    return response;
  }

  private async executeModel(model: string, request: AgentRequest): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

    const prompts: Record<string, string> = {
      "deepseek-3.2": `[Deepseek 3.2 analyzing ${request.taskType}]\n${request.prompt}`,
      "claude-opus-4-7": `[Claude Opus 4.7 processing ${request.taskType}]\n${request.prompt}`,
      "claude-opus-4-6": `[Claude Opus 4.6 verifying ${request.taskType}]\n${request.prompt}`,
      "claude-sonnet-4-6": `[Claude Sonnet 4.6 handling ${request.taskType}]\n${request.prompt}`,
      "gpt-oss-120b": `[GPT-OSS 120B generating ${request.taskType}]\n${request.prompt}`,
      "gpt-5.4": `[GPT-5.4 working on ${request.taskType}]\n${request.prompt}`,
      "gpt-5.2": `[GPT-5.2 optimizing ${request.taskType}]\n${request.prompt}`,
      "gpt-4o-mini": `[GPT-4o-mini fallback for ${request.taskType}]\n${request.prompt}`,
    };

    return prompts[model] || `[${model}] ${request.prompt}`;
  }

  getLogs(): RouterLog[] {
    return [...this.logs];
  }

  getStats() {
    const total = this.logs.length;
    const success = this.logs.filter((l) => l.response.status === "success").length;
    const fallback = this.logs.filter((l) => l.response.status === "fallback").length;
    const errors = this.logs.filter((l) => l.response.status === "error").length;
    const avgLatency = total > 0
      ? this.logs.reduce((sum, l) => sum + l.response.latencyMs, 0) / total
      : 0;

    return { total, success, fallback, errors, avgLatency: Math.round(avgLatency) };
  }

  clearLogs() {
    this.logs = [];
    this.requestCount = 0;
  }
}
