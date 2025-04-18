import { NextResponse } from "next/server"
import { reviewApplication } from "@/lib/admin-utils"
import { sendEmail } from "@/lib/email"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const applicationId = Number.parseInt(params.id)
    const data = await request.json()

    const result = await reviewApplication({
      applicationId,
      status: data.status,
      reviewNotes: data.reviewNotes,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 404 })
    }

    // Get application details for email
    const supabase = createServerClient()
    const { data: application, error: applicationError } = await supabase
      .from("creator_applications")
      .select("*")
      .eq("id", applicationId)
      .single()

    if (!applicationError && application) {
      // Send email notification based on status
      const emailData = {
        name: application.full_name,
        feedback: data.reviewNotes || "No specific feedback provided.",
      }

      const emailTemplate = data.status === "APPROVED" ? "application-approved" : "application-rejected"
      await sendEmail(emailTemplate, application.email, emailData)
    }

    return NextResponse.json({
      success: true,
      message: `Application ${data.status.toLowerCase()}`,
      applicationId,
    })
  } catch (error) {
    console.error("Error reviewing application:", error)
    return NextResponse.json({ success: false, message: "Failed to review application" }, { status: 500 })
  }
}
