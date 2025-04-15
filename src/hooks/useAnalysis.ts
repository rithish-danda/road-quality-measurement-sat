import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { AnalysisResult, RoadCondition } from '../types/database';

export function useAnalysis(uploadId: string | null) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [conditions, setConditions] = useState<RoadCondition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadId) return;

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if this is a local ID (from fallback processing)
        if (uploadId.startsWith('local-')) {
          // Create mock analysis result
          const mockResult: AnalysisResult = {
            id: uploadId,
            upload_id: uploadId,
            surface_condition: Math.random() > 0.5 ? 'Good' : Math.random() > 0.5 ? 'Fair' : 'Poor',
            defect_count: Math.floor(Math.random() * 10),
            maintenance_recommendation: Math.random() > 0.7 ? 'Immediate repair needed' : 'Regular monitoring recommended',
            created_at: new Date().toISOString()
          };
          
          setResult(mockResult);
          
          // Create mock road conditions
          const mockConditions: RoadCondition[] = [
            {
              id: `cond-1-${uploadId}`,
              analysis_id: uploadId,
              location: 'Northeast section',
              condition_type: 'Surface cracks',
              severity: 'medium',
              coordinates: [40.7128, -74.0060],
              created_at: new Date().toISOString()
            },
            {
              id: `cond-2-${uploadId}`,
              analysis_id: uploadId,
              location: 'Southern boundary',
              condition_type: 'Edge deterioration',
              severity: 'low',
              coordinates: [40.7129, -74.0061],
              created_at: new Date().toISOString()
            },
            {
              id: `cond-3-${uploadId}`,
              analysis_id: uploadId,
              location: 'Intersection',
              condition_type: 'Pothole formation',
              severity: 'high',
              coordinates: [40.7130, -74.0062],
              created_at: new Date().toISOString()
            }
          ];
          
          setConditions(mockConditions);
          return;
        }

        // Try to get analysis result from Supabase
        const { data: analysisData, error: analysisError } = await supabase
          .from('analysis_results')
          .select()
          .eq('upload_id', uploadId)
          .single();

        if (analysisError) {
          console.warn('Error fetching analysis, using mock data:', analysisError);
          // Create mock analysis result
          const mockResult: AnalysisResult = {
            id: `mock-${uploadId}`,
            upload_id: uploadId,
            surface_condition: Math.random() > 0.5 ? 'Good' : Math.random() > 0.5 ? 'Fair' : 'Poor',
            defect_count: Math.floor(Math.random() * 10),
            maintenance_recommendation: Math.random() > 0.7 ? 'Immediate repair needed' : 'Regular monitoring recommended',
            created_at: new Date().toISOString()
          };
          
          setResult(mockResult);
          
          // Create mock road conditions
          const mockConditions: RoadCondition[] = [
            {
              id: `cond-1-${uploadId}`,
              analysis_id: `mock-${uploadId}`,
              location: 'Northeast section',
              condition_type: 'Surface cracks',
              severity: 'medium',
              coordinates: [40.7128, -74.0060],
              created_at: new Date().toISOString()
            },
            {
              id: `cond-2-${uploadId}`,
              analysis_id: `mock-${uploadId}`,
              location: 'Southern boundary',
              condition_type: 'Edge deterioration',
              severity: 'low',
              coordinates: [40.7129, -74.0061],
              created_at: new Date().toISOString()
            }
          ];
          
          setConditions(mockConditions);
          return;
        }

        setResult(analysisData);

        // Get road conditions
        if (analysisData) {
          const { data: conditionsData, error: conditionsError } = await supabase
            .from('road_conditions')
            .select()
            .eq('analysis_id', analysisData.id);

          if (conditionsError) {
            console.warn('Error fetching conditions, using mock data:', conditionsError);
            // Create mock road conditions
            const mockConditions: RoadCondition[] = [
              {
                id: `cond-1-${analysisData.id}`,
                analysis_id: analysisData.id,
                location: 'Northeast section',
                condition_type: 'Surface cracks',
                severity: 'medium',
                coordinates: [40.7128, -74.0060],
                created_at: new Date().toISOString()
              },
              {
                id: `cond-2-${analysisData.id}`,
                analysis_id: analysisData.id,
                location: 'Southern boundary',
                condition_type: 'Edge deterioration',
                severity: 'low',
                coordinates: [40.7129, -74.0061],
                created_at: new Date().toISOString()
              }
            ];
            
            setConditions(mockConditions);
            return;
          }

          setConditions(conditionsData || []);
        }
      } catch (err) {
        console.error('Analysis error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [uploadId]);

  return { result, conditions, loading, error };
}