"use client"

import { useState, useCallback } from "react"

interface UseAsyncReturn<T, E = Error> {
  execute: (...args: any[]) => Promise<T | undefined>
  status: "idle" | "pending" | "success" | "error"
  data: T | undefined
  error: E | undefined
  reset: () => void
}

export function useAsync<T, E = Error>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false,
): UseAsyncReturn<T, E> {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [data, setData] = useState<T | undefined>(undefined)
  const [error, setError] = useState<E | undefined>(undefined)

  // The execute function wraps asyncFunction and
  // handles setting state for pending, data, and error.
  // useCallback ensures the function is not recreated on each render
  const execute = useCallback(
    async (...args: any[]) => {
      setStatus("pending")
      setData(undefined)
      setError(undefined)

      try {
        const response = await asyncFunction(...args)
        setData(response)
        setStatus("success")
        return response
      } catch (error) {
        setError(error as E)
        setStatus("error")
        return undefined
      }
    },
    [asyncFunction],
  )

  // Call execute if immediate is true
  // useEffect(() => {
  //   if (immediate) {
  //     execute()
  //   }
  // }, [execute, immediate])

  const reset = useCallback(() => {
    setStatus("idle")
    setData(undefined)
    setError(undefined)
  }, [])

  return { execute, status, data, error, reset }
}
