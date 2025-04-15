import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Upload } from '../types/database';
import path from 'path';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<Upload | null> => {
    try {
      setIsUploading(true);
      setError(null);

      // Preserve the original file name
      const fileName = file.name;
      
      // Get the processed image path
      const processedImageName = fileName.replace(/\.(jpg|jpeg)$/i, '.png');
      const processedImagePath = `/config-folder/im-r/${processedImageName}`;
      
      // Create canvas to analyze the processed image
      const img = new Image();
      img.src = processedImagePath;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Count pink pixels (#fec9c9)
      let pinkPixels = 0;
      let totalPixels = data.length / 4;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (r === 254 && g === 201 && b === 201) {
          pinkPixels++;
        }
      }
      
      const damagePercentage = ((pinkPixels / totalPixels) * 100).toFixed(2);
      
      // Create a mock upload record with the processed image and damage percentage
      const mockUpload: Upload = {
        id: `local-${Date.now()}`,
        user_id: 'anonymous',
        image_url: processedImagePath,
        created_at: new Date().toISOString(),
        status: 'completed',
        damage_percentage: parseFloat(damagePercentage)
      };

      
      return mockUpload;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
}