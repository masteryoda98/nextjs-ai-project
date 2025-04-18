import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"

// Create a client for use in client components
export const createClient = () => {
  return createClientComponentClient<Database>()
}
