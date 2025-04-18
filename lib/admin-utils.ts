import { createServerClient } from "@/lib/supabase/server"

/**
 * Review a creator application
 * @param params - Parameters for reviewing an application
 * @returns Result of the review operation
 */
export async function reviewApplication(params: {
  applicationId: number
  status: "APPROVED" | "REJECTED"
  reviewNotes?: string
}): Promise<{ success: boolean; error?: string }> {
  const { applicationId, status, reviewNotes } = params

  try {
    const supabase = createServerClient()

    // First, get the application details
    const { data: application, error: appError } = await supabase
      .from("creator_applications")
      .select("*")
      .eq("id", applicationId)
      .single()

    if (appError) {
      console.error("Error fetching application:", appError)
      return {
        success: false,
        error: appError.message,
      }
    }

    // Update the application status
    const { error } = await supabase
      .from("creator_applications")
      .update({
        status,
        review_notes: reviewNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId)

    if (error) {
      console.error("Error reviewing application:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    // If approved, update the user's verification status
    if (status === "APPROVED") {
      // First check if there's a user with this email
      const { data: userData, error: userError } = await supabase
        .from("creatoramp_users")
        .select("id")
        .eq("email", application.email)
        .single()

      if (!userError && userData) {
        // Update the user's verification status
        await supabase
          .from("creatoramp_users")
          .update({
            is_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userData.id)
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error in reviewApplication:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
