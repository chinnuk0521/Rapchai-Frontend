-- Supabase Storage Policies for restaurant-images bucket
-- Run these queries in your Supabase SQL Editor

-- Step 1: Drop existing policies if they exist (run these first to avoid conflicts)
DROP POLICY IF EXISTS "Public read access for restaurant images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Step 2: Allow public read access to all images
CREATE POLICY "Public read access for restaurant images" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'restaurant-images');

-- Step 3: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'restaurant-images');

-- Step 4: Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'restaurant-images');

-- Step 5: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'restaurant-images');
