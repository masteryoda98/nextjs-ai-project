"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Logo } from "@/components/logo"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  inquiryType: z.enum(["music_promotion", "creator_support", "partnership", "other"], {
    required_error: "Please select an inquiry type.",
  }),
})

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      inquiryType: "music_promotion",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would send the form data to your server
    console.log(values)
    // Show success message
    alert("Thank you for your message. We'll get back to you soon!")
    // Reset the form
    form.reset()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border/40">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Logo />
            </Link>
          </div>
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
      <main className="flex-1">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-4">Contact Us</h1>
              <p className="text-muted-foreground mb-6">
                Have questions about our music marketing services? Get in touch with our team and we'll get back to you
                as soon as possible.
              </p>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Music Promotion</h2>
                  <p className="text-muted-foreground">
                    Looking to promote your music on TikTok? We can help you reach new audiences through our network of
                    creators.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Creator Support</h2>
                  <p className="text-muted-foreground">
                    Need help with your creator account or have questions about campaigns? Our support team is here to
                    help.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9am - 6pm EST
                    <br />
                    Saturday - Sunday: Closed
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Email</h2>
                  <p className="text-muted-foreground">
                    General Inquiries: info@creatoramp.com
                    <br />
                    Creator Support: creators@creatoramp.com
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inquiryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inquiry Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="music_promotion" />
                              </FormControl>
                              <FormLabel className="font-normal">Music Promotion</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="creator_support" />
                              </FormControl>
                              <FormLabel className="font-normal">Creator Support</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="partnership" />
                              </FormControl>
                              <FormLabel className="font-normal">Partnership Opportunity</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal">Other</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Subject of your message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your message..." className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </Form>
            </div>
          </div>
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
