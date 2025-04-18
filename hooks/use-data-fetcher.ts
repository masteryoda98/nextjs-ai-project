"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface FetcherOptions<T> {
  url: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: HeadersInit
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
  dependencies?: any[]
}

export function useDataFetcher<T>({
  url,
  method = "GET",
  body,
  headers,
  onSuccess,
  onError,
  enabled = true,
  dependencies = [],
}: FetcherOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }

      if (body && method !== "GET") {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "API returned an error")
      }

      setData(result.data)

      if (onSuccess) {
        onSuccess(result.data)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)

      if (onError) {
        onError(error)
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [url, method, body, headers, enabled, onSuccess, onError, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData, ...dependencies])

  return {
    data,
    error,
    isLoading,
    refetch: fetchData,
  }
}
