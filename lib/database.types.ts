export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          is_active: boolean
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          is_active?: boolean
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          is_active?: boolean
          user_id?: string | null
        }
      }
      submissions: {
        Row: {
          id: string
          campaign_id: string
          user_id: string
          created_at: string
          status: "pending" | "approved" | "rejected"
          content: Json | null
        }
        Insert: {
          id?: string
          campaign_id: string
          user_id: string
          created_at?: string
          status?: "pending" | "approved" | "rejected"
          content?: Json | null
        }
        Update: {
          id?: string
          campaign_id?: string
          user_id?: string
          created_at?: string
          status?: "pending" | "approved" | "rejected"
          content?: Json | null
        }
      }
      applications: {
        Row: {
          id: string
          campaign_id: string
          user_id: string
          created_at: string
          status: "pending" | "approved" | "rejected"
          content: Json | null
        }
        Insert: {
          id?: string
          campaign_id: string
          user_id: string
          created_at?: string
          status?: "pending" | "approved" | "rejected"
          content?: Json | null
        }
        Update: {
          id?: string
          campaign_id?: string
          user_id?: string
          created_at?: string
          status?: "pending" | "approved" | "rejected"
          content?: Json | null
        }
      }
      payouts: {
        Row: {
          id: string
          user_id: string
          amount: number
          created_at: string
          status: "pending" | "processing" | "completed" | "failed"
          submission_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          created_at?: string
          status?: "pending" | "processing" | "completed" | "failed"
          submission_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          created_at?: string
          status?: "pending" | "processing" | "completed" | "failed"
          submission_id?: string | null
        }
      }
      creatoramp_users: {
        Row: {
          id: string
          name: string
          role: string
          phone: string | null
          tiktok_handle: string | null
          follower_count: number | null
          created_date: string | null
          is_verified: boolean | null
          bio: string | null
          created_at: string
          updated_at: string | null
          is_active: boolean
          deleted_at: string | null
        }
        Insert: {
          id: string
          name: string
          role?: string
          phone?: string | null
          tiktok_handle?: string | null
          follower_count?: number | null
          created_date?: string | null
          is_verified?: boolean | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
          is_active?: boolean
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          role?: string
          phone?: string | null
          tiktok_handle?: string | null
          follower_count?: number | null
          created_date?: string | null
          is_verified?: boolean | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
          is_active?: boolean
          deleted_at?: string | null
        }
      }
    }
  }
}
