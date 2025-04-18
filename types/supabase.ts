export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          email: string
          password: string
          name: string
          role: "ADMIN" | "ARTIST" | "CREATOR"
          phone: string | null
          tiktok_handle: string | null
          follower_count: number | null
          content_niche: string | null
          is_verified: boolean
          artist_name: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          password: string
          name: string
          role: "ADMIN" | "ARTIST" | "CREATOR"
          phone?: string | null
          tiktok_handle?: string | null
          follower_count?: number | null
          content_niche?: string | null
          is_verified?: boolean
          artist_name?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          password?: string
          name?: string
          role?: "ADMIN" | "ARTIST" | "CREATOR"
          phone?: string | null
          tiktok_handle?: string | null
          follower_count?: number | null
          content_niche?: string | null
          is_verified?: boolean
          artist_name?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      creator_applications: {
        Row: {
          id: number
          user_id: number | null
          full_name: string
          email: string
          phone_number: string
          tiktok_handle: string
          follower_count: number
          content_niche: string
          reason: string
          portfolio_link: string | null
          status: "PENDING" | "APPROVED" | "REJECTED"
          review_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          full_name: string
          email: string
          phone_number: string
          tiktok_handle: string
          follower_count: number
          content_niche: string
          reason: string
          portfolio_link?: string | null
          status?: "PENDING" | "APPROVED" | "REJECTED"
          review_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          full_name?: string
          email?: string
          phone_number?: string
          tiktok_handle?: string
          follower_count?: number
          content_niche?: string
          reason?: string
          portfolio_link?: string | null
          status?: "PENDING" | "APPROVED" | "REJECTED"
          review_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: number
          artist_id: number
          name: string
          description: string
          music_link: string
          budget: number
          remaining_budget: number
          content_type: "DANCE" | "LIP_SYNC" | "LIFESTYLE" | "REVIEW" | "CHALLENGE" | "OTHER"
          content_requirements: string
          target_followers: number
          status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          artist_id: number
          name: string
          description: string
          music_link: string
          budget: number
          remaining_budget: number
          content_type: "DANCE" | "LIP_SYNC" | "LIFESTYLE" | "REVIEW" | "CHALLENGE" | "OTHER"
          content_requirements: string
          target_followers: number
          status?: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          artist_id?: number
          name?: string
          description?: string
          music_link?: string
          budget?: number
          remaining_budget?: number
          content_type?: "DANCE" | "LIP_SYNC" | "LIFESTYLE" | "REVIEW" | "CHALLENGE" | "OTHER"
          content_requirements?: string
          target_followers?: number
          status?: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED"
          created_at?: string
          updated_at?: string
        }
      }
      campaign_creators: {
        Row: {
          id: number
          campaign_id: number
          creator_id: number
          status: "PENDING" | "APPROVED" | "REJECTED"
          applied_at: string
          approved_at: string | null
          payment_rate: number
        }
        Insert: {
          id?: number
          campaign_id: number
          creator_id: number
          status?: "PENDING" | "APPROVED" | "REJECTED"
          applied_at?: string
          approved_at?: string | null
          payment_rate: number
        }
        Update: {
          id?: number
          campaign_id?: number
          creator_id?: number
          status?: "PENDING" | "APPROVED" | "REJECTED"
          applied_at?: string
          approved_at?: string | null
          payment_rate?: number
        }
      }
      submissions: {
        Row: {
          id: number
          campaign_id: number
          creator_id: number
          campaign_creator_id: number
          content_url: string
          caption: string | null
          status: "PENDING_REVIEW" | "NEEDS_REVISION" | "APPROVED" | "REJECTED" | "PUBLISHED"
          revision_notes: string | null
          submitted_at: string
          reviewed_at: string | null
          published_at: string | null
        }
        Insert: {
          id?: number
          campaign_id: number
          creator_id: number
          campaign_creator_id: number
          content_url: string
          caption?: string | null
          status?: "PENDING_REVIEW" | "NEEDS_REVISION" | "APPROVED" | "REJECTED" | "PUBLISHED"
          revision_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          published_at?: string | null
        }
        Update: {
          id?: number
          campaign_id?: number
          creator_id?: number
          campaign_creator_id?: number
          content_url?: string
          caption?: string | null
          status?: "PENDING_REVIEW" | "NEEDS_REVISION" | "APPROVED" | "REJECTED" | "PUBLISHED"
          revision_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          published_at?: string | null
        }
      }
      payments: {
        Row: {
          id: number
          submission_id: number | null
          user_id: number
          amount: number
          status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
          description: string
          transaction_id: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: number
          submission_id?: number | null
          user_id: number
          amount: number
          status?: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
          description: string
          transaction_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: number
          submission_id?: number | null
          user_id?: number
          amount?: number
          status?: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
          description?: string
          transaction_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      feedback: {
        Row: {
          id: number
          submission_id: number
          sender_id: number
          receiver_id: number
          content: string
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: number
          submission_id: number
          sender_id: number
          receiver_id: number
          content: string
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          submission_id?: number
          sender_id?: number
          receiver_id?: number
          content?: string
          rating?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
