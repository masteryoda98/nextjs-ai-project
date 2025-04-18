"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type UseFormReturn, type FieldValues, type DefaultValues } from "react-hook-form"
import type { ZodSchema } from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface FormWrapperProps<TFormValues extends FieldValues> {
  schema: ZodSchema<TFormValues>
  defaultValues: DefaultValues<TFormValues>
  onSubmit: (values: TFormValues) => Promise<{ success: boolean; message?: string }>
  children: (form: UseFormReturn<TFormValues>) => React.ReactNode
  submitText?: string
  successMessage?: string
  errorMessage?: string
}

export function FormWrapper<TFormValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  submitText = "Submit",
  successMessage = "Form submitted successfully",
  errorMessage = "An error occurred",
}: FormWrapperProps<TFormValues>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const handleSubmit = async (values: TFormValues) => {
    setIsSubmitting(true)

    try {
      const result = await onSubmit(values)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || successMessage,
        })
        form.reset(defaultValues)
      } else {
        toast({
          title: "Error",
          description: result.message || errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {children(form)}

      <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          submitText
        )}
      </Button>
    </form>
  )
}
