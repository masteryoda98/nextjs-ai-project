import { unstable_cache as nextCache } from "next/cache"

// Cache function with typed parameters and return value
export function cache<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyParts: string[],
  options?: { revalidate?: number; tags?: string[] },
) {
  return nextCache(fn, keyParts, options)
}

// Cache for database queries
export function dbCache<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyParts: string[],
  options?: { revalidate?: number; tags?: string[] },
) {
  return cache(fn, ["db", ...keyParts], {
    revalidate: options?.revalidate || 60, // Default to 60 seconds
    tags: ["db", ...(options?.tags || [])],
  })
}

// Cache for API responses
export function apiCache<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyParts: string[],
  options?: { revalidate?: number; tags?: string[] },
) {
  return cache(fn, ["api", ...keyParts], {
    revalidate: options?.revalidate || 300, // Default to 5 minutes
    tags: ["api", ...(options?.tags || [])],
  })
}

// Cache for user data
export function userCache<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyParts: string[],
  options?: { revalidate?: number; tags?: string[] },
) {
  return cache(fn, ["user", ...keyParts], {
    revalidate: options?.revalidate || 600, // Default to 10 minutes
    tags: ["user", ...(options?.tags || [])],
  })
}
