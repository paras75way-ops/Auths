// Error types for frontend error handling
export const ErrorType = {
  NETWORK: "NETWORK",
  VALIDATION: "VALIDATION",
  AUTHENTICATION: "AUTHENTICATION",
  AUTHORIZATION: "AUTHORIZATION",
  NOT_FOUND: "NOT_FOUND",
  SERVER: "SERVER",
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

// Error severity levels
export const ErrorSeverity = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export type ErrorSeverity = typeof ErrorSeverity[keyof typeof ErrorSeverity];

export interface AppError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  details?: any;
  timestamp: Date;
  context?: string;
}

// Error categories for better organization
export interface ErrorCategory {
  type: ErrorType;
  severity: ErrorSeverity;
  userMessage: string;
  technicalMessage: string;
  suggestedAction?: string;
}

// Error category mapping
export const ERROR_CATEGORIES: Record<ErrorType, ErrorCategory> = {
  [ErrorType.NETWORK]: {
    type: ErrorType.NETWORK,
    severity: ErrorSeverity.HIGH,
    userMessage: "Network connection issue",
    technicalMessage: "Failed to connect to the server",
    suggestedAction: "Please check your internet connection and try again",
  },
  [ErrorType.VALIDATION]: {
    type: ErrorType.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: "Invalid input data",
    technicalMessage: "Form validation failed",
    suggestedAction: "Please check the form fields and correct any errors",
  },
  [ErrorType.AUTHENTICATION]: {
    type: ErrorType.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: "Authentication required",
    technicalMessage: "User not authenticated",
    suggestedAction: "Please log in to continue",
  },
  [ErrorType.AUTHORIZATION]: {
    type: ErrorType.AUTHORIZATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: "Access denied",
    technicalMessage: "Insufficient permissions",
    suggestedAction: "You don't have permission to perform this action",
  },
  [ErrorType.NOT_FOUND]: {
    type: ErrorType.NOT_FOUND,
    severity: ErrorSeverity.LOW,
    userMessage: "Resource not found",
    technicalMessage: "Requested resource does not exist",
    suggestedAction: "The requested resource may have been moved or deleted",
  },
  [ErrorType.SERVER]: {
    type: ErrorType.SERVER,
    severity: ErrorSeverity.HIGH,
    userMessage: "Server error",
    technicalMessage: "Internal server error",
    suggestedAction: "Please try again later. If the problem persists, contact support",
  },
  [ErrorType.UNKNOWN]: {
    type: ErrorType.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    userMessage: "Something went wrong",
    technicalMessage: "Unexpected error occurred",
    suggestedAction: "Please try again and contact support if the problem continues",
  },
};
