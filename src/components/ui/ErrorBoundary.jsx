import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an AI component failure:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-4 bg-charcoal border border-red-500/30 rounded flex items-start gap-3 text-text-muted text-sm">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-red-400 mb-1">Component Rendering Suspended</p>
            <p className="font-mono text-xs">{this.state.error?.message || "An unexpected error occurred in this AI module."}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
