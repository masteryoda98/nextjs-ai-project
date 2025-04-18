import { NextResponse } from "next/server"
import { updateSubmissionStatus } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { createServerClient } from "@/lib/supabase/server"
import { isAdmin, isArtist } from "@/lib/auth-utils"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin or artist
    const isAuthorized = (await isAdmin()) || (await isArtist())

    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    const submissionId = Number.parseInt(params.id)
    const data = await request.json()

    // If user is artist, verify they own the campaign this submission is for
    if (!(await isAdmin())) {
      const supabase = createServerClient()
      const { data: submission } = await supabase
        .from("submissions")
        .select("campaign_id")
        .eq("id", submissionId)
        .single()

      if (!submission) {
        return NextResponse.json({ success: false, message: "Submission not found" }, { status: 404 })
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("artist_id")
        .eq("id", submission.campaign_id)
        .single()

      if (!campaign || campaign.artist_id !== session?.user.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
      }
    }

    const result = await updateSubmissionStatus({
      submissionId,
      status: data.status,
      revisionNotes: data.revisionNotes,
      reviewerId: data.reviewerId,
      feedback: data.feedback,
      rating: data.rating ? Number.parseInt(data.rating) : undefined,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 404 })
    }

    // Get submission details for email
    const supabase = createServerClient()
    const { data: submission, error: submissionError } = await supabase
      .from("submissions")
      .select(`
       id,
       content_url,
       caption,
       status,
       revision_notes,
       campaign_id,
       creator_id,
       campaigns!inner(id, name),
       creatoramp_users!inner(id, name, email)
     `)
      .eq("id", submissionId)
      .single()

    if (!submissionError && submission) {
      // Get payment amount if approved
      let paymentAmount = 0
      if (data.status === "APPROVED" || data.status === "PUBLISHED") {
        const { data: paymentData, error: paymentError } = await supabase
          .from("payments")
          .select("amount")
          .eq("submission_id", submissionId)
          .single()

        if (!paymentError && paymentData) {
          paymentAmount = paymentData.amount
        }
      }

      // Send email notification based on status
      const emailData = {
        name: submission.creatoramp_users.name,
        campaignName: submission.campaigns.name,
        feedback: data.feedback || data.revisionNotes || "No specific feedback provided.",
        amount: paymentAmount,
      }

      let emailTemplate: any
      switch (data.status) {
        case "APPROVED":
          emailTemplate = "submission-approved"
          break
        case "NEEDS_REVISION":
          emailTemplate = "submission-needs-revision"
          break
        case "REJECTED":
          emailTemplate = "submission-rejected"
          break
        default:
          emailTemplate = null
      }

      if (emailTemplate) {
        await sendEmail(emailTemplate, submission.creatoramp_users.email, emailData)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Submission ${data.status.toLowerCase()}`,
      submissionId: result.submissionId,
    })
  } catch (error) {
    console.error("Error reviewing submission:", error)
    return NextResponse.json({ success: false, message: "Failed to review submission" }, { status: 500 })
  }
}
