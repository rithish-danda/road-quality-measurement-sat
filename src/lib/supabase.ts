import { createClient } from '@supabase/supabase-js';
import type { Upload, AnalysisResult, RoadCondition } from '../types/database';

// Define database types for Supabase
type Database = {
  public: {
    Tables: {
      uploads: {
        Row: Upload;
      };
      analysis_results: {
        Row: AnalysisResult;
      };
      road_conditions: {
        Row: RoadCondition;
      };
    };
  };
};

// Get environment variables with fallbacks to prevent crashes
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Create a more resilient client initialization
let supabase;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Missing Supabase environment variables, using mock mode');
    // Create a mock client with methods that return empty data but don't crash
    supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Mock mode') }),
            limit: async () => ({ data: [], error: new Error('Mock mode') })
          }),
          limit: async () => ({ data: [], error: new Error('Mock mode') })
        })
      })
    };
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Provide a fallback mock client
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Mock mode') }),
          limit: async () => ({ data: [], error: new Error('Mock mode') })
        }),
        limit: async () => ({ data: [], error: new Error('Mock mode') })
      })
    })
  };
}

export { supabase };