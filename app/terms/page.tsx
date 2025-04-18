import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
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

      <main className="flex-1 container py-10">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to CreatorAmp! These Terms of Service ("Terms") govern your use of our platform, website, and
              services (collectively, "CreatorAmp"). By accessing or using CreatorAmp, you agree to be bound by these
              Terms. If you do not agree, do not use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>"Artist" refers to musicians who create campaigns to promote their music.</li>
              <li>"Creator" refers to TikTok users who participate in campaigns by creating promotional content.</li>
              <li>
                "User" refers to anyone who creates an account on CreatorAmp, including both Artists and Creators.
              </li>
              <li>
                "Campaign" refers to a promotional project initiated by an Artist to have Creators create TikTok videos
                using their music.
              </li>
              <li>"Platform" refers to the CreatorAmp website and services.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Account Registration & Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 13 years old to create an account on CreatorAmp.</li>
              <li>Users must provide accurate information during sign-up, including phone verification.</li>
              <li>Artists and Creators must complete their profiles before participating in any campaigns.</li>
              <li>Accounts that provide false or misleading information may be suspended or terminated.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Campaigns & Content Submission</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Artists create campaigns by setting a budget and selecting Creators to participate.</li>
              <li>Creators can apply to campaigns based on their profile and pre-set rates.</li>
              <li>Once a Creator's content is submitted, SoundMatch's internal team reviews and approves it.</li>
              <li>Artists cannot communicate directly with Creators; all revisions are handled by SoundMatch.</li>
              <li>Approved content will be published on TikTok as per the campaign terms.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Payments & Fees</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Artists fund their campaigns upfront. Once a Creator is selected, the funds are placed on hold.</li>
              <li>
                Creators receive payment only after their content is approved by SoundMatch's internal review team.
              </li>
              <li>SoundMatch charges a 10% service fee on all artist campaign budgets.</li>
              <li>
                Refunds are not provided once a campaign is funded and a Creator is selected unless there is a dispute.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Prohibited Conduct</h2>
            <p className="mb-2">Users may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Submit or promote illegal, hateful, or misleading content.</li>
              <li>Attempt to bypass SoundMatch's payment system.</li>
              <li>Engage in harassment, spam, or fraudulent activities.</li>
              <li>Violate any applicable laws or TikTok's terms of service.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Artists retain rights to their music; Creators retain rights to their TikTok videos.</li>
              <li>
                By using SoundMatch, Creators grant Artists a limited right to use their submitted videos for
                promotional purposes.
              </li>
              <li>Users may not use SoundMatch's brand, logo, or content without permission.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Privacy & Data Protection</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>SoundMatch collects and processes user data as described in our Privacy Policy.</li>
              <li>We do not share user data with third parties without consent, except as required by law.</li>
              <li>Users can request data deletion by contacting support.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Account Suspension & Termination</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>SoundMatch reserves the right to suspend or terminate accounts that violate these Terms.</li>
              <li>Users found engaging in fraud, misuse, or misconduct will be permanently banned.</li>
              <li>Terminated users may not create new accounts without SoundMatch's permission.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Disclaimers & Liability</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                SoundMatch is a marketplace connecting Artists and Creators; we do not guarantee campaign performance.
              </li>
              <li>We are not liable for disputes between Artists and Creators.</li>
              <li>SoundMatch is provided "as is" without warranties of any kind.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Dispute Resolution</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users must first attempt to resolve disputes through SoundMatch's support team.</li>
              <li>If unresolved, disputes will be settled through arbitration in accordance with applicable laws.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Changes to These Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>SoundMatch may update these Terms at any time. Users will be notified of significant changes.</li>
              <li>Continued use of the platform after updates constitutes acceptance of the new Terms.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">13. Contact Information</h2>
            <p>
              For questions or concerns about these Terms, contact us at{" "}
              <a href="mailto:support@soundmatch.com" className="text-primary hover:underline">
                support@soundmatch.com
              </a>
              .
            </p>
          </section>

          <div className="mt-10 pt-6 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              By using CreatorAmp, you acknowledge that you have read, understood, and agreed to these Terms of Service.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: March 23, 2025</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40">
        <div className="container flex flex-col md:flex-row items-center justify-between py-8 md:py-12">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Logo />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="/terms" className="text-sm text-primary hover:text-foreground">
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
