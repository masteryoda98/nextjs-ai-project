import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { getFeaturedArtists, type SpotifyArtist } from "@/lib/spotify"
import { Check, ArrowRightCircle } from "lucide-react"

async function HomePage() {
  const artists: SpotifyArtist[] = await getFeaturedArtists()

  // Mock data for the artist spotlight section
  const artistImageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/305188041_169083225668417_3518560904082342604_n.jpg-Fq3Zk41O34PUZhS8d4Ur3xKZCpZVwO.jpeg"
  const artistName = "Heritiér"
  const trackName = "Midheaven"
  const trackSpotifyUrl = "https://open.spotify.com/track/4hk4bdv4i69s06hqj8j68G"

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Creator Login</Button>
            </Link>
            <Link href="/apply">
              <Button>Join as Creator</Button>
            </Link>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#71eb98] to-[#7c4dff] py-20 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Music Marketing Agency for TikTok
            </h1>
            <p className="max-w-[700px] text-lg">
              We connect music artists with TikTok creators to promote their tracks and reach new audiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/contact">
                <Button size="lg" className="bg-green-500 hover:bg-green-600">
                  Work With Us
                </Button>
              </Link>
              <Link href="/apply">
                <Button size="lg" variant="outline">
                  I'm a Creator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Carousel Section */}
      <section className="bg-black py-12 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex overflow-hidden">
            <div className="flex gap-4 auto-scroll-x">
              {artists.map((artist) => (
                <div key={artist.id} className="w-48 h-48 flex-shrink-0 rounded-md overflow-hidden">
                  <img
                    src={artist.images[0]?.url || "/placeholder.svg?height=192&width=192"}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {/* Duplicate artists for seamless looping */}
              {artists.map((artist) => (
                <div key={`${artist.id}-dup`} className="w-48 h-48 flex-shrink-0 rounded-md overflow-hidden">
                  <img
                    src={artist.images[0]?.url || "/placeholder.svg?height=192&width=192"}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Artist Spotlight Section */}
      <section className="bg-black text-white py-12 px-6">
        <div className="container max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Latest Track Promotion</h2>
          <p className="text-lg mb-8 text-muted-foreground">Discover the latest track we've promoted</p>

          <div className="md:flex items-center justify-center gap-8 rounded-2xl p-6 shadow-lg bg-zinc-900">
            <img
              src={artistImageUrl || "/placeholder.svg"}
              alt={artistName}
              className="w-48 h-48 rounded-xl object-cover"
            />
            <div className="relative">
              <ArrowRightCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-green-500" />
            </div>
            <div className="text-left space-y-3">
              <h3 className="text-2xl font-semibold">{artistName}</h3>
              <p className="text-md text-zinc-400">
                Track: <strong>{trackName}</strong>
              </p>
              <a
                href={trackSpotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 text-black font-medium px-5 py-2 rounded-xl hover:bg-green-400 transition"
              >
                Listen on Spotify
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Creator Benefits Section */}
      <section className="bg-black py-16 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Creator Benefits</h2>
            <p className="max-w-[700px] text-muted-foreground">Why TikTok creators love working with CreatorAmp</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-4 border rounded-lg border-border">
              <div className="bg-green-500/20 p-3 rounded-full mb-4">
                <Check className="text-green-500 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Campaigns</h3>
              <p className="text-muted-foreground">All campaigns are pre-vetted and funded by legitimate artists</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 border rounded-lg border-border">
              <div className="bg-green-500/20 p-3 rounded-full mb-4">
                <Check className="text-green-500 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fixed Rates</h3>
              <p className="text-muted-foreground">Know exactly how much you'll earn before accepting a campaign</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 border rounded-lg border-border">
              <div className="bg-green-500/20 p-3 rounded-full mb-4">
                <Check className="text-green-500 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Payments</h3>
              <p className="text-muted-foreground">Get paid within 48 hours of content approval</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 border rounded-lg border-border">
              <div className="bg-green-500/20 p-3 rounded-full mb-4">
                <Check className="text-green-500 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Creative Freedom</h3>
              <p className="text-muted-foreground">Express yourself while promoting great music</p>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/apply">
              <Button className="bg-green-500 hover:bg-green-600 text-black">Join as a Creator</Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="container flex flex-col md:flex-row items-center justify-between py-8 md:py-12">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Logo />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </Link>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">© 2025 CreatorAmp. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
