import { useState, useEffect, useCallback } from "react";
import { analyzeCode, applyFix, type CodeIssue, type AnalysisResult } from "@/lib/agents/analyzer";
import { useAgent } from "@/hooks/use-agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Wand2,
  Bug,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  XCircle,
  Copy,
  Play,
  Loader2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  FileCode,
} from "lucide-react";
import { LiveText } from "@/components/ui/live-text";

function DiffLine({ type, content, lineNum }: { type: "same" | "removed" | "added"; content: string; lineNum: number }) {
  const bg = type === "removed" ? "bg-red-500/15" : type === "added" ? "bg-green-500/15" : "";
  const text = type === "removed" ? "text-red-400" : type === "added" ? "text-green-400" : "text-muted-foreground";
  const icon = type === "removed" ? <XCircle className="h-3 w-3 text-red-400" /> : type === "added" ? <CheckCircle className="h-3 w-3 text-green-400" /> : null;

  return (
    <div className={`flex items-start gap-2 px-2 py-0.5 font-mono text-sm ${bg}`}>
      <span className="w-8 text-right text-muted-foreground select-none shrink-0">{lineNum}</span>
      <span className="w-4 shrink-0 pt-0.5">{icon}</span>
      <span className={`${text} whitespace-pre-wrap break-all`}>{content || " "}</span>
    </div>
  );
}

function DiffView({ original, fixed }: { original: string; fixed: string }) {
  const origLines = original.split("\n");
  const fixedLines = fixed.split("\n");
  const maxLen = Math.max(origLines.length, fixedLines.length);
  const lines: Array<{ type: "same" | "removed" | "added"; content: string; lineNum: number }> = [];

  for (let i = 0; i < maxLen; i++) {
    const o = origLines[i] ?? "";
    const f = fixedLines[i] ?? "";
    if (o === f) {
      lines.push({ type: "same", content: o, lineNum: i + 1 });
    } else {
      if (o) lines.push({ type: "removed", content: o, lineNum: i + 1 });
      if (f) lines.push({ type: "added", content: f, lineNum: i + 1 });
    }
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border bg-muted/50">
      <div className="py-2">
        {lines.map((l, i) => (
          <DiffLine key={i} type={l.type} content={l.content} lineNum={l.lineNum} />
        ))}
      </div>
    </ScrollArea>
  );
}

