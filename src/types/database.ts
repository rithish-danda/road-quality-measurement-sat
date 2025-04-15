export interface Upload {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  damage_percentage?: number;
}

export interface AnalysisResult {
  id: string;
  upload_id: string;
  surface_condition: string;
  defect_count: number;
  maintenance_recommendation: string | null;
  created_at: string;
}

export interface RoadCondition {
  id: string;
  analysis_id: string;
  location: string;
  condition_type: string;
  severity: 'low' | 'medium' | 'high';
  coordinates: [number, number];
  created_at: string;
}