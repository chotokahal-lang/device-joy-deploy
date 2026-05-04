import { useState, useCallback } from "react";
import { AgentRouter } from "@/lib/agents/router";
import { defaultRouterConfig } from "@/lib/agents/config";
import { AgentCard } from "@/components/agents/AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, Trash2, Activity, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { LiveText } from "@/components/ui/live-text";

const router = new AgentRouter(defaultRouterConfig);

export default function AgentManager() {
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<Array<{ id: string; task: string; model: string; content: string; status: string; latency: number }>>([]);
  const [logs, setLogs] = useState(router.getLogs());
  const [loading, setLoading] = useState(false);

  const handleActivate = useCallback((taskId: string) => {
    setActiveTask((prev) => (prev === taskId ? null : taskId));
  }, []);

  const handleSend = async () => {
    if (!prompt.trim() || !activeTask) return;

    setLoading(true);
    const response = await router.route({
      taskType: activeTask,
      prompt,
      priority: "medium",
    });

    setResults((prev) => [
      {
        id: `res-${Date.now()}`,
        task: response.taskType,
        model: response.modelUsed,
        content: response.content,
        status: response.status,
        latency: response.latencyMs,
      },
      ...prev,
    ]);

    setLogs(router.getLogs());
    setLoading(false);
    setPrompt("");
  };

  const handleClear = () => {
    setResults([]);
    router.clearLogs();
    setLogs([]);
  };

  const stats = router.getStats();

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 space-y-8">
      <div className="flex items-center gap-3">
        <Bot className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">
            <LiveText as="span" id="agent-mgr-title" defaultText="Agent Router Manager" />
          </h1>
          <p className="text-sm text-muted-foreground">
            <LiveText
              as="span"
              id="agent-mgr-subtitle"
              defaultText={`${defaultRouterConfig.name} v${defaultRouterConfig.version}`}
            />
          </p>
        </div>
        <Badge variant="outline" className="ml-auto font-mono text-xs">
          {defaultRouterConfig.routerId.slice(0, 16)}...
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <Activity className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium">
              <LiveText as="span" id="agent-mgr-stat-total-label" defaultText="Total Requests" />
            </p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-medium">
              <LiveText as="span" id="agent-mgr-stat-success-label" defaultText="Success" />
            </p>
            <p className="text-2xl font-bold">{stats.success}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="text-sm font-medium">
              <LiveText as="span" id="agent-mgr-stat-fallback-label" defaultText="Fallbacks" />
            </p>
            <p className="text-2xl font-bold">{stats.fallback}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <Clock className="h-5 w-5 text-purple-500" />
          <div>
            <p className="text-sm font-medium">
              <LiveText as="span" id="agent-mgr-stat-latency-label" defaultText="Avg Latency" />
            </p>
            <p className="text-2xl font-bold">{stats.avgLatency}ms</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="agents">
            <LiveText as="span" id="agent-mgr-tab-agents" defaultText="Agents" />
          </TabsTrigger>
          <TabsTrigger value="console">
            <LiveText as="span" id="agent-mgr-tab-console" defaultText="Console" />
          </TabsTrigger>
          <TabsTrigger value="logs">
            <LiveText as="span" id="agent-mgr-tab-logs" defaultText={`Logs (${logs.length})`} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultRouterConfig.tasks.map((task) => (
              <AgentCard
                key={task.id}
                task={task}
                isActive={activeTask === task.id}
                onActivate={handleActivate}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="console" className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">
                <LiveText as="span" id="agent-mgr-console-prompt-label" defaultText="Prompt" />
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={activeTask ? `Send to ${activeTask}...` : "Select an agent first"}
                disabled={!activeTask}
                rows={3}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!activeTask || !prompt.trim() || loading}
              className="h-[86px] px-6"
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? (
                <LiveText as="span" id="agent-mgr-send-loading" defaultText="..." />
              ) : (
                <LiveText as="span" id="agent-mgr-send" defaultText="Send" />
              )}
            </Button>
          </div>

          {activeTask && (
            <Badge className="mb-2">
              <LiveText
                as="span"
                id="agent-mgr-active-badge"
                defaultText={`Active: ${defaultRouterConfig.tasks.find((t) => t.id === activeTask)?.name ?? ""}`}
              />
            </Badge>
          )}

          <ScrollArea className="h-[400px] rounded-lg border">
            <div className="p-4 space-y-4">
              {results.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  <LiveText as="span" id="agent-mgr-console-empty" defaultText="No results yet. Send a prompt to see output." />
                </p>
              )}
              {results.map((res) => (
                <div key={res.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={res.status === "success" ? "default" : res.status === "fallback" ? "secondary" : "destructive"}>
                      <LiveText as="span" id={`agent-mgr-res-${res.id}-status`} defaultText={res.status} />
                    </Badge>
                    <span className="text-sm font-medium">
                      <LiveText as="span" id={`agent-mgr-res-${res.id}-model`} defaultText={res.model} />
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      <LiveText as="span" id={`agent-mgr-res-${res.id}-latency`} defaultText={`${res.latency}ms`} />
                    </span>
                  </div>
                  <pre className="text-sm bg-muted rounded-md p-2 overflow-x-auto">{res.content}</pre>
                </div>
              ))}
            </div>
          </ScrollArea>

          {results.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-2" />
              <LiveText as="span" id="agent-mgr-clear-results" defaultText="Clear Results" />
            </Button>
          )}
        </TabsContent>

        <TabsContent value="logs">
          <ScrollArea className="h-[500px] rounded-lg border">
            <div className="p-4 space-y-2">
              {logs.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  <LiveText as="span" id="agent-mgr-logs-empty" defaultText="No logs yet." />
                </p>
              )}
              {logs.map((log) => (
                <div key={log.id} className="text-sm font-mono border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{log.timestamp.toLocaleTimeString()}</span>
                    <Badge variant="outline">{log.id}</Badge>
                    <span>
                      <LiveText as="span" id={`agent-mgr-log-${log.id}-route`} defaultText={log.routingDecision} />
                    </span>
                  </div>
                  <p className="text-muted-foreground truncate">
                    <LiveText
                      as="span"
                      id={`agent-mgr-log-${log.id}-prompt`}
                      defaultText={`${log.request.prompt.slice(0, 80)}...`}
                    />
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
