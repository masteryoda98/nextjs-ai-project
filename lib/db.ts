import { unstable_noStore as noStore } from "next/cache"
import { createServerSupabaseClient, supabase } from "./supabase"

export async function createCreatorApplication(application: {
  userId?: string
  fullName: string
  email: string
  phoneNumber: string
  tiktokHandle: string
  followerCount: number
  contentNiche: string
  reason: string
  portfolioLink?: string
}) {
  noStore()
  try {
    const { data, error } = await supabase
      .from("creator_applications")
      .insert({
        user_id: application.userId || null,
        full_name: application.fullName,
        email: application.email,
        phone_number: application.phoneNumber,
        tiktok_handle: application.tiktokHandle,
        follower_count: application.followerCount,
        content_niche: application.contentNiche,
        reason: application.reason,
        portfolio_link: application.portfolioLink || null,
        status: "PENDING",
      })
      .select("id")
      .single()

    if (error) throw error

    return { success: true, id: data.id }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error }
  }
}

export async function createSubmission(submission: {
  campaignId: number
  creatorId: string
  campaignCreatorId: number
  contentUrl: string
  caption?: string
}) {
  noStore()
  try {
    // First check if the creator is approved for this campaign
    const { data: creatorData, error: creatorError } = await supabase
      .from("campaign_creators")
      .select("*")
      .eq("campaign_id", submission.campaignId)
      .eq("creator_id", submission.creatorId)
      .eq("status", "APPROVED")
      .single()

    if (creatorError || !creatorData) {
      return {
        success: false,
        error: "Creator is not approved for this campaign",
      }
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        campaign_id: submission.campaignId,
        creator_id: submission.creatorId,
        campaign_creator_id: submission.campaignCreatorId,
        content_url: submission.contentUrl,
        caption: submission.caption || null,
        status: "PENDING_REVIEW",
      })
      .select("id")
      .single()

    if (error) throw error

    return { success: true, id: data.id }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error }
  }
}

// Update the getSubmissions function to support pagination

export async function getSubmissions(filters?: {
  campaignId?: number
  creatorId?: string
  status?: string
  page?: number
  pageSize?: number
}) {
  noStore()
  try {
    // Set default pagination values
    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 10
    const offset = (page - 1) * pageSize

    // First, get the total count for pagination
    let countQuery = supabase.from("submissions").select("id", { count: "exact" })

    if (filters?.campaignId) {
      countQuery = countQuery.eq("campaign_id", filters.campaignId)
    }

    if (filters?.creatorId) {
      countQuery = countQuery.eq("creator_id", filters.creatorId)
    }

    if (filters?.status) {
      countQuery = countQuery.eq("status", filters.status)
    }

    const { count, error: countError } = await countQuery

    if (countError) throw countError

    // Now get the actual data with pagination
    let query = supabase.from("submissions").select(`
      id,
      content_url,
      caption,
      status,
      submitted_at,
      reviewed_at,
      published_at,
      campaign_id,
      creator_id,
      campaigns!inner(id, name, content_type),
      creatoramp_users!inner(id, name, tiktok_handle)
    `)

    if (filters?.campaignId) {
      query = query.eq("campaign_id", filters.campaignId)
    }

    if (filters?.creatorId) {
      query = query.eq("creator_id", filters.creatorId)
    }

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    // Add pagination
    query = query.order("submitted_at", { ascending: false }).range(offset, offset + pageSize - 1)

    const { data, error } = await query

    if (error) throw error

    // Calculate total pages
    const totalPages = Math.ceil((count || 0) / pageSize)

    return {
      success: true,
      submissions: data.map((row) => ({
        id: row.id,
        contentUrl: row.content_url,
        caption: row.caption,
        status: row.status,
        submittedAt: row.submitted_at,
        reviewedAt: row.reviewed_at,
        publishedAt: row.published_at,
        campaign: {
          id: row.campaigns.id,
          name: row.campaigns.name,
          contentType: row.campaigns.content_type,
        },
        creator: {
          id: row.creatoramp_users.id,
          name: row.creatoramp_users.name,
          tiktokHandle: row.creatoramp_users.tiktok_handle,
        },
      })),
      totalPages,
      currentPage: page,
    }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error }
  }
}

export async function updateSubmissionStatus(params: {
  submissionId: number
  status: string
  revisionNotes?: string
  reviewerId: string
  feedback?: string
  rating?: number
}) {
  noStore()
  try {
    // Start a transaction using the server client for admin operations
    const serverClient = createServerSupabaseClient()

    // Update the submission
    const { data: submissionData, error: submissionError } = await serverClient
      .from("submissions")
      .update({
        status: params.status,
        revision_notes: params.revisionNotes || null,
        reviewed_at: new Date().toISOString(),
        published_at: params.status === "PUBLISHED" ? new Date().toISOString() : null,
      })
      .eq("id", params.submissionId)
      .select("id, campaign_id, creator_id")
      .single()

    if (submissionError) throw submissionError

    // If approved or published, create a payment record
    if (params.status === "APPROVED" || params.status === "PUBLISHED") {
      // Get the payment rate from campaign_creators
      const { data: rateData, error: rateError } = await serverClient
        .from("campaign_creators")
        .select("payment_rate")
        .eq("campaign_id", submissionData.campaign_id)
        .eq("creator_id", submissionData.creator_id)
        .single()

      if (!rateError && rateData) {
        // Create payment record
        await serverClient.from("payments").insert({
          submission_id: submissionData.id,
          user_id: submissionData.creator_id,
          amount: rateData.payment_rate,
          status: "PENDING",
          description: "Payment for approved submission",
        })
      }
    }

    // Add feedback if provided
    if (params.feedback) {
      await serverClient.from("feedback").insert({
        submission_id: submissionData.id,
        sender_id: params.reviewerId,
        receiver_id: submissionData.creator_id,
        content: params.feedback,
        rating: params.rating || null,
      })
    }

    return { success: true, submissionId: submissionData.id }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error }
  }
}
