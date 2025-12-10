-- Fix reviews table: change order_id from UUID to bigint to match orders.id
-- This fixes the "invalid input syntax for type uuid" error

-- First, check if there are any existing reviews (there shouldn't be)
-- If there are, we'd need to handle them carefully

-- Drop the old foreign key constraint if it exists
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_order_id_fkey;

-- Change the column type from UUID to bigint
ALTER TABLE reviews ALTER COLUMN order_id TYPE bigint USING order_id::text::bigint;

-- Re-add the foreign key constraint
ALTER TABLE reviews ADD CONSTRAINT reviews_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reviews' AND column_name = 'order_id';
