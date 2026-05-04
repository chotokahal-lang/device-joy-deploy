import { useState } from "react";
import { useAgent } from "@/hooks/use-agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgentAutoFix } from "./AgentAutoFix";
import {
  Bot,
  Bug,
  Code,
  TestTube,
  Gauge,
  Send,
  X,
  Copy,
  CheckCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { LiveText } from "@/components/ui/live-text";

const taskOptions = [
  { id: "bug-fixing", name: "Bug Fixing", icon: <Bug className="h-4 w-4" /> },
  { id: "code-generation", name: "Code Generation", icon: <Code className="h-4 w-4" /> },
  { id: "test-writing-code-verification", name: "Test & Verify", icon: <TestTube className="h-4 w-4" /> },
  { id: "code-performance-optimization", name: "Optimize", icon: <Gauge className="h-4 w-4" /> },
];

export function AgentDebugger({ codeSnippet = "" }: { codeSnippet?: string }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "autofix">("chat");
  const [taskType, setTaskType] = useState("bug-fixing");
  const [prompt, setPrompt] = useState(codeSnippet);
  const [copied, setCopied] = useState(false);
  const { response, loading, error, send, clear } = useAgent();

  const handleSend = async () => {
    if (!prompt.trim()) return;
    await send({
      taskType,
      prompt,
      priority: "high",
    });
  };

  const handleCopy = () => {
    if (response?.content) {
      navigator.clipboard.writeText(response.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          variant="default"
          title="Agent Debugger"
          aria-label="Agent Debugger"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <LiveText as="span" id="agent-debug-header-title" defaultText="Agent Debugger" />
            </div>
            <div className="flex items-center gap-1 rounded-md border bg-muted p-0.5">
              <Button
                size="sm"
                variant={mode === "chat" ? "default" : "ghost"}
                className="h-7 text-xs"
                onClick={() => setMode("chat")}
              >
                <LiveText as="span" id="agent-debug-mode-chat" defaultText="Chat" />
              </Button>
              <Button
                size="sm"
                variant={mode === "autofix" ? "default" : "ghost"}
                className="h-7 text-xs"
                onClick={() => setMode("autofix")}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                <LiveText as="span" id="agent-debug-mode-autofix" defaultText="Auto-Fix" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
          {mode === "chat" ? (
            <>
              <div className="flex items-center gap-2">
                <Select value={taskType} onValueChange={setTaskType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        <div className="flex items-center gap-2">
                          {opt.icon}
                          <LiveText as="span" id={`agent-debug-task-${opt.id}`} defaultText={opt.name} />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {loading && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <LiveText as="span" id="agent-debug-processing" defaultText="Processing..." />
                  </Badge>
                )}
              </div>

              <Tabs defaultValue="input" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="input">
                    <LiveText as="span" id="agent-debug-tab-input" defaultText="Input" />
                  </TabsTrigger>
                  <TabsTrigger value="output" disabled={!response}>
                    <LiveText as="span" id="agent-debug-tab-output" defaultText="Output" />
                    {response && <Badge variant="default" className="ml-1 text-xs">1</Badge>}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="input" className="flex-1 flex flex-col gap-2 min-h-0">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Paste your code or describe the bug..."
                    className="flex-1 min-h-[200px] font-mono text-sm resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={clear}>
                      <X className="h-4 w-4 mr-1" />
                      <LiveText as="span" id="agent-debug-clear" defaultText="Clear" />
                    </Button>
                    <Button
                      onClick={handleSend}
                      disabled={!prompt.trim() || loading}
                      className="min-w-[100px]"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-1" />
                          <LiveText as="span" id="agent-debug-analyze" defaultText="Analyze" />
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="output" className="flex-1 flex flex-col gap-2 min-h-0">
                  {response && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant={response.status === "success" ? "default" : "secondary"}>
                          <LiveText as="span" id="agent-debug-status" defaultText={response.status} />
                        </Badge>
                        <span className="text-muted-foreground">
                          <LiveText as="span" id="agent-debug-model-used" defaultText={response.modelUsed} />
                        </span>
                        <span className="text-muted-foreground ml-auto">
                          <LiveText as="span" id="agent-debug-latency" defaultText={`${response.latencyMs}ms`} />
                        </span>
                      </div>
                      <ScrollArea className="flex-1 rounded-md border bg-muted p-3">
                        <pre className="text-sm font-mono whitespace-pre-wrap">{response.content}</pre>
                      </ScrollArea>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          {copied ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                              <LiveText as="span" id="agent-debug-copied" defaultText="Copied" />
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              <LiveText as="span" id="agent-debug-copy-result" defaultText="Copy Result" />
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>

              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-3 text-sm text-red-600">
                    <LiveText as="span" id="agent-debug-error-msg" defaultText={error} />
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1">
              <AgentAutoFix />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
