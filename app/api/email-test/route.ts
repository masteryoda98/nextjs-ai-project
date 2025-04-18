import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if email configuration is available
    const emailConfig = {
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
      from: process.env.EMAIL_FROM,
    }

    // Return configuration status without actually sending an email
    return NextResponse.json({
      status: "ok",
      message: "Email configuration check",
      config: {
        host: emailConfig.host ? "configured" : "missing",
        port: emailConfig.port ? "configured" : "missing",
        user: emailConfig.user ? "configured" : "missing",
        pass: emailConfig.pass ? "configured" : "missing",
        from: emailConfig.from ? "configured" : "missing",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
