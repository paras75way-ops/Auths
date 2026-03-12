import { AppError, ErrorType, ErrorSeverity, ERROR_CATEGORIES } from "./types";

// Error handler class for centralized error management
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorHistory: AppError[] = [];
  private maxHistorySize = 100;

  private constructor() {}

  // Singleton pattern
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Create standardized error from various error sources
  public createError(
    error: any,
    context?: string,
    type?: ErrorType
  ): AppError {
    const timestamp = new Date();
    let errorType: ErrorType;
    let message: string;
    let statusCode: number | undefined;
    let details: any;

    if (error?.response) {
      // HTTP error from axios/fetch
      statusCode = error.response.status;
      errorType = this.getErrorTypeFromStatus(statusCode);
      message = error.response.data?.message || error.message || "Request failed";
      details = {
        url: error.config?.url,
        method: error.config?.method,
        status: statusCode,
        response: error.response.data,
      };
    } else if (error?.request) {
      // Network error (no response received)
      errorType = ErrorType.NETWORK;
      message = "Network error - unable to connect to server";
      details = {
        url: error.config?.url,
        method: error.config?.method,
      };
    } else if (error instanceof Error) {
      // JavaScript error
      errorType = type || ErrorType.UNKNOWN;
      message = error.message;
      details = {
        stack: error.stack,
        name: error.name,
      };
    } else if (typeof error === "string") {
      // String error
      errorType = type || ErrorType.UNKNOWN;
      message = error;
      details = { originalError: error };
    } else {
      // Unknown error type
      errorType = type || ErrorType.UNKNOWN;
      message = "Unknown error occurred";
      details = { originalError: error };
    }

    const appError: AppError = {
      type: errorType,
      message,
      statusCode,
      details,
      timestamp,
      context,
    };

    this.addToHistory(appError);
    return appError;
  }

  // Get error type from HTTP status code
  private getErrorTypeFromStatus(status: number): ErrorType {
    if (status === 400) return ErrorType.VALIDATION;
    if (status === 401) return ErrorType.AUTHENTICATION;
    if (status === 403) return ErrorType.AUTHORIZATION;
    if (status === 404) return ErrorType.NOT_FOUND;
    if (status >= 500) return ErrorType.SERVER;
    if (status >= 400) return ErrorType.UNKNOWN;
    return ErrorType.UNKNOWN;
  }

  // Add error to history
  private addToHistory(error: AppError): void {
    this.errorHistory.unshift(error);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
    }
  }

  // Get error category information
  public getErrorCategory(error: AppError) {
    return ERROR_CATEGORIES[error.type];
  }

  // Get user-friendly error message
  public getUserMessage(error: AppError): string {
    const category = this.getErrorCategory(error);
    return category.userMessage;
  }

  // Get suggested action for user
  public getSuggestedAction(error: AppError): string | undefined {
    const category = this.getErrorCategory(error);
    return category.suggestedAction;
  }

  // Get error severity
  public getSeverity(error: AppError): ErrorSeverity {
    const category = this.getErrorCategory(error);
    return category.severity;
  }

  // Check if error is recoverable
  public isRecoverable(error: AppError): boolean {
    const severity = this.getSeverity(error);
    return severity !== ErrorSeverity.CRITICAL && severity !== ErrorSeverity.HIGH;
  }

  // Get error history
  public getErrorHistory(): AppError[] {
    return [...this.errorHistory];
  }

  // Clear error history
  public clearHistory(): void {
    this.errorHistory = [];
  }

  // Get errors by type
  public getErrorsByType(type: ErrorType): AppError[] {
    return this.errorHistory.filter(error => error.type === type);
  }

  // Get recent errors (last N errors)
  public getRecentErrors(count: number = 10): AppError[] {
    return this.errorHistory.slice(0, count);
  }

  // Log error for debugging
  public logError(error: AppError, additionalInfo?: any): void {
    const category = this.getErrorCategory(error);
    console.group(`🚨 ${category.type} Error`);
    console.error("Error:", error);
    console.error("Category:", category);
    if (additionalInfo) {
      console.error("Additional Info:", additionalInfo);
    }
    console.groupEnd();
  }

  // Handle error with logging and categorization
  public handleError(
    error: any,
    context?: string,
    type?: ErrorType,
    additionalInfo?: any
  ): AppError {
    const appError = this.createError(error, context, type);
    this.logError(appError, additionalInfo);
    return appError;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();
