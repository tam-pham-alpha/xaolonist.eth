import os
import sys
from PIL import Image

def crop_tarot_card_60_percent(img_path, output_path, left=25, right=447, top=148, total_height=729):
    """
    Crops a tarot card from a phone screenshot (472x1024) to keep only the top 60% of the card.
    Defaults are calibrated for standard Rider-Waite-Smith style screenshots.
    """
    print(f"Opening {img_path}...")
    try:
        img = Image.open(img_path)
        
        # Calculate 60% height
        crop_height = int(total_height * 0.60)
        bottom = top + crop_height
        
        crop_box = (left, top, right, bottom)
        cropped_img = img.crop(crop_box)
        cropped_img.save(output_path, "JPEG", quality=95)
        
        print(f"Successfully cropped top 60% of the card and saved to {output_path}")
        print(f"New size: {cropped_img.size}")
    except Exception as e:
        print(f"Error cropping image: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python crop_image.py <input_image_path> <output_image_path>")
        sys.exit(1)
        
    crop_tarot_card_60_percent(sys.argv[1], sys.argv[2])
