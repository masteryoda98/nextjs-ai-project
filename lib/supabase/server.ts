import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"

// Create a server-side client for Server Components
export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}

// Add the renamed function for backward compatibility
export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({ cookies })
}

// Create a server-side client for Server Actions
export const createActionClient = () => {
  return createServerActionClient<Database>({ cookies })
}
