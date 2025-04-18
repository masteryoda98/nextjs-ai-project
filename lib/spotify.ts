import { getEnv } from "@/lib/env"

// Spotify API endpoints
const SPOTIFY_API_TOKEN_URL = "https://accounts.spotify.com/api/token"
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1"

// Types for our Spotify data
export interface SpotifyArtist {
  id: string
  name: string
  images: { url: string; height: number; width: number }[]
  popularity: number
  genres: string[]
  external_urls: { spotify: string }
}

export interface SpotifyTrack {
  id: string
  name: string
  album: {
    id: string
    name: string
    images: { url: string; height: number; width: number }[]
  }
  artists: {
    id: string
    name: string
    external_urls: { spotify: string }
  }[]
  external_urls: { spotify: string }
  preview_url: string | null
}

export interface SpotifyAlbum {
  id: string
  name: string
  images: { url: string; height: number; width: number }[]
  artists: {
    id: string
    name: string
    external_urls: { spotify: string }
  }[]
  release_date: string
  total_tracks: number
  external_urls: { spotify: string }
}

// Normalized response types
export interface NormalizedArtistResponse {
  type: "artist"
  id: string
  name: string
  image: string
  topTracks: { name: string; preview_url: string | null }[]
}

export interface NormalizedAlbumResponse {
  type: "album"
  id: string
  name: string
  image: string
  tracks: { name: string; preview_url: string | null }[]
}

export interface NormalizedTrackResponse {
  type: "track"
  id: string
  name: string
  image: string
  preview_url: string | null
}

export type NormalizedSpotifyResponse = NormalizedArtistResponse | NormalizedAlbumResponse | NormalizedTrackResponse

// Get Spotify API access token using client credentials flow with caching
async function getAccessToken(): Promise<string> {
  const clientId = getEnv("SPOTIFY_CLIENT_ID")
  const clientSecret = getEnv("SPOTIFY_CLIENT_SECRET")

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify API credentials")
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to get Spotify access token: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error getting Spotify token:", error)
    throw error
  }
}

// Parse Spotify URL and extract type and ID - IMPROVED VERSION
export async function parseSpotifyUrl(spotifyUrl: string): Promise<{ type: "artist" | "album" | "track"; id: string }> {
  try {
    // Improved regex pattern to handle both spotify.com and spotify.link domains
    const idMatch = spotifyUrl.match(/spotify\.(com|link)\/(artist|album|track)\/([a-zA-Z0-9]+)/)

    if (!idMatch || idMatch.length < 4) {
      throw new Error("Invalid Spotify URL format")
    }

    const [, , type, id] = idMatch

    if (!["artist", "album", "track"].includes(type)) {
      throw new Error("Unsupported Spotify URL type")
    }

    return { type: type as "artist" | "album" | "track", id }
  } catch (error) {
    console.error("Error parsing Spotify URL:", error)
    throw new Error("Invalid Spotify URL")
  }
}

// Fetch normalized data from Spotify by URL
export async function getNormalizedSpotifyData(spotifyUrl: string): Promise<NormalizedSpotifyResponse> {
  try {
    const { type, id } = await parseSpotifyUrl(spotifyUrl)
    const accessToken = await getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }

    if (type === "artist") {
      // Fetch artist data and top tracks
      const [artistRes, topTracksRes] = await Promise.all([
        fetch(`${SPOTIFY_API_BASE_URL}/artists/${id}`, { headers }),
        fetch(`${SPOTIFY_API_BASE_URL}/artists/${id}/top-tracks?market=US`, { headers }),
      ])

      if (!artistRes.ok || !topTracksRes.ok) {
        throw new Error(`Failed to fetch artist data: ${artistRes.status} or top tracks: ${topTracksRes.status}`)
      }

      const artistData = await artistRes.json()
      const topTracksData = await topTracksRes.json()

      return {
        type: "artist",
        id,
        name: artistData.name,
        image: artistData.images?.[0]?.url || "",
        topTracks: topTracksData.tracks.map((t: any) => ({
          name: t.name,
          preview_url: t.preview_url,
        })),
      }
    } else if (type === "album") {
      // Fetch album data
      const albumRes = await fetch(`${SPOTIFY_API_BASE_URL}/albums/${id}`, { headers })

      if (!albumRes.ok) {
        throw new Error(`Failed to fetch album data: ${albumRes.status}`)
      }

      const albumData = await albumRes.json()

      return {
        type: "album",
        id,
        name: albumData.name,
        image: albumData.images?.[0]?.url || "",
        tracks: albumData.tracks.items.map((t: any) => ({
          name: t.name,
          preview_url: t.preview_url,
        })),
      }
    } else if (type === "track") {
      // Fetch track data
      const trackRes = await fetch(`${SPOTIFY_API_BASE_URL}/tracks/${id}`, { headers })

      if (!trackRes.ok) {
        throw new Error(`Failed to fetch track data: ${trackRes.status}`)
      }

      const trackData = await trackRes.json()

      return {
        type: "track",
        id,
        name: trackData.name,
        image: trackData.album?.images?.[0]?.url || "",
        preview_url: trackData.preview_url,
      }
    }

    throw new Error("Unsupported Spotify URL type")
  } catch (error) {
    console.error("Error fetching Spotify data:", error)
    throw error
  }
}

