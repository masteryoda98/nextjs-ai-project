import { NextResponse } from "next/server"

// Standard error response structure
export interface ApiError {
  success: false
  message: string
  code?: string
  details?: any
}

// Standard success response structure
export interface ApiSuccess<T> {
  success: true
  data: T
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// Helper function to create error responses
export function createErrorResponse(
  message: string,
  status = 500,
  code?: string,
  details?: any,
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      message,
      code,
      details,
    },
    { status },
  )
}

// Helper function to create success responses
export function createSuccessResponse<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  )
}

// Error handler for API routes
export async function apiHandler<T>(
  handler: () => Promise<T>,
  errorMessage = "An unexpected error occurred",
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    const result = await handler()
    return createSuccessResponse(result)
  } catch (error) {
    console.error(`API Error: ${errorMessage}`, error)

    // Handle specific error types
    if (error instanceof Error) {
      return createErrorResponse(error.message || errorMessage)
    }

    return createErrorResponse(errorMessage)
  }
}
