-- Create initial schema for OmniInbox
-- Handles unified threads and individual message entries

-- 1. Create Threads Table
CREATE TABLE IF NOT EXISTS public.threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(30) NOT NULL, -- 'gmail', 'twitter', 'linkedin', 'instagram'
    external_thread_id VARCHAR(255) NOT NULL, -- Unique ID from the platform (e.g. Gmail threadId, DM conversationId)
    sender VARCHAR(100) NOT NULL, -- Sender display name
    handle VARCHAR(100), -- Platform handle (e.g. @username, email address)
    avatar TEXT, -- Image URL
    subject TEXT, -- Subject line (for emails) or preview text
    snippet TEXT, -- Short preview of last message
    unread BOOLEAN DEFAULT TRUE,
    flagged BOOLEAN DEFAULT FALSE,
    auto_reply BOOLEAN DEFAULT FALSE, -- Auto-pilot toggle
    sentiment VARCHAR(20) DEFAULT 'neutral', -- positive, neutral, negative
    time VARCHAR(50) DEFAULT 'Just now', -- Readable timestamp
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(100),
    tags TEXT[], -- Array of CRM tags
    bio TEXT, -- CRM profile description
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast searches by external thread ID per platform
CREATE UNIQUE INDEX IF NOT EXISTS threads_platform_external_idx ON public.threads(platform, external_thread_id);

-- 2. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE,
    sender VARCHAR(100) NOT NULL, -- 'Me' or Sender Name
    time VARCHAR(50) DEFAULT 'Just now',
    is_sent BOOLEAN DEFAULT FALSE, -- TRUE if sent by workspace owner, FALSE if incoming
    text TEXT NOT NULL,
    external_message_id VARCHAR(255), -- ID of message on source platform
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ordering messages inside a thread
CREATE INDEX IF NOT EXISTS messages_thread_id_idx ON public.messages(thread_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Access Policies (for client prototype testing)
-- Note: In a production app, restrict these policies using auth.uid()
CREATE POLICY "Allow public read access to threads" ON public.threads
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to threads" ON public.threads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to threads" ON public.threads
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to threads" ON public.threads
    FOR DELETE USING (true);

CREATE POLICY "Allow public read access to messages" ON public.messages
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to messages" ON public.messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to messages" ON public.messages
    FOR UPDATE USING (true);

-- 5. Enable Realtime Replication
-- Safely adds tables to the Supabase Realtime publication to avoid duplicate relation errors
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_publication p ON p.oid = pr.prpubid
    WHERE p.pubname = 'supabase_realtime' AND c.relname = 'threads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.threads;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_publication p ON p.oid = pr.prpubid
    WHERE p.pubname = 'supabase_realtime' AND c.relname = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;
