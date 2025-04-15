# Road Quality Measurement using Satellite Images

## Overview
This project is an advanced web application that uses machine learning to analyze road conditions from satellite imagery. It helps infrastructure managers monitor road quality efficiently without the need for physical inspections.

## Features
- **ML-Powered Analysis**: Utilizes deep learning models (DeepLabV3+ and ResNet-50) to detect road defects
- **Interactive Demo**: Upload satellite images and receive instant road quality analysis
- **Visual Results**: View processed images with highlighted road defects
- **Quality Metrics**: Get quantitative measurements of road conditions

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Three.js (for 3D visualization)
- **Backend**: Express.js, Flask (for ML inference)
- **ML Processing**: PyTorch
- **Database**: Supabase

## Installation

### Prerequisites
- Node.js (v16+)
- Python 3.8+ (for ML model inference)
- PyTorch

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/road-quality-measurement.git
cd road-quality-measurement
```

2. Install dependencies
```bash
npm install
```

3. Set up Python environment (for ML inference)
```bash
pip install torch torchvision pillow numpy
```

4. Add your ML model
   - Place your trained PyTorch model (.pth file) in `src/server/models/`
   - The expected model file name is `road_segmentation_model.pth`

5. Create a `.env` file in the root directory with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Usage

### Development

1. Start the development server
```bash
npm run dev
```

2. Start the backend server
```bash
npm run server
```

3. Open your browser and navigate to `http://localhost:5173`

### Demo Usage

1. Navigate to the Demo page
2. Upload a satellite image of a road (supported formats: JPEG, PNG, TIFF, HEIC, HEIF)
3. Click "Analyze" to process the image
4. View the results showing road quality percentage and detected issues

## Project Structure

- `/src`: Frontend React application
  - `/components`: Reusable UI components
  - `/pages`: Application pages (Home, Demo, Info, LearnMore)
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions and API clients
  - `/server`: Backend Express server and ML inference code

## ML Model

The system uses a segmentation model to identify road surfaces and detect defects. If the model file is not available, the system will use mock data for demonstration purposes.

## License

This project is open source and available for personal and educational use.