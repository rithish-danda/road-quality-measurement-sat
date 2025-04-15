import React, { useState, useEffect } from 'react';
import { Upload, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useUpload } from '../hooks/useUpload';
import { useAnalysis } from '../hooks/useAnalysis';
import { uploadImage as apiUploadImage, checkModelStatus } from '../lib/api';
import type { Upload as UploadType } from '../types/database';

export default function Demo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentUpload, setCurrentUpload] = useState<UploadType | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [analysisText1, setAnalysisText1] = useState<string | null>(null);
  const [analysisText2, setAnalysisText2] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelAvailable, setModelAvailable] = useState<boolean | null>(null);
  const [modelPath, setModelPath] = useState<string>('');
  
  const { uploadImage, isUploading, error: uploadError } = useUpload();
  const { result: analysis, conditions, loading: analysisLoading, error: analysisError } = useAnalysis(currentUpload?.id ?? null);

  // Check if ML model is available
  useEffect(() => {
    const checkModel = async () => {
      try {
        const { modelAvailable, modelPath } = await checkModelStatus();
        setModelAvailable(modelAvailable);
        setModelPath(modelPath);
      } catch (error) {
        console.error('Failed to check model status:', error);
        setModelAvailable(false);
      }
    };
    
    checkModel();
  }, []);

  const isValidImageFormat = (file: File) => {
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/tiff'];
    return validFormats.includes(file.type.toLowerCase());
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isValidImageFormat(file)) {
        setError('Invalid file format. Please upload a JPEG, JPG, PNG, HEIC, HEIF, or TIFF image.');
        return;
      }
      setSelectedFile(file);
      setError(null);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!isValidImageFormat(file)) {
        setError('Invalid file format. Please upload a JPEG, JPG, PNG, HEIC, HEIF, or TIFF image.');
        return;
      }
      setSelectedFile(file);
      setError(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Add artificial delay for processing animation (5-7 seconds)
      await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 2000));
  
      const result = await apiUploadImage(selectedFile);
  
      setProcessedImageUrl(result.modified_image);
      setAnalysisText1(result.text_field1);
      setAnalysisText2(result.text_field2);
      
      // uploading to supabase
      const upload = await uploadImage(selectedFile);
      if (upload) {
        setCurrentUpload(upload);
      }
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setCurrentUpload(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setAnalysisText1(null);
    setAnalysisText2(null);
    setError(null);
  };

  if (uploadError || analysisError || error) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-4">{uploadError || analysisError || error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12">Road Quality Analysis Demo</h1>
        
        {modelAvailable === false && (
          <div className="max-w-4xl mx-auto mb-8 bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <p className="text-yellow-300 font-medium">ML model not found</p>
              <p className="text-yellow-400/80 text-sm mt-1">
                The ML model file (.pth) is not available. The system will use mock data for demonstration.
                {modelPath && (
                  <span className="block mt-1">
                    Please place your model file at: <code className="bg-black/30 px-1 py-0.5 rounded">{modelPath}</code>
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
        {modelAvailable === true && (
          <div className="max-w-4xl mx-auto mb-8 bg-green-900/30 border border-green-600 rounded-lg p-4 flex items-start">
            <div className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1">✓</div>
            <div>
              <p className="text-green-300 font-medium">ML model loaded successfully</p>
              <p className="text-green-400/80 text-sm mt-1">
                The road quality analysis model is ready for processing images.
              </p>
            </div>
          </div>
        )}
        
        {!processedImageUrl ? (
          <div 
            className="max-w-4xl mx-auto p-12 border-2 border-dashed border-gray-700 rounded-lg"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="fileInput"
              accept="image/*"
            />
            <label 
              htmlFor="fileInput"
              className="cursor-pointer block text-center"
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-xl mb-2">Drag and drop a satellite image here, or click to select</p>
              <p className="text-gray-500">Supported formats: JPEG, JPG, PNG, HEIC, HEIF, TIFF</p>
            </label>
            
            {selectedFile && (
              <div className="mt-8 text-center">
                <p className="text-gray-400 mb-4">{selectedFile.name}</p>
                {previewUrl && (
                  <div className="mb-4 max-w-md mx-auto">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-auto rounded-lg border border-gray-700"
                    />
                  </div>
                )}
                <button
                  onClick={handleAnalyze}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isProcessing || isUploading}
                >
                  {isProcessing || isUploading ? 'Processing...' : 'Analyze Image'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg p-8">
            <button
              onClick={handleReset}
              className="flex items-center text-gray-400 hover:text-white mb-8"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Analyze Another Image
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Original Image</h3>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Original satellite image"
                    className="w-full rounded-lg"
                  />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
                {processedImageUrl && (
                  <img
                    src={processedImageUrl}
                    alt="Processed image with annotations"
                    className="w-full rounded-lg mb-4"
                  />
                )}
                
                <div className="prose prose-invert">
                  <p>Road quality analysis complete:</p>
                  <ul>
                    <li>{analysisText1}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}