import React, { createContext, useContext, useState, ReactNode } from "react";
import { AppError, ErrorType, ErrorSeverity } from "./types";
import { errorHandler } from "./ErrorHandler";

// Error context for global error management
interface ErrorContextType {
  currentError: AppError | null;
  showError: (error: AppError) => void;
  clearError: () => void;
  hasError: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Error provider component
export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentError, setCurrentError] = useState<AppError | null>(null);

  const showError = (error: AppError) => {
    setCurrentError(error);
  };

  const clearError = () => {
    setCurrentError(null);
  };

  return (
    <ErrorContext.Provider
      value={{
        currentError,
        showError,
        clearError,
        hasError: !!currentError,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

// Hook to use error context
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};

// Error display component
export const ErrorDisplay: React.FC = () => {
  const { currentError, clearError, hasError } = useError();

  if (!hasError || !currentError) {
    return null;
  }

  const category = errorHandler.getErrorCategory(currentError);
  const severity = errorHandler.getSeverity(currentError);
  const suggestedAction = errorHandler.getSuggestedAction(currentError);

  const getSeverityStyles = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.LOW:
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case ErrorSeverity.MEDIUM:
        return "bg-orange-50 border-orange-200 text-orange-800";
      case ErrorSeverity.HIGH:
        return "bg-red-50 border-red-200 text-red-800";
      case ErrorSeverity.CRITICAL:
        return "bg-red-100 border-red-300 text-red-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIcon = (type: ErrorType) => {
    switch (type) {
      case ErrorType.NETWORK:
        return "🌐";
      case ErrorType.VALIDATION:
        return "⚠️";
      case ErrorType.AUTHENTICATION:
        return "🔐";
      case ErrorType.AUTHORIZATION:
        return "🚫";
      case ErrorType.NOT_FOUND:
        return "🔍";
      case ErrorType.SERVER:
        return "🔥";
      default:
        return "❌";
    }
  };

  const isRecoverable = errorHandler.isRecoverable(currentError);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      <div
        className={`
          ${getSeverityStyles(severity)}
          border rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out
          transform ${hasError ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 text-2xl">
            {getIcon(currentError.type)}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {category.userMessage}
              </h3>
              <button
                onClick={clearError}
                className="ml-2 text-sm hover:opacity-70 transition-opacity"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-2 text-sm opacity-90">
              {currentError.message}
            </div>

            {suggestedAction && (
              <div className="mt-3 text-sm font-medium">
                💡 {suggestedAction}
              </div>
            )}

            {/* Show additional context if available */}
            {currentError.context && (
              <div className="mt-2 text-xs opacity-75">
                Context: {currentError.context}
              </div>
            )}

            {/* Action buttons for recoverable errors */}
            {isRecoverable && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={clearError}
                  className="px-3 py-1 text-xs font-medium rounded border border-current hover:bg-current hover:text-white transition-colors"
                >
                  Dismiss
                </button>
                {currentError.type === ErrorType.NETWORK && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 text-xs font-medium rounded bg-current text-white hover:opacity-80 transition-opacity"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Error boundary component
export class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = errorHandler.handleError(
      error,
      "React Error Boundary",
      ErrorType.UNKNOWN,
      { componentStack: errorInfo.componentStack }
    );
    
    const { showError } = this.context;
    if (showError) {
      showError(appError);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for handling errors in components
export const useErrorHandler = () => {
  const { showError, clearError } = useError();

  const handleError = (error: any, context?: string, type?: ErrorType) => {
    const appError = errorHandler.handleError(error, context, type);
    showError(appError);
  };

  const handleNetworkError = (error: any, context?: string) => {
    handleError(error, context, ErrorType.NETWORK);
  };

  const handleValidationError = (error: any, context?: string) => {
    handleError(error, context, ErrorType.VALIDATION);
  };

  const handleAuthError = (error: any, context?: string) => {
    handleError(error, context, ErrorType.AUTHENTICATION);
  };

  return {
    handleError,
    handleNetworkError,
    handleValidationError,
    handleAuthError,
    clearError,
  };
};
