import { useNavigate } from "react-router-dom";
import { AgentAutoFix } from "@/components/agents/AgentAutoFix";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Zap } from "lucide-react";
import { LiveText } from "@/components/ui/live-text";

export default function AgentAutoFixPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl py-6 px-4 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <LiveText as="span" id="agent-autofix-title" defaultText="Agent Auto-Fix" />
              </h1>
              <p className="text-xs text-muted-foreground">
                <LiveText as="span" id="agent-autofix-subtitle" defaultText="Automatic code analysis & repair" />
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">
              <LiveText as="span" id="agent-autofix-badge" defaultText="Auto-scan on type" />
            </span>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <AgentAutoFix />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
