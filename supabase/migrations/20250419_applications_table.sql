-- Create a function to create the applications table if it doesn't exist
CREATE OR REPLACE FUNCTION create_applications_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
  ) THEN
    -- Create the applications table
    CREATE TABLE public.applications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      tiktok_handle TEXT NOT NULL,
      follower_count INTEGER NOT NULL,
      content_niche TEXT NOT NULL,
      reason TEXT NOT NULL,
      portfolio_link TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Add indexes
    CREATE INDEX applications_user_id_idx ON public.applications(user_id);
    CREATE INDEX applications_status_idx ON public.applications(status);
    
    -- Add RLS policies
    ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
    
    -- Users can read their own applications
    CREATE POLICY "Users can read their own applications"
      ON public.applications
      FOR SELECT
      USING (auth.uid() = user_id);
      
    -- Users can insert their own applications
    CREATE POLICY "Users can insert their own applications"
      ON public.applications
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
    -- Admins can read all applications
    CREATE POLICY "Admins can read all applications"
      ON public.applications
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.creatoramp_users
          WHERE id = auth.uid() AND role = 'ADMIN'
        )
      );
      
    -- Admins can update all applications
    CREATE POLICY "Admins can update all applications"
      ON public.applications
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.creatoramp_users
          WHERE id = auth.uid() AND role = 'ADMIN'
        )
      );
  END IF;
END;
$$;

-- Create a function to update the applications table schema if needed
CREATE OR REPLACE FUNCTION update_applications_schema()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN full_name TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN email TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
    AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN phone_number TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
    AND column_name = 'tiktok_handle'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN tiktok_handle TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
    AND column_name = 'follower_count'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN follower_count INTEGER;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
    AND column_name = 'content_niche'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN content_niche TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
    AND column_name = 'reason'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN reason TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
    AND column_name = 'portfolio_link'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN portfolio_link TEXT;
  END IF;
END;
$$;

-- Execute the function to create the table
SELECT create_applications_table();
