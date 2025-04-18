"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function fetchApplications(params: {
  search?: string
  sort?: string
  page?: number
  pageSize?: number
  status?: string
}) {
  const { search, sort, page = 1, pageSize = 10, status } = params

  try {
    const supabase = createServerClient()

    let query = supabase.from("creator_applications").select("*", { count: "exact" })

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status.toUpperCase())
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,tiktok_handle.ilike.%${search}%,content_niche.ilike.%${search}%`,
      )
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case "newest":
          query = query.order("created_at", { ascending: false })
          break
        case "oldest":
          query = query.order("created_at", { ascending: true })
          break
        case "followers-high":
          query = query.order("follower_count", { ascending: false })
          break
        case "followers-low":
          query = query.order("follower_count", { ascending: true })
          break
        default:
          query = query.order("created_at", { ascending: false })
      }
    } else {
      query = query.order("created_at", { ascending: false })
    }

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count, error } = await query.range(from, to)

    if (error) {
      console.error("Error fetching applications:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0

    return {
      success: true,
      applications: data,
      totalPages,
      totalCount: count,
    }
  } catch (error) {
    console.error("Error in fetchApplications:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

export async function reviewApplicationAction(params: {
  applicationId: string
  status: "APPROVED" | "REJECTED"
  reviewNotes: string
}) {
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
        review_notes: reviewNotes,
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

    // Revalidate the applications page to reflect the changes
    revalidatePath("/admin/applications")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error in reviewApplicationAction:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}
