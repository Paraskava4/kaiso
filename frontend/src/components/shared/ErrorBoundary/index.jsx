import React from 'react';
import { Button } from '@mui/material';
import { RefreshCw, Home, ArrowLeft } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // You can also log the error to an error reporting service here
        if (process.env.NODE_ENV === 'production') {
            // Log to error reporting service
            this.logErrorToService(error, errorInfo);
        }
    }

    logErrorToService = (error, errorInfo) => {
        // Implement your error logging service here
        // Example: Sentry, LogRocket, etc.
        console.log('Logging error to service:', { error, errorInfo });
    };

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleGoBack = () => {
        window.history.back();
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-600 mb-6">
                                We're sorry, but something unexpected happened. Please try refreshing the page or go back to the previous page.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleRetry}
                                startIcon={<RefreshCw className="w-4 h-4" />}
                                className="w-full"
                            >
                                Try Again
                            </Button>
                            
                            <Button
                                variant="outlined"
                                onClick={this.handleGoBack}
                                startIcon={<ArrowLeft className="w-4 h-4" />}
                                className="w-full"
                            >
                                Go Back
                            </Button>
                            
                            <Button
                                variant="outlined"
                                onClick={this.handleGoHome}
                                startIcon={<Home className="w-4 h-4" />}
                                className="w-full"
                            >
                                Go Home
                            </Button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                    Error Details (Development Only)
                                </summary>
                                <div className="mt-2 p-4 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-40">
                                    <div className="mb-2">
                                        <strong>Error:</strong>
                                        <pre className="whitespace-pre-wrap">{this.state.error.toString()}</pre>
                                    </div>
                                    <div>
                                        <strong>Stack Trace:</strong>
                                        <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                                    </div>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for easier usage
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
    const WrappedComponent = (props) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );
    
    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    return WrappedComponent;
};

// Hook for functional components
export const useErrorHandler = () => {
    const [error, setError] = React.useState(null);

    const resetError = () => setError(null);

    const captureError = (error) => {
        setError(error);
        console.error('Error captured:', error);
    };

    React.useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return { captureError, resetError };
};

export default ErrorBoundary;
