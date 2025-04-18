import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function PrivacyPolicyPage() {
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

          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <div className="mb-8">
            <p className="text-sm text-muted-foreground">Effective Date: 03/23/2025</p>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to CreatorAmp! Your privacy is important to us. This Privacy Policy explains how we collect, use,
              and protect your personal information when you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect the following types of information:</p>

            <div className="space-y-4 pl-4">
              <div>
                <h3 className="font-medium mb-2">Account Information:</h3>
                <p>
                  When you sign up, we collect your name, email address, phone number, TikTok profile details, and
                  payment information.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">User Content:</h3>
                <p>Any content you upload, including videos, images, and campaign details.</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Usage Data:</h3>
                <p>
                  We track interactions on the platform, such as campaign activity, payments, and communication with our
                  team.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Device and Technical Data:</h3>
                <p>IP addresses, browser types, and operating systems to improve platform functionality.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitate transactions between artists and creators.</li>
              <li>Verify user accounts and maintain platform security.</li>
              <li>Process payments and payouts securely.</li>
              <li>Improve and personalize the user experience.</li>
              <li>Enforce our Terms of Service and prevent fraud.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Sharing of Information</h2>
            <p className="mb-4">We do not sell or rent your personal data. However, we may share information with:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Payment Processors:</span> To facilitate secure transactions.
              </li>
              <li>
                <span className="font-medium">Verification Services:</span> To confirm user identities and prevent
                fraud.
              </li>
              <li>
                <span className="font-medium">Legal Authorities:</span> If required by law or to protect the platform
                from fraudulent activities.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your data. However, no online service is
              completely secure, and we cannot guarantee absolute protection.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We retain your information as long as necessary for operational, legal, or security purposes. You may
              request account deletion, subject to any pending transactions or legal obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Access and update your personal information.</li>
              <li>Request deletion of your data (except where legally required to retain it).</li>
              <li>Opt out of marketing communications.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Third-Party Integrations</h2>
            <p className="mb-4">
              Our platform integrates with third-party services like TikTok and Spotify. Your use of these services is
              subject to their respective privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. Significant changes will be communicated to users via
              email or platform notifications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
              <a href="mailto:Hello@CreatorAmp.com" className="text-primary hover:underline">
                Hello@CreatorAmp.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border/40">
        <div className="container flex flex-col md:flex-row items-center justify-between py-8 md:py-12">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Logo />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-primary hover:text-foreground">
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
