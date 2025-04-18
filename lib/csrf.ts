import { createHash, randomBytes } from "crypto"
import { cookies } from "next/headers"

// Generate a CSRF token
export function generateCsrfToken(): string {
  const token = randomBytes(32).toString("hex")
  const cookieStore = cookies()

  // Store the token in a cookie
  cookieStore.set("csrf_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  })

  // Return a hashed version to be sent to the client
  return createHash("sha256").update(token).digest("hex")
}

// Verify a CSRF token
export function verifyCsrfToken(clientToken: string): boolean {
  const cookieStore = cookies()
  const storedToken = cookieStore.get("csrf_token")?.value

  if (!storedToken) {
    return false
  }

  const expectedToken = createHash("sha256").update(storedToken).digest("hex")
  return clientToken === expectedToken
}
