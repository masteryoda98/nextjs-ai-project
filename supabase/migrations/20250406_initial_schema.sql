-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'ARTIST', 'CREATOR')),
  phone VARCHAR(50),
  tiktok_handle VARCHAR(255),
  follower_count INTEGER,
  content_niche VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  artist_name VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creator applications table
CREATE TABLE IF NOT EXISTS creator_applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  tiktok_handle VARCHAR(255) NOT NULL,
  follower_count INTEGER NOT NULL,
  content_niche VARCHAR(255) NOT NULL,
  reason TEXT NOT NULL,
  portfolio_link VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  music_link VARCHAR(255) NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  remaining_budget DECIMAL(10, 2) NOT NULL,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('DANCE', 'LIP_SYNC', 'LIFESTYLE', 'REVIEW', 'CHALLENGE', 'OTHER')),
  content_requirements TEXT NOT NULL,
  target_followers INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campaign creators (junction table)
CREATE TABLE IF NOT EXISTS campaign_creators (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id),
  creator_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  payment_rate DECIMAL(10, 2) NOT NULL,
  UNIQUE(campaign_id, creator_id)
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id),
  creator_id INTEGER REFERENCES users(id),
  campaign_creator_id INTEGER REFERENCES campaign_creators(id),
  content_url VARCHAR(255) NOT NULL,
  caption TEXT,
  status VARCHAR(50) DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'NEEDS_REVISION', 'APPROVED', 'REJECTED', 'PUBLISHED')),
  revision_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER UNIQUE REFERENCES submissions(id),
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
  description TEXT NOT NULL,
  transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id),
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  rating SMALLINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_creator_applications_user_id ON creator_applications(user_id);
CREATE INDEX idx_campaigns_artist_id ON campaigns(artist_id);
CREATE INDEX idx_campaign_creators_campaign_id ON campaign_creators(campaign_id);
CREATE INDEX idx_campaign_creators_creator_id ON campaign_creators(creator_id);
CREATE INDEX idx_submissions_campaign_id ON submissions(campaign_id);
CREATE INDEX idx_submissions_creator_id ON submissions(creator_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_feedback_submission_id ON feedback(submission_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies (these are basic examples, adjust according to your security needs)
CREATE POLICY "Public users can insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Admin can view all users" ON users FOR SELECT USING (auth.role() = 'admin');

-- Similar policies would be created for other tables
