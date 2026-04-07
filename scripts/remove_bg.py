from PIL import Image
import numpy as np

def remove_black_background(input_path, output_path):
    img = Image.open(input_path).convert('RGBA')
    arr = np.array(img)
    
    # Extract channels
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    
    # Calculate luminance
    luma = 0.299 * r + 0.587 * g + 0.114 * b
    
    # To drop pure black but maintain the glowing cyan edges perfectly, 
    # we map the luma to the alpha channel aggressively but with a smooth falloff.
    # Pixels where luma > 10 get some alpha, luma > 50 get full alpha.
    alpha_mask = np.clip((luma - 5) * 5, 0, 255).astype(np.uint8)
    
    # Drop alpha
    arr[:, :, 3] = np.minimum(a, alpha_mask)
    
    out = Image.fromarray(arr)
    out.save(output_path)
    print(f"Successfully processed {input_path} and saved transparent version to {output_path}")

import sys

if __name__ == "__main__":
    if len(sys.argv) == 3:
        remove_black_background(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python remove_bg.py <input> <output>")
