// This is a simple error monitoring service
// In production, you would use a service like Sentry

type ErrorWithContext = {
  error: Error
  context?: Record<string, any>
}

class ErrorMonitoring {
  private static instance: ErrorMonitoring
  private isInitialized = false
  private environment: string

  private constructor() {
    this.environment = process.env.NODE_ENV || "development"
  }

  public static getInstance(): ErrorMonitoring {
    if (!ErrorMonitoring.instance) {
      ErrorMonitoring.instance = new ErrorMonitoring()
    }
    return ErrorMonitoring.instance
  }

  public initialize(): void {
    if (this.isInitialized) return

    // Set up global error handlers
    if (typeof window !== "undefined") {
      // Browser error handling
      window.addEventListener("error", (event) => {
        this.captureError(event.error || new Error(event.message), {
          source: event.filename,
          line: event.lineno,
          column: event.colno,
        })
      })

      window.addEventListener("unhandledrejection", (event) => {
        this.captureError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
          type: "unhandledrejection",
        })
      })
    } else {
      // Server-side error handling
      process.on("uncaughtException", (error) => {
        this.captureError(error, { type: "uncaughtException" })
      })

      process.on("unhandledRejection", (reason) => {
        this.captureError(reason instanceof Error ? reason : new Error(String(reason)), { type: "unhandledRejection" })
      })
    }

    this.isInitialized = true
    console.log(`Error monitoring initialized in ${this.environment} environment`)
  }

  public captureError(error: Error, context?: Record<string, any>): void {
    const errorData: ErrorWithContext = {
      error,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        environment: this.environment,
      },
    }

    // In development, log to console
    if (this.environment === "development") {
      console.error("Error captured:", errorData)
      return
    }

    // In production, send to error tracking service
    // This would be replaced with a call to Sentry, LogRocket, etc.
    this.sendToErrorService(errorData)
  }

  private sendToErrorService(errorData: ErrorWithContext): void {
    // In a real implementation, this would send the error to a service like Sentry
    // For now, we'll just log it
    console.error("Error captured in production:", errorData)

    // Example of how you might send this to an API endpoint
    try {
      fetch("/api/error-logging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: errorData.error.message,
          stack: errorData.error.stack,
          context: errorData.context,
        }),
      })
    } catch (e) {
      // Fail silently - we don't want to cause more errors
      console.error("Failed to send error to logging service", e)
    }
  }
}

export const errorMonitoring = ErrorMonitoring.getInstance()