// Fetch top artists from Spotify with caching
export async function getTopArtists(limit = 10): Promise<SpotifyArtist[]> {
  try {
    const accessToken = await getAccessToken()

    // Fetch a list of popular artists
    // Note: Spotify doesn't have a "top artists" endpoint without user auth,
    // so we'll search for popular artists in a specific genre
    const response = await fetch(`${SPOTIFY_API_BASE_URL}/search?q=genre:pop&type=artist&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to fetch artists from Spotify: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.artists.items
  } catch (error) {
    console.error("Error fetching Spotify artists:", error)
    return [] // Return empty array on error
  }
}

// Fetch artists by IDs with caching
export async function getArtistsByIds(artistIds: string[]): Promise<SpotifyArtist[]> {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(`${SPOTIFY_API_BASE_URL}/artists?ids=${artistIds.join(",")}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to fetch artists from Spotify: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.artists
  } catch (error) {
    console.error("Error fetching Spotify artists by IDs:", error)
    return [] // Return empty array on error
  }
}

// Fetch featured playlists and their artists with caching
export async function getFeaturedArtists(limit = 20): Promise<SpotifyArtist[]> {
  try {
    // For a more random selection, we'll use a mix of different genres
    const genres = ["pop", "hip-hop", "rock", "indie", "electronic", "r-n-b"]
    const randomGenre = genres[Math.floor(Math.random() * genres.length)]

    const accessToken = await getAccessToken()

    // Search for artists in the random genre
    const response = await fetch(`${SPOTIFY_API_BASE_URL}/search?q=genre:${randomGenre}&type=artist&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to fetch artists from Spotify: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.artists.items
  } catch (error) {
    console.error("Error fetching featured artists:", error)

    // Fallback to the curated list if the API call fails
    const popularArtistIds = [
      "06HL4z0CvFAxyc27GXpf02", // Taylor Swift
      "1Xyo4u8uXC1ZmMpatF05PJ", // The Weeknd
      "246dkjvS1zLTtiykXe5h60", // Post Malone
      "6eUKZXaKkcviH0Ku9w2n3V", // Ed Sheeran
      "66CXWjxzNUsdJxJ2JdwvnR", // Ariana Grande
      "4q3ewBCX7sLwd24euuV69X", // Bad Bunny
      "1uNFoZAHBGtllmzznpCI3s", // Justin Bieber
      "4YLtscXsxbVgi031ovDDdh", // Drake
      "0Y5tJX1MQlPlqiwlOH1tJY", // Travis Scott
      "5pKCCKE2ajJHZ9KAiaK11H", // Rihanna
      "7dGJo4pcD2V6oG8kP0tJRR", // Eminem
      "2YZyLoL8N0Wb9xBt1NhZWg", // Kendrick Lamar
      "0du5cEVh5yTK9QJze8zA0C", // Bruno Mars
      "3TVXtAsR1Inumwj472S9r4", // Drake
      "26VFTg2z8YR0cCuwLzESi2", // Halsey
      "6l3HvQ5sa6mXTsMTB19rO5", // J. Cole
      "6KImCVD70vtIoJWnq6nGn3", // Harry Styles
      "4MCBfE4596Uoi2O4DtmEMz", // Juice WRLD
      "5K4W6rqBFWDnAN6FQUkS6x", // Kanye West
      "6vWDO969PvNqNYHIOW5v0m", // Beyoncé
    ]

    return await getArtistsByIds(popularArtistIds.slice(0, limit))
  }
}
