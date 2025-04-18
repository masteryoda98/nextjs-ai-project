import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "Spotify URL is required" }, { status: 400 })
    }

    // Get Spotify credentials from environment variables
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Spotify credentials not configured" }, { status: 500 })
    }

    // Get access token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get Spotify access token", details: tokenData },
        { status: tokenResponse.status },
      )
    }

    const accessToken = tokenData.access_token

    // Parse Spotify URL to get type and ID
    const match = url.match(/(artist|album|track)\/([a-zA-Z0-9]+)/)

    if (!match) {
      return NextResponse.json({ error: "Invalid Spotify URL format" }, { status: 400 })
    }

    const [, type, id] = match

    // Fetch data from Spotify API
    const spotifyResponse = await fetch(`https://api.spotify.com/v1/${type}s/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!spotifyResponse.ok) {
      const error = await spotifyResponse.json()
      return NextResponse.json(
        { error: "Failed to fetch Spotify data", details: error },
        { status: spotifyResponse.status },
      )
    }

    const data = await spotifyResponse.json()

    // Fetch additional data based on type
    let additionalData = {}

    if (type === "artist") {
      // Fetch top tracks for artists
      const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (topTracksResponse.ok) {
        const topTracksData = await topTracksResponse.json()
        additionalData = {
          topTracks: topTracksData.tracks.slice(0, 5).map((track) => ({
            id: track.id,
            name: track.name,
            preview_url: track.preview_url,
            image: track.album.images[0]?.url || "",
          })),
        }
      }
    } else if (type === "album") {
      // Fetch tracks for albums
      const tracksResponse = await fetch(`https://api.spotify.com/v1/albums/${id}/tracks?limit=10`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (tracksResponse.ok) {
        const tracksData = await tracksResponse.json()
        additionalData = {
          tracks: tracksData.items.map((track) => ({
            id: track.id,
            name: track.name,
            preview_url: track.preview_url,
          })),
        }
      }
    }

    // Return normalized response
    return NextResponse.json({
      type,
      id,
      name: data.name,
      image: data.images?.[0]?.url || "",
      ...(type === "artist" && {
        followers: data.followers?.total,
        genres: data.genres,
      }),
      ...(type === "album" && {
        artist: data.artists?.[0]?.name,
        release_date: data.release_date,
      }),
      ...(type === "track" && {
        artist: data.artists?.[0]?.name,
        album: data.album?.name,
        preview_url: data.preview_url,
      }),
      ...additionalData,
    })
  } catch (error) {
    console.error("Spotify API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
