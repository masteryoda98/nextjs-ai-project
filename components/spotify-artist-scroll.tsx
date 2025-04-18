"use client"

import { useRef } from "react"
import { Loader2 } from "lucide-react"
import type { SpotifyArtist } from "@/lib/spotify"

// Fallback data in case the API fails
const fallbackArtists = [
  { name: "Drake", image: "/placeholder.svg?height=300&width=300&text=Drake" },
  { name: "Doja Cat", image: "/placeholder.svg?height=300&width=300&text=Doja Cat" },
  { name: "The Weeknd", image: "/placeholder.svg?height=300&width=300&text=The Weeknd" },
  { name: "Billie Eilish", image: "/placeholder.svg?height=300&width=300&text=Billie Eilish" },
  { name: "Bad Bunny", image: "/placeholder.svg?height=300&width=300&text=Bad Bunny" },
  { name: "Taylor Swift", image: "/placeholder.svg?height=300&width=300&text=Taylor Swift" },
  { name: "Kendrick Lamar", image: "/placeholder.svg?height=300&width=300&text=Kendrick Lamar" },
  { name: "Ariana Grande", image: "/placeholder.svg?height=300&width=300&text=Ariana Grande" },
  { name: "Post Malone", image: "/placeholder.svg?height=300&width=300&text=Post Malone" },
  { name: "SZA", image: "/placeholder.svg?height=300&width=300&text=SZA" },
]

interface SpotifyArtistScrollProps {
  artists?: SpotifyArtist[]
}

export function SpotifyArtistScroll({ artists }: SpotifyArtistScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // If no artists are provided, use fallback data
  const displayArtists =
    artists && artists.length > 0
      ? artists
      : fallbackArtists.map((artist) => ({
          id: artist.name,
          name: artist.name,
          images: [{ url: artist.image, height: 300, width: 300 }],
          popularity: 0,
          genres: [],
          external_urls: { spotify: "#" },
        }))

  // Duplicate the artists to create a seamless loop
  const duplicatedArtists = [...displayArtists, ...displayArtists]

  return (
    <div className="w-full bg-black relative overflow-hidden py-12">
      {!artists ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-spotify-green" />
        </div>
      ) : (
        <div className="relative">
          <div ref={scrollContainerRef} className="flex gap-6 auto-scroll-x">
            {duplicatedArtists.map((artist, index) => (
              <div key={`${artist.id}-${index}`} className="flex-shrink-0 w-[220px] h-auto">
                <div className="relative w-full aspect-square mb-2 overflow-hidden">
                  <img
                    src={artist.images[0]?.url || "/placeholder.svg?height=300&width=300"}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(29,185,84,0.5)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curved white line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
        <div className="w-full h-40 bg-white rounded-[100%_100%_0_0] transform translate-y-20"></div>
      </div>
    </div>
  )
}
