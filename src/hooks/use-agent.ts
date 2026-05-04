import { useState, useCallback } from "react";
import { AgentRouter } from "@/lib/agents/router";
import { defaultRouterConfig } from "@/lib/agents/config";
import type { AgentRequest, AgentResponse } from "@/lib/agents/types";

const globalRouter = new AgentRouter(defaultRouterConfig);

export interface UseAgentResult {
  response: AgentResponse | null;
  loading: boolean;
  error: string | null;
  send: (request: AgentRequest) => Promise<void>;
  clear: () => void;
}

export function useAgent(): UseAgentResult {
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (request: AgentRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await globalRouter.route(request);
      setResponse(res);
      if (res.status === "error") {
        setError(res.error || "Unknown error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return { response, loading, error, send, clear };
}

export function getAgentLogs() {
  return globalRouter.getLogs();
}

export function getAgentStats() {
  return globalRouter.getStats();
}

export function clearAgentLogs() {
  globalRouter.clearLogs();
}
