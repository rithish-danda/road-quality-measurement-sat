/*
  # Initial Schema Setup for Road Quality Analysis System

  1. New Tables
    - `uploads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `status` (text)
    
    - `analysis_results`
      - `id` (uuid, primary key)
      - `upload_id` (uuid, references uploads)
      - `surface_condition` (text)
      - `defect_count` (integer)
      - `maintenance_recommendation` (text)
      - `created_at` (timestamp)
    
    - `road_conditions`
      - `id` (uuid, primary key)
      - `analysis_id` (uuid, references analysis_results)
      - `location` (text)
      - `condition_type` (text)
      - `severity` (text)
      - `coordinates` (point)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own uploads and related data
      - Create new uploads
      - Read analysis results for their uploads
*/

-- Create uploads table
CREATE TABLE uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending'
);

-- Create analysis_results table
CREATE TABLE analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id uuid REFERENCES uploads NOT NULL,
  surface_condition text NOT NULL,
  defect_count integer DEFAULT 0,
  maintenance_recommendation text,
  created_at timestamptz DEFAULT now()
);

-- Create road_conditions table
CREATE TABLE road_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES analysis_results NOT NULL,
  location text NOT NULL,
  condition_type text NOT NULL,
  severity text NOT NULL,
  coordinates point,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE road_conditions ENABLE ROW LEVEL SECURITY;

-- Create policies for uploads
CREATE POLICY "Users can view their own uploads"
  ON uploads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create uploads"
  ON uploads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for analysis_results
CREATE POLICY "Users can view analysis results for their uploads"
  ON analysis_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM uploads
      WHERE uploads.id = analysis_results.upload_id
      AND uploads.user_id = auth.uid()
    )
  );

-- Create policies for road_conditions
CREATE POLICY "Users can view road conditions for their analyses"
  ON road_conditions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM analysis_results
      JOIN uploads ON uploads.id = analysis_results.upload_id
      WHERE analysis_results.id = road_conditions.analysis_id
      AND uploads.user_id = auth.uid()
    )
  );