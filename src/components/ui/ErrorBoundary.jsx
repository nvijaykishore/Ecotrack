import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-[50vh] flex flex-col items-center justify-center px-6 text-center"
          role="alert"
        >
          <h2 className="font-display text-xl font-bold text-eco-800 dark:text-eco-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-eco-500 mb-4 max-w-md">
            This section encountered an error. Your saved data is still safe in localStorage.
          </p>
          <button type="button" className="btn-primary" onClick={this.handleRetry}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}