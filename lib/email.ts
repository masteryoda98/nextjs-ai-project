import nodemailer from "nodemailer"
import { getEnv } from "@/lib/env"

// Email templates
const templates = {
  "application-approved": {
    subject: "Your CreatorAmp Application Has Been Approved",
    generateBody: (data: any) => `
      <h1>Congratulations, ${data.name}!</h1>
      <p>Your application to join CreatorAmp as a creator has been approved.</p>
      <p>You can now log in to your account and start applying for campaigns.</p>
      ${data.feedback ? `<p><strong>Feedback from our team:</strong> ${data.feedback}</p>` : ""}
      <p>Thank you for joining our platform!</p>
    `,
  },
  "application-rejected": {
    subject: "Update on Your CreatorAmp Application",
    generateBody: (data: any) => `
      <h1>Hello, ${data.name}</h1>
      <p>Thank you for your interest in joining CreatorAmp as a creator.</p>
      <p>After careful review, we regret to inform you that we are unable to approve your application at this time.</p>
      ${data.feedback ? `<p><strong>Feedback from our team:</strong> ${data.feedback}</p>` : ""}
      <p>You are welcome to apply again in the future.</p>
    `,
  },
  "submission-approved": {
    subject: "Your CreatorAmp Submission Has Been Approved",
    generateBody: (data: any) => `
      <h1>Great news, ${data.name}!</h1>
      <p>Your submission for the campaign "${data.campaignName}" has been approved.</p>
      ${data.amount ? `<p>You will receive a payment of $${data.amount.toFixed(2)} for this submission.</p>` : ""}
      ${data.feedback ? `<p><strong>Feedback:</strong> ${data.feedback}</p>` : ""}
      <p>Thank you for your great work!</p>
    `,
  },
  "submission-needs-revision": {
    subject: "Revision Requested for Your CreatorAmp Submission",
    generateBody: (data: any) => `
      <h1>Hello, ${data.name}</h1>
      <p>Your submission for the campaign "${data.campaignName}" requires some revisions before it can be approved.</p>
      ${data.feedback ? `<p><strong>Revision notes:</strong> ${data.feedback}</p>` : ""}
      <p>Please log in to your account to make the requested changes.</p>
    `,
  },
  "submission-rejected": {
    subject: "Update on Your CreatorAmp Submission",
    generateBody: (data: any) => `
      <h1>Hello, ${data.name}</h1>
      <p>We've reviewed your submission for the campaign "${data.campaignName}".</p>
      <p>Unfortunately, we are unable to approve this submission.</p>
      ${data.feedback ? `<p><strong>Feedback:</strong> ${data.feedback}</p>` : ""}
      <p>You are welcome to apply for other campaigns on our platform.</p>
    `,
  },
}

/**
 * Send an email using a template
 * @param templateName - Name of the template to use
 * @param to - Recipient email address
 * @param data - Data to populate the template
 * @returns Result of the email sending operation
 */
export async function sendEmail(
  templateName: keyof typeof templates,
  to: string,
  data: any,
): Promise<{ success: boolean; error?: string }> {
  try {
    const template = templates[templateName]

    if (!template) {
      throw new Error(`Email template "${templateName}" not found`)
    }

    // Get email configuration from environment variables
    const host = getEnv("EMAIL_SERVER_HOST")
    const port = Number.parseInt(getEnv("EMAIL_SERVER_PORT"))
    const user = getEnv("EMAIL_SERVER_USER")
    const pass = getEnv("EMAIL_SERVER_PASSWORD")
    const from = getEnv("EMAIL_FROM")

    // Create transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    })

    // Generate email content
    const subject = template.subject
    const html = template.generateBody(data)

    // Send email
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
