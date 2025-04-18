import { getEnv } from "@/lib/env"

let accessToken: string | null = null
let tokenExpires = 0

export async function getAccessToken(): Promise<string> {
  const now = Date.now()

  if (accessToken && now < tokenExpires) {
    return accessToken
  }

  const clientId = getEnv("SPOTIFY_CLIENT_ID")
  const clientSecret = getEnv("SPOTIFY_CLIENT_SECRET")

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify API credentials")
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to get Spotify access token: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    accessToken = data.access_token
    tokenExpires = now + data.expires_in * 1000

    return data.access_token
  } catch (error) {
    console.error("Error getting Spotify token:", error)
    throw error
  }
}
