import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-lg">
            <div className="text-6xl mb-6">🚗</div>
            <h1 className="text-2xl font-bold mb-4">Swiss Rent A Car</h1>
            {this.state.error && (
              <details className="text-left bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm">
                <summary className="font-semibold text-red-700 cursor-pointer mb-2">Error details</summary>
                <pre className="text-red-600 whitespace-pre-wrap break-all text-xs">
                  {this.state.error.message}{"\n\n"}{this.state.error.stack}
                </pre>
              </details>
            )}
            <p className="text-muted-foreground mb-6">
              Na kontaktoni direkt për rezervime:
            </p>
            <a
              href="tel:+38344123456"
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors"
            >
              +383 44 123 456
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
