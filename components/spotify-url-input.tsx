"use client"

import { useState } from "react"
import { Music, Search, ExternalLink, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SpotifyData {
  type: "artist" | "album" | "track"
  id: string
  name: string
  image: string
  artist?: string
  album?: string
  preview_url?: string
  followers?: number
  genres?: string[]
  topTracks?: Array<{
    id: string
    name: string
    preview_url: string | null
    image: string
  }>
  tracks?: Array<{
    id: string
    name: string
    preview_url: string | null
  }>
}

interface SpotifyUrlInputProps {
  onDataFetched: (data: SpotifyData | null) => void
}

export function SpotifyUrlInput({ onDataFetched }: SpotifyUrlInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SpotifyData | null>(null)
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const fetchSpotifyData = async () => {
    if (!url) {
      setError("Please enter a Spotify URL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/spotify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch Spotify data")
      }

      setData(result)
      onDataFetched(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      onDataFetched(null)
    } finally {
      setIsLoading(false)
    }
  }

  const playPreview = (previewUrl: string | null, trackId: string) => {
    if (!previewUrl) return

    if (audio) {
      audio.pause()
      audio.src = ""
    }

    if (playingTrackId === trackId) {
      setPlayingTrackId(null)
      return
    }

    const newAudio = new Audio(previewUrl)
    newAudio.play()
    newAudio.onended = () => setPlayingTrackId(null)
    setAudio(newAudio)
    setPlayingTrackId(trackId)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Music className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Paste Spotify URL (artist, album, or track)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={fetchSpotifyData} disabled={isLoading}>
          {isLoading ? "Loading..." : <Search className="h-4 w-4 mr-2" />}
          {isLoading ? "" : "Search"}
        </Button>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      {isLoading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {data && !isLoading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {data.image ? (
                <img
                  src={data.image || "/placeholder.svg"}
                  alt={data.name}
                  className="h-16 w-16 object-cover rounded-md"
                />
              ) : (
                <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                  <Music className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{data.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {data.type === "artist"
                    ? `Artist • ${data.followers?.toLocaleString() || "0"} followers`
                    : data.type === "album"
                      ? `Album • ${data.artist}`
                      : `Track • ${data.artist}`}
                </p>
                {data.genres && data.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.genres.slice(0, 3).map((genre) => (
                      <span key={genre} className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <a
                href={`https://open.spotify.com/${data.type}/${data.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {data.topTracks && data.topTracks.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Top Tracks</h4>
                <div className="space-y-2">
                  {data.topTracks.map((track) => (
                    <div key={track.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                      {track.preview_url ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => playPreview(track.preview_url, track.id)}
                        >
                          {playingTrackId === track.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center text-muted-foreground">
                          <Music className="h-4 w-4" />
                        </div>
                      )}
                      <span className="text-sm">{track.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.tracks && data.tracks.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Tracks</h4>
                <div className="space-y-2">
                  {data.tracks.map((track) => (
                    <div key={track.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                      {track.preview_url ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => playPreview(track.preview_url, track.id)}
                        >
                          {playingTrackId === track.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center text-muted-foreground">
                          <Music className="h-4 w-4" />
                        </div>
                      )}
                      <span className="text-sm">{track.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
