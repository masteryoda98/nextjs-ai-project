import { NextResponse } from "next/server"

export async function GET() {
  // Return a simple response without checking for Stripe configuration
  return NextResponse.json({
    status: "ok",
    message: "Using PayPal instead of Stripe",
    config: {
      status: "not required",
    },
  })
}
