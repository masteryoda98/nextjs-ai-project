"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Music, AlertCircle } from "lucide-react"
import Image from "next/image"
import type { NormalizedSpotifyResponse } from "@/lib/spotify"

interface SpotifyUrlPreviewProps {
  onDataFetched?: (data: NormalizedSpotifyResponse) => void
}

export function SpotifyUrlPreview({ onDataFetched }: SpotifyUrlPreviewProps) {
  const [url, setUrl] = useState("")
  const [data, setData] = useState<NormalizedSpotifyResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const fetchSpotifyData = async () => {
    if (!url) return

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch("/api/spotify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyUrl: url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch Spotify data")
      }

      const spotifyData = await response.json()
      setData(spotifyData)

      if (onDataFetched) {
        onDataFetched(spotifyData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const playPreview = (previewUrl: string | null) => {
    if (!previewUrl) return

    if (audio) {
      audio.pause()
    }

    if (audioPlaying === previewUrl) {
      setAudioPlaying(null)
      return
    }

    const newAudio = new Audio(previewUrl)
    newAudio.play()
    newAudio.onended = () => {
      setAudioPlaying(null)
    }

    setAudio(newAudio)
    setAudioPlaying(previewUrl)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Paste Spotify URL (artist, album, or track)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button onClick={fetchSpotifyData} disabled={loading || !url}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Music className="h-4 w-4 mr-2" />}
          {loading ? "Loading..." : "Preview"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 p-3 rounded-md flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="capitalize">{data.type}</span>: {data.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {data.image && (
                <div className="flex-shrink-0">
                  <Image
                    src={data.image || "/placeholder.svg"}
                    alt={data.name}
                    width={150}
                    height={150}
                    className="rounded-md object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                {data.type === "artist" && data.topTracks && (
                  <div>
                    <h3 className="font-medium mb-2">Top Tracks:</h3>
                    <ul className="space-y-2">
                      {data.topTracks.map((track, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span>{track.name}</span>
                          {track.preview_url && (
                            <Button variant="outline" size="sm" onClick={() => playPreview(track.preview_url)}>
                              {audioPlaying === track.preview_url ? "Pause" : "Play"}
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.type === "album" && data.tracks && (
                  <div>
                    <h3 className="font-medium mb-2">Tracks:</h3>
                    <ul className="space-y-2">
                      {data.tracks.map((track, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span>{track.name}</span>
                          {track.preview_url && (
                            <Button variant="outline" size="sm" onClick={() => playPreview(track.preview_url)}>
                              {audioPlaying === track.preview_url ? "Pause" : "Play"}
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.type === "track" && (
                  <div className="flex items-center justify-between">
                    <span>Preview:</span>
                    {data.preview_url ? (
                      <Button variant="outline" onClick={() => playPreview(data.preview_url)}>
                        {audioPlaying === data.preview_url ? "Pause" : "Play"}
                      </Button>
                    ) : (
                      <span className="text-gray-500">No preview available</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
