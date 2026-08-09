-- Create communities table
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pre-seed communities
INSERT INTO public.communities (name, slug, icon) VALUES
('Artificial Intelligence', 'ai', 'brain'),
('Web 3.0', 'web3', 'globe'),
('Crypto & Blockchain', 'crypto', 'bitcoin'),
('Travel & Hospitality', 'travel', 'plane');

-- Enable RLS on communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are viewable by everyone"
  ON public.communities FOR SELECT
  USING (true);

-- Create community_members table
CREATE TABLE public.community_members (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, community_id)
);

-- Enable RLS on community_members
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community members are viewable by everyone"
  ON public.community_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join communities"
  ON public.community_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities"
  ON public.community_members FOR DELETE
  USING (auth.uid() = user_id);


-- Create connection_requests table
CREATE TYPE public.connection_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE public.connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status connection_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, receiver_id)
);

-- Enable RLS on connection_requests
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;

-- Users can see requests they sent or received
CREATE POLICY "Users can view their connection requests"
  ON public.connection_requests FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Users can send requests
CREATE POLICY "Users can create connection requests"
  ON public.connection_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

-- Users can update requests (accept/reject) - Receiver only
CREATE POLICY "Receiver can update connection status"
  ON public.connection_requests FOR UPDATE
  USING (auth.uid() = receiver_id);


-- Update profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT; -- Using existing display_name as primary, but adding full_name as requested
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT false;


-- Create profile_contacts table for PRIVATE data (Email, Phone)
-- This ensures strict privacy: only accessible if connected or self.
CREATE TABLE public.profile_contacts (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_contacts ENABLE ROW LEVEL SECURITY;

-- Helper function to check connection status
CREATE OR REPLACE FUNCTION public.is_connected(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.connection_requests
    WHERE status = 'accepted'
    AND  (
      (requester_id = auth.uid() AND receiver_id = _user_id) OR
      (receiver_id = auth.uid() AND requester_id = _user_id)
    )
  )
$$;

-- RLS for profile_contacts
CREATE POLICY "Users can view own contacts"
  ON public.profile_contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Connected users can view contacts"
  ON public.profile_contacts FOR SELECT
  USING (public.is_connected(user_id));

CREATE POLICY "Users can insert/update own contacts"
  ON public.profile_contacts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
