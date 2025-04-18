"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Music, Disc, User, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface SpotifyItem {
  id: string
  name: string
  images?: { url: string; height: number; width: number }[]
  album?: {
    images: { url: string; height: number; width: number }[]
  }
  artists?: {
    id: string
    name: string
  }[]
  external_urls: { spotify: string }
}

interface SpotifySearchProps {
  onSelect: (item: SpotifyItem, type: string) => void
}

export default function SpotifySearch({ onSelect }: SpotifySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("track")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<{
    tracks: SpotifyItem[]
    artists: SpotifyItem[]
    albums: SpotifyItem[]
  }>({
    tracks: [],
    artists: [],
    albums: [],
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/spotify/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`)
      const data = await response.json()

      setResults({
        tracks: data.tracks?.items || [],
        artists: data.artists?.items || [],
        albums: data.albums?.items || [],
      })
    } catch (error) {
      console.error("Error searching Spotify:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        handleSearch()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchType])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      <Tabs defaultValue="track" value={searchType} onValueChange={setSearchType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="track">
            <Music className="h-4 w-4 mr-2" />
            Tracks
          </TabsTrigger>
          <TabsTrigger value="artist">
            <User className="h-4 w-4 mr-2" />
            Artists
          </TabsTrigger>
          <TabsTrigger value="album">
            <Disc className="h-4 w-4 mr-2" />
            Albums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="track" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.tracks.map((track) => (
              <Card
                key={track.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onSelect(track, "track")}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-md">
                    <AvatarImage src={track.album?.images[0]?.url} alt={track.name} />
                    <AvatarFallback>{track.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <h3 className="font-medium truncate">{track.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artists?.map((a) => a.name).join(", ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {results.tracks.length === 0 && searchQuery && !isSearching && (
              <p className="text-muted-foreground col-span-2 text-center py-8">No tracks found</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="artist" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.artists.map((artist) => (
              <Card
                key={artist.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onSelect(artist, "artist")}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-md">
                    <AvatarImage src={artist.images?.[0]?.url} alt={artist.name} />
                    <AvatarFallback>{artist.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <h3 className="font-medium truncate">{artist.name}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
            {results.artists.length === 0 && searchQuery && !isSearching && (
              <p className="text-muted-foreground col-span-2 text-center py-8">No artists found</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="album" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.albums.map((album) => (
              <Card
                key={album.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onSelect(album, "album")}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-md">
                    <AvatarImage src={album.images?.[0]?.url} alt={album.name} />
                    <AvatarFallback>{album.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <h3 className="font-medium truncate">{album.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {album.artists?.map((a) => a.name).join(", ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {results.albums.length === 0 && searchQuery && !isSearching && (
              <p className="text-muted-foreground col-span-2 text-center py-8">No albums found</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
