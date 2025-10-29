-- Complete RLS Policy Fix for Image Uploads
-- Run this in your Supabase SQL Editor

-- 1. Remove old policies
DROP POLICY IF EXISTS "Allow public uploads to restaurant images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for restaurant images" ON storage.objects;

-- 2. Allow public uploads (INSERT)
CREATE POLICY "Allow public uploads to restaurant images"
ON storage.objects 
FOR INSERT 
TO public
WITH CHECK (bucket_id = 'restaurant-images');

-- 3. Allow public reads (SELECT) if it doesn't exist
CREATE POLICY "Public read access for restaurant images"
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'restaurant-images');

-- 4. Make bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'restaurant-images';

