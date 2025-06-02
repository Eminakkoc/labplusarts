import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

// This component displays a modal when an error (unhandled) occurs in its child components.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleClose = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    return (
      <>
        {this.state.hasError ? (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
              <h2 className="mb-2 text-xl font-bold text-red-600">Something went wrong</h2>
              <p className="mb-4">{this.state.error?.message}</p>
              <button
                className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
                onClick={this.handleClose}
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
        {this.props.children}
      </>
    );
  }
}
