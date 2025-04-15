/*
  # Road Analysis System Schema

  1. New Tables
    - `image_uploads`
      - Stores uploaded image information and processing status
      - Contains quality scores and analysis results
    
    - `analysis_results`
      - Stores detailed analysis data for each upload
      - Includes crack detection and quality metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

CREATE TABLE IF NOT EXISTS image_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  original_image_url text NOT NULL,
  processed_image_url text,
  quality_score integer,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id uuid REFERENCES image_uploads NOT NULL,
  cracks_detected integer DEFAULT 0,
  surface_quality text,
  analysis_details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Policies for image_uploads
CREATE POLICY "Users can view their own uploads"
  ON image_uploads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create uploads"
  ON image_uploads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads"
  ON image_uploads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for analysis_results
CREATE POLICY "Users can view results for their uploads"
  ON analysis_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM image_uploads
      WHERE image_uploads.id = analysis_results.upload_id
      AND image_uploads.user_id = auth.uid()
    )
  );