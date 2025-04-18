import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import { getEnv } from "@/lib/env"

// Create a single supabase client for interacting with your database
const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL")
const supabaseAnonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

// Connection pool configuration
const poolConfig = {
  maxConnections: 10, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // How long a connection can be idle before being removed
  connectionTimeoutMillis: 5000, // How long to wait for a connection
}

// Create a client with connection pooling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: "public",
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
  // Add connection pooling in a real implementation
  // This is a placeholder as Supabase JS client doesn't directly expose connection pooling
  // In a real app, you'd implement this at the database driver level
})

// Create a server-side client (for API routes, Server Components, etc)
export const createServerSupabaseClient = () => {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL")
  const supabaseServiceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY")
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
    db: {
      schema: "public",
    },
    global: {
      fetch: (...args) => fetch(...args),
    },
    // Add connection pooling in a real implementation
  })
}
