import React from 'react';
import { FiAlertTriangle, FiRefreshCcw } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    handleRefresh = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiAlertTriangle className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
                        <p className="text-slate-500 mb-8 text-sm">
                            We're sorry, but an unexpected error occurred. Our team has been notified. Please try refreshing the page.
                        </p>
                        <button
                            onClick={this.handleRefresh}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg flex items-center justify-center w-full gap-2 transition-colors font-medium"
                        >
                            <FiRefreshCcw />
                            Refresh Page
                        </button>
                        
                        {/* Option to view error details in dev (safely commented out for purely prod presentation, or use a toggle) */}
                        {import.meta.env.DEV && this.state.error && (
                             <details className="mt-6 text-left p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <summary className="text-xs font-semibold text-slate-600 cursor-pointer outline-none">View Technical Details</summary>
                                <pre className="mt-2 text-[10px] text-red-500 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
