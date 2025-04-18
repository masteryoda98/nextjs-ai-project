import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if PayPal configuration is available
    const paypalConfig = {
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      publicClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    }

    // Return configuration status without actually connecting to PayPal
    return NextResponse.json({
      status: "ok",
      message: "PayPal configuration check",
      config: {
        clientId: paypalConfig.clientId ? "configured" : "missing",
        clientSecret: paypalConfig.clientSecret ? "configured" : "missing",
        publicClientId: paypalConfig.publicClientId ? "configured" : "missing",
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
