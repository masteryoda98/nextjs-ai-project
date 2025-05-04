import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Logo } from "@/components/logo"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background sticky top-0 z-40 w-full border-b">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <Link href="/login" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
                Login
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Amplify Your TikTok Presence
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl">
                    Connect with creators and grow your audience. Join our platform to collaborate with top TikTok
                    talent.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/apply">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Apply as Creator
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    alt="Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform connects brands with TikTok creators for authentic collaborations
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">1</div>
                <h3 className="text-xl font-bold">Sign Up</h3>
                <p className="text-gray-500">Create an account and complete your profile</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">2</div>
                <h3 className="text-xl font-bold">Apply for Campaigns</h3>
                <p className="text-gray-500">Browse available campaigns and submit your application</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">3</div>
                <h3 className="text-xl font-bold">Get Paid</h3>
                <p className="text-gray-500">Complete campaigns and receive payment directly</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Our Platform</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you're a brand looking to grow or a creator ready to collaborate, we've got you covered
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button size="lg" variant="outline" className="border-black text-black hover:bg-black/10">
                    Apply as Creator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-100">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex-1 space-y-4">
            <div className="text-lg font-medium">CreatorAmp</div>
            <div className="text-sm text-gray-500">Connecting creators and brands for authentic collaborations</div>
          </div>
          <nav className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <div className="text-sm font-medium">Company</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-500 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">Legal</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-gray-900">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} CreatorAmp. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
