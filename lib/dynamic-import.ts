"use client"

// This utility helps with dynamic imports in Next.js

import { useEffect, useState } from "react"

// For client components that need to dynamically import modules
export function useDynamicImport<T>(importFn: () => Promise<T>) {
  const [module, setModule] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadModule = async () => {
      try {
        const importedModule = await importFn()
        if (isMounted) {
          setModule(importedModule as T)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        }
      }
    }

    loadModule()

    return () => {
      isMounted = false
    }
  }, [importFn])

  return { module, error, loading }
}

// For server components that need to conditionally import modules
export async function safeServerImport<T>(importFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await importFn()
  } catch (error) {
    console.error("Error importing module:", error)
    return fallback
  }
}
