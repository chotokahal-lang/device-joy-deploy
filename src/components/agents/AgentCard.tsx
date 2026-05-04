import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Zap, Bug, Code, TestTube, Gauge } from "lucide-react";
import type { TaskConfig } from "@/lib/agents/types";
import { LiveText } from "@/components/ui/live-text";

const taskIcons: Record<string, React.ReactNode> = {
  "bug-fixing": <Bug className="h-5 w-5" />,
  "code-generation": <Code className="h-5 w-5" />,
  "test-writing-code-verification": <TestTube className="h-5 w-5" />,
  "code-performance-optimization": <Gauge className="h-5 w-5" />,
};

interface AgentCardProps {
  task: TaskConfig;
  isActive: boolean;
  onActivate: (taskId: string) => void;
}

export function AgentCard({ task, isActive, onActivate }: AgentCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card className={`transition-all ${isActive ? "border-primary ring-1 ring-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {taskIcons[task.id] || <Zap className="h-5 w-5" />}
            <CardTitle className="text-lg">
              <LiveText as="span" id={`agent-card-${task.id}-title`} defaultText={task.name} />
            </CardTitle>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? (
              <LiveText as="span" id={`agent-card-${task.id}-status-active`} defaultText="Active" />
            ) : (
              <LiveText as="span" id={`agent-card-${task.id}-status-idle`} defaultText="Idle" />
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          <LiveText as="span" id={`agent-card-${task.id}-desc`} defaultText={task.description} />
        </p>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">
            <LiveText as="span" id={`agent-card-${task.id}-label-policy`} defaultText="Policy:" />
          </span>
          <Badge variant="outline" className="text-xs">
            <LiveText as="span" id={`agent-card-${task.id}-policy`} defaultText={task.selectionPolicy} />
          </Badge>
          <span className="font-medium ml-2">
            <LiveText as="span" id={`agent-card-${task.id}-label-optimal`} defaultText="Optimal:" />
          </span>
          <Badge variant="outline" className="text-xs text-green-600">
            <LiveText as="span" id={`agent-card-${task.id}-optimal-model`} defaultText={task.optimalModel} />
          </Badge>
        </div>

        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex items-center gap-1">
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
              <LiveText
                as="span"
                id={`agent-card-${task.id}-models-toggle`}
                defaultText={open ? "Hide Models" : `Show ${task.models.length} Models`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 space-y-1">
              {task.models.map((model) => (
                <div
                  key={model.name}
                  className={`flex items-center justify-between rounded-md px-2 py-1 text-sm ${
                    model.name === task.optimalModel ? "bg-primary/10 text-primary font-medium" : "bg-muted"
                  }`}
                >
                  <span>
                    <LiveText as="span" id={`agent-card-${task.id}-model-${model.name.replace(/\W/g, "_")}`} defaultText={model.name} />
                  </span>
                  <Badge variant="outline" className="text-xs">
                    <LiveText as="span" id={`agent-card-${task.id}-prov-${model.name.replace(/\W/g, "_")}`} defaultText={model.provider} />
                  </Badge>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button
          className="w-full"
          variant={isActive ? "secondary" : "default"}
          onClick={() => onActivate(task.id)}
        >
          {isActive ? (
            <LiveText as="span" id={`agent-card-${task.id}-btn-off`} defaultText="Deactivate" />
          ) : (
            <LiveText as="span" id={`agent-card-${task.id}-btn-on`} defaultText="Activate Agent" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
