-- ================================================
-- Smart Bookmark App - Database Schema with Realtime
-- ================================================

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  category TEXT,
  tags TEXT[],
  favicon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ENABLE REALTIME - CRITICAL FOR SYNC
-- ================================================

-- Enable realtime for bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

-- Set replica identity to FULL (required for realtime DELETE events)
ALTER TABLE bookmarks REPLICA IDENTITY FULL;

-- ================================================
-- Indexes for Performance
-- ================================================

-- Index on user_id for fast user-specific queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- Index on category for filtering
CREATE INDEX IF NOT EXISTS idx_bookmarks_category ON bookmarks(category);

-- GIN index for tags array
CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON bookmarks USING GIN(tags);

-- ================================================
-- Row Level Security (RLS)
-- ================================================

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own bookmarks
CREATE POLICY "Users can update own bookmarks"
  ON bookmarks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- Functions and Triggers
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_bookmarks_updated_at ON bookmarks;
CREATE TRIGGER update_bookmarks_updated_at
    BEFORE UPDATE ON bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- Verification Queries
-- ================================================

-- Verify table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'bookmarks';

-- Verify indexes
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'bookmarks';

-- Verify RLS policies
-- SELECT policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'bookmarks';

-- Verify realtime is enabled
-- SELECT schemaname, tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
