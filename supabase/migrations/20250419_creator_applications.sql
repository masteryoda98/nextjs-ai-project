-- Check if the creator_applications table exists
CREATE TABLE IF NOT EXISTS creator_applications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  tiktok_handle VARCHAR(255) NOT NULL,
  follower_count INTEGER,
  content_niche VARCHAR(255),
  reason TEXT,
  portfolio_link TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS creator_applications_user_id_idx ON creator_applications(user_id);
CREATE INDEX IF NOT EXISTS creator_applications_status_idx ON creator_applications(status);