function IssueRow({ issue, onApply, applied }: { issue: CodeIssue; onApply: (issue: CodeIssue) => void; applied: boolean }) {
  const [open, setOpen] = useState(false);
  const severityIcon = {
    error: <XCircle className="h-4 w-4 text-red-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    suggestion: <Lightbulb className="h-4 w-4 text-blue-500" />,
  };

  return (
    <div className="rounded-lg border bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-muted/50 transition-colors"
      >
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        {severityIcon[issue.severity]}
        <Badge variant={issue.severity === "error" ? "destructive" : issue.severity === "warning" ? "secondary" : "outline"} className="text-xs">
          <LiveText as="span" id={`autofix-issue-${issue.id}-severity`} defaultText={issue.severity} />
        </Badge>
        <span className="text-sm font-medium">
          <LiveText as="span" id={`autofix-issue-${issue.id}-msg`} defaultText={issue.message} />
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          <LiveText as="span" id={`autofix-issue-${issue.id}-line`} defaultText={`Line ${issue.line}`} />
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          <p className="text-sm text-muted-foreground">
            <LiveText as="span" id={`autofix-issue-${issue.id}-explain`} defaultText={issue.explanation} />
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="rounded bg-red-500/10 p-2 border border-red-500/20">
              <p className="text-red-400 mb-1 font-semibold">
                <LiveText as="span" id={`autofix-issue-${issue.id}-lbl-orig`} defaultText="Original" />
              </p>
              <code className="whitespace-pre-wrap break-all">{issue.original}</code>
            </div>
            <div className="rounded bg-green-500/10 p-2 border border-green-500/20">
              <p className="text-green-400 mb-1 font-semibold">
                <LiveText as="span" id={`autofix-issue-${issue.id}-lbl-fixed`} defaultText="Fixed" />
              </p>
              <code className="whitespace-pre-wrap break-all">{issue.replacement}</code>
            </div>
          </div>
          <Button
            size="sm"
            variant={applied ? "outline" : "default"}
            disabled={applied}
            onClick={() => onApply(issue)}
          >
            {applied ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                <LiveText as="span" id={`autofix-issue-${issue.id}-applied`} defaultText="Applied" />
              </>
            ) : (
              <>
                <Wand2 className="h-3 w-3 mr-1" />
                <LiveText as="span" id={`autofix-issue-${issue.id}-apply`} defaultText="Apply Fix" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export function AgentAutoFix() {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [currentCode, setCurrentCode] = useState("");
  const [activeTab, setActiveTab] = useState("issues");
  const { send, loading, response, clear } = useAgent();

  const runAnalysis = useCallback(() => {
    if (!code.trim()) return;
    const result = analyzeCode(code);
    setAnalysis(result);
    setCurrentCode(result.fixedCode);
    setAppliedIds(new Set());
  }, [code]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (code.trim().length > 50) {
        runAnalysis();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [code, runAnalysis]);

  const applySingleFix = (issue: CodeIssue) => {
    const newCode = applyFix(currentCode, issue);
    setCurrentCode(newCode);
    setAppliedIds((prev) => new Set(prev).add(issue.id));
  };

  const applyAllFixes = () => {
    if (!analysis) return;
    let newCode = code;
    const newApplied = new Set<string>();
    for (const issue of analysis.issues) {
      newCode = applyFix(newCode, issue);
      newApplied.add(issue.id);
    }
    setCurrentCode(newCode);
    setAppliedIds(newApplied);
  };

  const runAIAnalysis = async () => {
    if (!code.trim()) return;
    await send({
      taskType: "bug-fixing",
      prompt: `Analyze and fix the following code:\n\n\`\`\`tsx\n${code}\n\`\`\`\n\nPlease identify all issues, explain them, and provide the complete fixed code.`,
      priority: "high",
    });
    setActiveTab("ai");
  };

  const copyFixed = () => {
    navigator.clipboard.writeText(currentCode);
  };

  const copyAIResult = () => {
    if (response?.content) {
      navigator.clipboard.writeText(response.content);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">
            <LiveText as="span" id="autofix-panel-title" defaultText="Agent Auto-Fix" />
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {analysis && (
            <>
              <Badge variant="destructive">
                <LiveText as="span" id="autofix-badge-errors" defaultText={`${analysis.summary.errors} errors`} />
              </Badge>
              <Badge variant="secondary">
                <LiveText as="span" id="autofix-badge-warnings" defaultText={`${analysis.summary.warnings} warnings`} />
              </Badge>
              <Badge variant="outline">
                <LiveText as="span" id="autofix-badge-tips" defaultText={`${analysis.summary.suggestions} tips`} />
              </Badge>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-1">
              <FileCode className="h-4 w-4" />
              <LiveText as="span" id="autofix-label-your-code" defaultText="Your Code" />
            </label>
            <Button size="sm" variant="outline" onClick={runAnalysis} disabled={!code.trim()}>
              <Play className="h-3 w-3 mr-1" />
              <LiveText as="span" id="autofix-btn-scan" defaultText="Scan Now" />
            </Button>
          </div>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your React/TypeScript code here... Auto-scan starts after you stop typing."
            className="min-h-[300px] font-mono text-sm resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <LiveText as="span" id="autofix-label-fixed-code" defaultText="Fixed Code" />
            </label>
            <div className="flex items-center gap-2">
              {analysis && analysis.issues.length > 0 && (
                <Button size="sm" variant="default" onClick={applyAllFixes}>
                  <Wand2 className="h-3 w-3 mr-1" />
                  <LiveText
                    as="span"
                    id="autofix-btn-apply-all"
                    defaultText={`Apply All (${analysis.issues.length})`}
                  />
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={copyFixed} disabled={!currentCode}>
                <Copy className="h-3 w-3 mr-1" />
                <LiveText as="span" id="autofix-btn-copy-fixed" defaultText="Copy" />
              </Button>
            </div>
          </div>
          <Textarea
            value={currentCode}
            readOnly
            className="min-h-[300px] font-mono text-sm resize-none bg-muted/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={runAIAnalysis} disabled={!code.trim() || loading} className="min-w-[140px]">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
          {loading ? (
            <LiveText as="span" id="autofix-btn-ai-loading" defaultText="AI Analyzing..." />
          ) : (
            <LiveText as="span" id="autofix-btn-ai-run" defaultText="Deep AI Fix" />
          )}
        </Button>
        <span className="text-xs text-muted-foreground">
          <LiveText
            as="span"
            id="autofix-ai-hint"
            defaultText={`Uses ${code.length > 500 ? "Claude Opus / Deepseek" : "GPT-5.4"} for complex fixes`}
          />
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="issues">
            <LiveText
              as="span"
              id="autofix-tab-issues"
              defaultText={`Static Analysis (${analysis?.issues.length ?? 0})`}
            />
          </TabsTrigger>
          <TabsTrigger value="diff">
            <LiveText as="span" id="autofix-tab-diff" defaultText="Diff View" />
          </TabsTrigger>
          <TabsTrigger value="ai" disabled={!response}>
            <LiveText as="span" id="autofix-tab-ai" defaultText="AI Result" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-2 mt-4">
          {!analysis && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileCode className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>
                  <LiveText as="span" id="autofix-empty-issues" defaultText="Paste code to see detected issues" />
                </p>
              </CardContent>
            </Card>
          )}
          {analysis?.issues.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-green-600 font-medium">
                  <LiveText as="span" id="autofix-clean" defaultText="No issues found! Your code looks clean." />
                </p>
              </CardContent>
            </Card>
          )}
          {analysis?.issues.map((issue) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              onApply={applySingleFix}
              applied={appliedIds.has(issue.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="diff" className="mt-4">
          {analysis ? (
            <DiffView original={code} fixed={currentCode} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <LiveText as="span" id="autofix-empty-diff" defaultText="No diff available. Paste and scan code first." />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai" className="mt-4 space-y-2">
          {response && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge>
                    <LiveText as="span" id="autofix-ai-model" defaultText={response.modelUsed} />
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    <LiveText as="span" id="autofix-ai-latency" defaultText={`${response.latencyMs}ms`} />
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={copyAIResult}>
                  <Copy className="h-3 w-3 mr-1" />
                  <LiveText as="span" id="autofix-copy-ai" defaultText="Copy AI Result" />
                </Button>
              </div>
              <ScrollArea className="h-[400px] rounded-md border p-4 bg-muted/50">
                <pre className="text-sm font-mono whitespace-pre-wrap">{response.content}</pre>
              </ScrollArea>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
