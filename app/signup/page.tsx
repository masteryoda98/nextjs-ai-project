"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Logo } from "@/components/logo"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    mode: "onChange", // Validate on change for better user feedback
  })

  // Debug form state changes
  useEffect(() => {
    console.log("Form state:", {
      isDirty: form.formState.isDirty,
      isValid: form.formState.isValid,
      errors: form.formState.errors,
    })
  }, [form.formState])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", { ...values, password: "***", confirmPassword: "***" })
    setIsSubmitting(true)
    setFormError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: "CREATOR",
          },
        },
      })

      console.log("Supabase response:", { data, error })

      if (error) {
        console.error("Signup error:", error)
        setFormError(error.message)
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Verification email sent",
          description: "Please check your email to verify your account.",
        })
        router.push("/verify-email")
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error)
      setFormError("Something went wrong. Please try again later.")
      toast({
        title: "Sign up failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle manual form submission
  const handleManualSubmit = () => {
    console.log("Manual submit button clicked")
    form.handleSubmit(onSubmit)()
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 spotify-gradient" />
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <Logo />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "CreatorAmp has transformed how I promote my music, connecting me with authentic creators who truly
              resonate with my sound."
            </p>
            <footer className="text-sm">Sarah Chen, Independent Artist</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{formError}</span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input placeholder="your.email@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="terms">
                        Accept{" "}
                        <Link href="/terms" className="underline underline-offset-2">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-2">
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Regular submit button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              {/* Alternative manual submit button for testing */}
              <Button
                type="button"
                className="w-full mt-2"
                disabled={isSubmitting}
                onClick={handleManualSubmit}
                variant="outline"
              >
                Create account (alternative)
              </Button>
            </form>
          </Form>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
