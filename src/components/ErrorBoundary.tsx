import React from "react";

interface Props {
  children: React.ReactNode;
  name?: string;
}

interface State {
  error: Error | null;
  info: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info });
    console.error(`[ErrorBoundary${this.props.name ? `:${this.props.name}` : ""}]`, error, info);
  }

  reset = () => this.setState({ error: null, info: null });

  render() {
    if (!this.state.error) return this.props.children;

    const { error, info } = this.state;
    // Extract first meaningful component name from componentStack
    const stack = info?.componentStack || "";
    const failedComponent =
      stack
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.startsWith("at ") && !l.includes("ErrorBoundary")) || "Unknown component";

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-2xl w-full surface-elevated border border-destructive/30 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center font-black">
              !
            </div>
            <div>
              <h1 className="text-xl font-black">Terjadi error pada halaman ini</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                {this.props.name || "Runtime Error"}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 mb-4">
            <p className="text-sm font-semibold text-destructive break-words">
              {error.name}: {error.message}
            </p>
          </div>

          <details className="mb-4 text-xs" open>
            <summary className="cursor-pointer font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Komponen yang gagal
            </summary>
            <pre className="mt-2 p-3 rounded-lg bg-black/40 text-orange-300 overflow-auto max-h-40 whitespace-pre-wrap">
              {failedComponent}
            </pre>
          </details>

          <details className="mb-6 text-xs">
            <summary className="cursor-pointer font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Stack trace lengkap
            </summary>
            <pre className="mt-2 p-3 rounded-lg bg-black/40 text-muted-foreground overflow-auto max-h-64 whitespace-pre-wrap">
              {stack || error.stack}
            </pre>
          </details>

          <div className="flex gap-3">
            <button
              onClick={this.reset}
              className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-5 py-2.5 rounded-xl border border-white/10 font-bold text-sm hover:bg-white/5"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
