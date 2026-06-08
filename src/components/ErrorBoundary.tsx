import { Component, type ErrorInfo, type ReactNode } from 'react';
import { telegraph } from '@/lib/telemetry';
import { recoverScrollLayout } from '@/lib/recovery';

interface Props {
  children: ReactNode;
  fallbackLabel?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    telegraph('error-boundary', error.message, {
      componentStack: info.componentStack,
    }, 'error');
    recoverScrollLayout('error-boundary');
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, message: '' });
    recoverScrollLayout('error-boundary-retry');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-6 py-16 bg-[#f7f7f7] dark:bg-[#0a0a0a] text-center"
        >
          <p className="font-teko text-3xl text-gray-900 dark:text-white">
            Something interrupted the experience
          </p>
          <p className="font-opensans text-sm text-gray-600 dark:text-white/60 max-w-md">
            {this.props.fallbackLabel ?? 'The page recovered safely.'} You can reload or continue
            with reduced motion effects.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="font-opensans text-sm px-5 py-2.5 rounded-lg bg-orange text-white hover:bg-orange/90"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-opensans text-sm px-5 py-2.5 rounded-lg border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
