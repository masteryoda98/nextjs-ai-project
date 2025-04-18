import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { isAdmin, isAuthenticated } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    if (!(await isAuthenticated()) || !(await isAdmin())) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const sort = searchParams.get("sort") || "newest"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const status = searchParams.get("status")

    const offset = (page - 1) * pageSize

    const supabase = createServerClient()

    // First, get the total count for pagination
    let countQuery = supabase.from("creator_applications").select("id", { count: "exact" })

    if (status) {
      countQuery = countQuery.eq("status", status)
    }

    if (search) {
      countQuery = countQuery.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,tiktok_handle.ilike.%${search}%,content_niche.ilike.%${search}%`,
      )
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error("Error counting applications:", countError)
      return NextResponse.json({ success: false, message: "Failed to count applications" }, { status: 500 })
    }

    // Now get the actual data with filtering, sorting, and pagination
    let query = supabase.from("creator_applications").select("*")

    if (status) {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,tiktok_handle.ilike.%${search}%,content_niche.ilike.%${search}%`,
      )
    }

    // Apply sorting
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

    // Add pagination
    query = query.range(offset, offset + pageSize - 1)

    const { data, error } = await query

    if (error) {
      console.error("Error fetching applications:", error)
      return NextResponse.json({ success: false, message: "Failed to fetch applications" }, { status: 500 })
    }

    // Calculate total pages
    const totalPages = Math.ceil((count || 0) / pageSize)

    // Map the data to the expected format
    const applications = data.map((app) => ({
      id: app.id,
      userId: app.user_id,
      fullName: app.full_name,
      email: app.email,
      phoneNumber: app.phone_number,
      tiktokHandle: app.tiktok_handle,
      followerCount: app.follower_count,
      contentNiche: app.content_niche,
      reason: app.reason,
      portfolioLink: app.portfolio_link,
      status: app.status,
      reviewNotes: app.review_notes,
      createdAt: app.created_at,
      updatedAt: app.updated_at,
    }))

    return NextResponse.json({
      success: true,
      applications,
      totalPages,
      currentPage: page,
    })
  } catch (error) {
    console.error("Error in applications API:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
