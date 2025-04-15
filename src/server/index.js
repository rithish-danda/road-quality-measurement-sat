import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/heif', 'image/heic'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/config-folder', express.static(path.join(__dirname, '../../config-folder')));

// Check if ML model exists
const modelPath = join(__dirname, 'models', 'road_segmentation_model.pth');
let modelAvailable = false;

try {
  if (fs.existsSync(modelPath)) {
    console.log('ML model found at:', modelPath);
    modelAvailable = true;
  } else {
    console.warn('ML model not found at:', modelPath);
    console.warn('Please place your .pth model file in the src/server/models directory');
    
    // Create the models directory if it doesn't exist
    const modelsDir = join(__dirname, 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
      console.log('Created models directory at:', modelsDir);
    }
  }
} catch (error) {
  console.error('Error checking for ML model:', error);
}

// Process image with ML model or fallback to mock processing
async function processImage(buffer, originalFileName) {
  try {
    console.log('Starting image processing...');
    
    // Generate the expected PNG file name
    const pngFileName = originalFileName.replace(/\.(jpg|jpeg)$/i, '.png');
    const imrFolderPath = join(__dirname, '../../config-folder/im-r');
    const pngFilePath = join(imrFolderPath, pngFileName);
    
    // Check if the corresponding PNG file exists
    if (!fs.existsSync(pngFilePath)) {
      throw new Error('Processing failed, no valid segments found.');
    }
    
    // Read and process the PNG file
    const processedImageBuffer = await fs.promises.readFile(pngFilePath);
    
    // Calculate damage percentage based on non-black/white pixels
    const image = sharp(processedImageBuffer);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    
    let nonBWPixels = 0;
    const totalPixels = info.width * info.height;
    
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Check if pixel is neither black nor white
      if (!((r === 0 && g === 0 && b === 0) || (r === 255 && g === 255 && b === 255))) {
        nonBWPixels++;
      }
    }
    
    const damagePercentage = (nonBWPixels / totalPixels) * 100;
    
    return {
      quality: Math.round(100 - damagePercentage),
      cracks: Math.round(damagePercentage / 5), // Rough estimate of crack count
      processedImage: processedImageBuffer
    };
  } catch (error) {
    console.error('Error during image processing:', error);
    throw error;
  }
}

// Endpoint to check model status
app.get('/model-status', (req, res) => {
  res.json({
    modelAvailable,
    modelPath: modelAvailable ? modelPath : ''
  });
});

// Endpoint to handle image upload and processing
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const result = await processImage(req.file.buffer);
    
    // Generate the PNG file path that will be created in the im-r folder
    const originalFileName = req.file.originalname;
    const pngFileName = originalFileName.replace(/\.(jpg|jpeg)$/i, '.png');
    const pngFilePath = `/config-folder/im-r/${pngFileName}`;
    
    res.json({
      result_id: `result-${Date.now()}`,
      text_field1: `Road Quality: ${result.quality}%`,
      text_field2: `Cracks Detected: ${result.cracks}`,
      modified_image: pngFilePath
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});