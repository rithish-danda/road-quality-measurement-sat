import sys
import torch
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

def load_model(model_path):
    try:
        print('Loading ML model...')
        model = torch.load(model_path)
        model.eval()
        print('ML model loaded successfully')
        return model
    except Exception as e:
        print(f'Error loading model: {e}')
        sys.exit(1)

def preprocess_image(image_path):
    try:
        print('Starting image preprocessing...')
        # Load and preprocess the image
        image = Image.open(image_path)
        print('Image loaded successfully')
        
        print('Applying image transformations...')
        # Define preprocessing transformations
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
        ])
        
        # Apply transformations
        input_tensor = transform(image)
        input_batch = input_tensor.unsqueeze(0)
        print('Image preprocessing completed')
        
        return input_batch
    except Exception as e:
        print(f'Error preprocessing image: {e}')
        sys.exit(1)

def process_output(output, original_image):
    try:
        print('Processing model output...')
        # Convert output tensor to numpy array and get the road class mask
        output_array = output.squeeze().detach().numpy()
        
        print('Generating road mask...')
        # Assuming output is a one-hot encoded mask, get the road class
        if len(output_array.shape) > 2:
            road_mask = output_array[1] if output_array.shape[0] > 1 else output_array[0]
        else:
            road_mask = output_array
            
        print('Resizing mask to match original image...')
        # Resize mask to match original image size
        original_size = original_image.size
        mask = Image.fromarray((road_mask * 255).astype(np.uint8))
        mask = mask.resize(original_size)
        
        print('Creating visualization overlay...')
        # Create RGBA overlay for the road segments
        overlay = np.zeros((*original_size[::-1], 4), dtype=np.uint8)
        mask_array = np.array(mask)
        
        # Set red color with 50% transparency for road segments
        overlay[mask_array > 127] = [255, 0, 0, 128]  # Red with 50% transparency
        
        # Convert original image to RGBA
        original_rgba = original_image.convert('RGBA')
        
        print('Compositing final image...')
        # Create overlay image and composite
        overlay_img = Image.fromarray(overlay)
        result = Image.alpha_composite(original_rgba, overlay_img)
        print('Image processing completed')
        
        return result
    except Exception as e:
        print(f'Error processing output: {e}')
        sys.exit(1)

def main():
    if len(sys.argv) != 4:
        print('Usage: python inference.py <input_image> <output_image> <model_path>')
        sys.exit(1)
        
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    model_path = sys.argv[3]
    
    try:
        print('Starting road analysis pipeline...')
        # Load model
        model = load_model(model_path)
        
        # Preprocess image
        input_tensor = preprocess_image(input_path)
        
        print('Running model inference...')
        # Run inference
        with torch.no_grad():
            output = model(input_tensor)
        print('Model inference completed')
        
        # Process output and save result
        original_image = Image.open(input_path).convert('RGBA')
        result_image = process_output(output, original_image)
        result_image.save(output_path)
        print('Analysis results saved successfully')
        
    except Exception as e:
        print(f'Error during inference: {e}')
        sys.exit(1)

if __name__ == '__main__':
    main()