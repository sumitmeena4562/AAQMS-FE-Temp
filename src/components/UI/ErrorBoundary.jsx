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
                <div className="fixed inset-0 w-screen h-screen bg-[#f8fafc] flex items-center justify-center p-6 animate-in fade-in duration-700 z-[9999]">
                    <div className="max-w-md w-full min-w-[340px] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(7,34,103,0.1)] p-10 text-center border border-slate-100 relative overflow-hidden group">
                        {/* Premium Gradient Background Blur */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-1000" />

                        <div className="relative">
                            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-rose-100/50 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <FiAlertTriangle className="w-10 h-10" />
                            </div>
                            
                            <h1 className="text-3xl font-black text-title mb-4 tracking-tight">Something went wrong</h1>
                            
                            <p className="text-gray text-[14px] mb-10 leading-relaxed font-medium">
                                We've encountered an unexpected architectural anomaly. Our engineers have been alerted. In the meantime, a quick session reset might restore stability.
                            </p>

                            <button
                                onClick={this.handleRefresh}
                                className="bg-primary hover:bg-primary-dark text-white h-14 px-8 rounded-2xl flex items-center justify-center w-full gap-3 shadow-[0_8px_20px_-6px_rgba(7,34,103,0.3)] hover:shadow-[0_12px_28px_-8px_rgba(7,34,103,0.4)] hover:-translate-y-0.5 transition-all duration-300 font-bold uppercase tracking-widest text-[11px]"
                            >
                                <FiRefreshCcw className="group-hover:rotate-180 transition-transform duration-700" />
                                Restore Session
                            </button>
                            
                            {import.meta.env.DEV && this.state.error && (
                                <details className="mt-8 text-left p-5 bg-slate-50/50 rounded-2xl border border-slate-100 backdrop-blur-sm">
                                    <summary className="text-[10px] font-black text-primary/40 uppercase tracking-widest cursor-pointer outline-none hover:text-primary transition-colors">Technical Trace</summary>
                                    <div className="mt-4 p-4 bg-white/50 rounded-xl border border-slate-100">
                                        <pre className="text-[11px] text-rose-600 overflow-auto max-h-40 font-mono leading-relaxed">
                                            {this.state.error.toString()}
                                        </pre>
                                    </div>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
