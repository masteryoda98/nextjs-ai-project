import { createSubmission, getSubmissions } from "@/lib/db"
import { verifyCsrfToken } from "@/lib/csrf"
import { apiHandler, createErrorResponse } from "@/lib/api-utils"
import { isAuthenticated } from "@/lib/auth-utils"

export async function POST(request: Request) {
  // Check authentication
  if (!(await isAuthenticated())) {
    return createErrorResponse("Unauthorized", 401)
  }

  // Verify CSRF token
  const csrfToken = request.headers.get("X-CSRF-Token")
  if (!csrfToken || !verifyCsrfToken(csrfToken)) {
    return createErrorResponse("Invalid CSRF token", 403)
  }

  return apiHandler(async () => {
    const data = await request.json()

    // Create the submission
    const result = await createSubmission({
      campaignId: Number.parseInt(data.campaignId),
      creatorId: data.creatorId,
      campaignCreatorId: Number.parseInt(data.campaignCreatorId),
      contentUrl: data.contentUrl,
      caption: data.caption,
    })

    if (!result.success) {
      throw new Error(result.error)
    }

    // Notify the artist and admin team about the new submission
    // await notifyArtistAndAdmins(submission)

    return {
      message: "Submission received successfully",
      submissionId: result.id,
    }
  }, "Failed to process submission")
}

export async function GET(request: Request) {
  // Check authentication
  if (!(await isAuthenticated())) {
    return createErrorResponse("Unauthorized", 401)
  }

  return apiHandler(async () => {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")
    const creatorId = searchParams.get("creatorId")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")

    const filters: any = {}

    if (campaignId) {
      filters.campaignId = Number.parseInt(campaignId)
    }

    if (creatorId) {
      filters.creatorId = creatorId
    }

    if (status) {
      filters.status = status
    }

    // Add pagination parameters
    filters.page = page
    filters.pageSize = pageSize

    const result = await getSubmissions(filters)

    if (!result.success) {
      throw new Error("Failed to fetch submissions")
    }

    return {
      submissions: result.submissions,
      totalPages: result.totalPages,
      currentPage: page,
    }
  }, "Failed to fetch submissions")
}
