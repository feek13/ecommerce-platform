-- Fix RLS policy for reviews table to allow authenticated users to insert reviews

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert reviews for their own user_id
CREATE POLICY "Users can insert their own reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow everyone to view all reviews (public read)
CREATE POLICY "Users can view all reviews"
ON reviews FOR SELECT
TO authenticated, anon
USING (true);

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews"
ON reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own reviews  
CREATE POLICY "Users can delete their own reviews"
ON reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'reviews';
