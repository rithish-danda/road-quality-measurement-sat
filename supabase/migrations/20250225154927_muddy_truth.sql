/*
  # Create storage bucket for road images

  1. New Storage
    - Create "road-images" bucket for storing uploaded road images
  
  2. Security
    - Enable public access for viewing images
    - Allow authenticated users to upload images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('road-images', 'road-images', true);

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'road-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'road-images'
  AND owner = auth.uid()
);

-- Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'road-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'road-images' AND owner = auth.uid());

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'road-images' AND owner = auth.uid());