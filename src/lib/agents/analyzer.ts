export interface CodeIssue {
  id: string;
  severity: "error" | "warning" | "suggestion";
  line: number;
  column: number;
  message: string;
  rule: string;
  original: string;
  replacement: string;
  explanation: string;
}

export interface AnalysisResult {
  issues: CodeIssue[];
  fixedCode: string;
  summary: {
    errors: number;
    warnings: number;
    suggestions: number;
  };
}

const RULES: Array<{
  id: string;
  severity: CodeIssue["severity"];
  pattern: RegExp;
  replacement: string | ((match: string) => string);
  message: string;
  explanation: string;
}> = [
  {
    id: "react-key-missing",
    severity: "error",
    pattern: /\{\s*([a-zA-Z_$][\w$]*)\.map\s*\(\s*\(([\w$]+)\)\s*=>\s*<([A-Z][\w]*)/g,
    replacement: (match) => match.replace(/\)\s*=>\s*</g, ") => <").replace(/<([A-Z][\w]*)/g, "<$1 key={$2.id ?? $2.toString()}"),
    message: "Missing key prop in list rendering",
    explanation: "React requires a unique key prop for items rendered in a list to optimize reconciliation.",
  },
  {
    id: "use-effect-deps",
    severity: "warning",
    pattern: /useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?\},\s*\[\s*\]\s*\)/g,
    replacement: (match) => {
      const vars = match.match(/[a-zA-Z_$][\w$]*(?=\s*\[)/g);
      if (vars && vars.length > 0) {
        const deps = [...new Set(vars)].join(", ");
        return match.replace(/\[\s*\]/, `[${deps}]`);
      }
      return match;
    },
    message: "Empty dependency array in useEffect",
    explanation: "useEffect with empty deps [] only runs on mount. If it uses state/props, add them to dependencies.",
  },
  {
    id: "unused-import",
    severity: "warning",
    pattern: /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"][^'"]+['"];/g,
    replacement: "$1",
    message: "Potentially unused import",
    explanation: "Check if all imported items are used. Remove unused imports to reduce bundle size.",
  },
  {
    id: "console-log",
    severity: "suggestion",
    pattern: /console\.(log|warn|error|info|debug)\s*\([^)]*\)\s*;?/g,
    replacement: "",
    message: "Console statement found",
    explanation: "Remove console.log before production. Use proper logging service instead.",
  },
  {
    id: "any-type",
    severity: "warning",
    pattern: /:\s*any\b/g,
    replacement: ": unknown",
    message: "Avoid using 'any' type",
    explanation: "Using 'any' defeats TypeScript's type safety. Use 'unknown' with type guards instead.",
  },
  {
    id: "var-declaration",
    severity: "error",
    pattern: /\bvar\s+/g,
    replacement: "const ",
    message: "Use const/let instead of var",
    explanation: "var has function scope and hoisting issues. Prefer const for immutable bindings.",
  },
  {
    id: "missing-return-type",
    severity: "suggestion",
    pattern: /function\s+([A-Z][\w]*)\s*\([^)]*\)\s*\{/g,
    replacement: (match: string) => match.replace("{", ": JSX.Element {"),
    message: "Missing return type on React component",
    explanation: "Explicit return types help TypeScript catch errors and improve IntelliSense.",
  },
  {
    id: "inline-style",
    severity: "suggestion",
    pattern: /style\s*=\s*\{\s*\{[^}]+\}\s*\}/g,
    replacement: (match) => match,
    message: "Inline styles detected",
    explanation: "Consider using Tailwind CSS classes or CSS modules for maintainability.",
  },
  {
    id: "magic-number",
    severity: "suggestion",
    pattern: /(?<!\w)(\d{3,})(?!\w)/g,
    replacement: (match) => `CONST_${match}`,
    message: "Magic number detected",
    explanation: "Extract large numbers into named constants for better readability.",
  },
  {
    id: "deprecated-react",
    severity: "warning",
    pattern: /React\.FC|React\.FunctionComponent/g,
    replacement: "",
    message: "Deprecated React.FC usage",
    explanation: "React.FC is deprecated. Use regular function with explicit props type instead.",
  },
];

export function analyzeCode(code: string): AnalysisResult {
  const issues: CodeIssue[] = [];
  let fixedCode = code;
  const lines = code.split("\n");

  for (const rule of RULES) {
    let match: RegExpExecArray | null;
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g");

    while ((match = pattern.exec(code)) !== null) {
      const matchedStr = match[0];
      const startPos = match.index;

      let line = 1;
      let col = 1;
      for (let i = 0; i < startPos; i++) {
        if (code[i] === "\n") {
          line++;
          col = 1;
        } else {
          col++;
        }
      }

      let replacement: string;
      if (typeof rule.replacement === "function") {
        replacement = rule.replacement(matchedStr);
      } else {
        replacement = rule.replacement;
      }

      // Apply fix to fixedCode
      if (rule.id !== "unused-import" && rule.id !== "inline-style") {
        fixedCode = fixedCode.replace(matchedStr, replacement || matchedStr);
      }

      issues.push({
        id: `${rule.id}-${line}-${col}`,
        severity: rule.severity,
        line,
        column: col,
        message: rule.message,
        rule: rule.id,
        original: matchedStr,
        replacement: replacement || matchedStr,
        explanation: rule.explanation,
      });
    }
  }

  return {
    issues,
    fixedCode,
    summary: {
      errors: issues.filter((i) => i.severity === "error").length,
      warnings: issues.filter((i) => i.severity === "warning").length,
      suggestions: issues.filter((i) => i.severity === "suggestion").length,
    },
  };
}

export function applyFix(code: string, issue: CodeIssue): string {
  return code.replace(issue.original, issue.replacement || issue.original);
}
