import React from 'react';

interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  widgetName?: string;
}

interface WidgetErrorBoundaryState {
  hasError: boolean;
}

export class WidgetErrorBoundary extends React.Component<WidgetErrorBoundaryProps, WidgetErrorBoundaryState> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): WidgetErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`WidgetErrorBoundary (${this.props.widgetName || 'Unknown Widget'}) caught an error:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-danger-200 bg-danger-50 text-danger-700 rounded-md text-sm flex flex-col items-center justify-center h-full min-h-[120px]">
          <p className="font-semibold mb-1">Widget Failed</p>
          <p className="text-xs text-danger-600">
            {this.props.widgetName ? `${this.props.widgetName} failed to load.` : 'This widget failed to load.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-3 py-1 bg-white border border-danger-200 rounded text-xs hover:bg-danger-50 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
