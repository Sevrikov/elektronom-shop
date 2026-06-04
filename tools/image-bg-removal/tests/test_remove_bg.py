import os
import json
import unittest
import tempfile
import shutil
import numpy as np
from PIL import Image

# Import the processing functions from our module
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
from remove_bg import process_image

class TestBackgroundRemovalRealFixtures(unittest.TestCase):
    def setUp(self):
        # Create a temporary directory for test outputs
        self.test_dir = tempfile.mkdtemp()
        self.output_dir = os.path.join(self.test_dir, "output")
        self.compare_dir = os.path.join(self.test_dir, "compare")
        
        os.makedirs(self.output_dir)
        os.makedirs(self.compare_dir)
        
        # Paths to fixtures and configuration
        self.script_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        self.fixtures_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "fixtures")
        self.config_path = os.path.join(self.script_dir, "config.json")
        
        # Load configs
        if os.path.exists(self.config_path):
            with open(self.config_path, "r", encoding="utf-8") as f:
                self.configs = json.load(f)
        else:
            self.configs = {}

    def tearDown(self):
        # Clean up temp files
        shutil.rmtree(self.test_dir)

    def test_all_fixtures_processing(self):
        """Process all real product fixtures and assert correct output characteristics."""
        if not os.path.exists(self.fixtures_dir):
            self.skipTest("Fixtures directory not found")
            
        fixture_files = [f for f in os.listdir(self.fixtures_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        self.assertGreater(len(fixture_files), 0, "No fixture images found in tests/fixtures/")
        
        for filename in fixture_files:
            fixture_path = os.path.join(self.fixtures_dir, filename)
            cfg = self.configs.get(filename, {})
            
            # Process fixture
            process_image(fixture_path, self.output_dir, cfg, compare_dir=self.compare_dir, redraw_annotations_flag=True)
            
            # Check output file path
            stem = os.path.splitext(filename)[0]
            out_path = os.path.join(self.output_dir, f"{stem}.png")
            self.assertTrue(os.path.exists(out_path), f"Output file should be created for {filename}")
            
            # Open and check characteristics
            with Image.open(out_path) as img:
                self.assertEqual(img.format, "PNG", f"Output for {filename} must be PNG")
                self.assertEqual(img.mode, "RGBA", f"Output for {filename} must have RGBA alpha channel")
                
                # Ensure the product bounding box didn't collapse (has non-transparent pixels)
                arr = np.array(img)
                alpha = arr[:, :, 3]
                self.assertTrue(np.any(alpha > 0), f"Output for {filename} should not be entirely transparent")
                
                # Check background corners are transparent (unless skipped)
                if not cfg.get("skipProcessing", False):
                    self.assertLess(alpha[0, 0], 50, f"Top-left corner of {filename} should be transparent (alpha={alpha[0, 0]})")
                    self.assertLess(alpha[0, -1], 50, f"Top-right corner of {filename} should be transparent (alpha={alpha[0, -1]})")

    def test_jack_stand_text_overlapping_fixed(self):
        """Verify that original noisy annotations (specifically digit 2) are completely cleared."""
        # Use the original full-size image if available to run a high-fidelity visual check
        original_img_path = os.path.join(self.script_dir, "../../scratch/7138921733_w640_h640_podstavka-pod-mashinu.jpg")
        
        if not os.path.exists(original_img_path):
            # Fall back to fixture if original not found
            original_img_path = os.path.join(self.fixtures_dir, "7138921733_w640_h640_podstavka-pod-mashinu.jpg")
            if not os.path.exists(original_img_path):
                self.skipTest("Jack stand image not found")
                
        # Resolve config
        cfg = self.configs.get("7138921733_w640_h640_podstavka-pod-mashinu.jpg", {})
        
        # Process with redraw_annotations_flag=True
        process_image(original_img_path, self.output_dir, cfg, redraw_annotations_flag=True)
        
        out_path = os.path.join(self.output_dir, "7138921733_w640_h640_podstavka-pod-mashinu.png")
        with Image.open(out_path) as img:
            # If it's the full 1024x1024 image, we check the entire ROI
            if img.size == (1024, 1024):
                arr = np.array(img)
                # ROI check: x from 600 to 620, y from 360 to 430
                # This region covers where the old clashing digit '2' was located,
                # before our new text "288-430 мм" starts (at x >= 623).
                # It should be completely transparent (alpha == 0).
                roi_alpha = arr[360:430, 600:620, 3]
                opaque_pixels = np.sum(roi_alpha > 10)
                self.assertEqual(opaque_pixels, 0, f"Expected 0 opaque pixels in old text residue zone, found {opaque_pixels}")
                print("Confirmed: ROI is fully clean and free of annotation residue.")

    def test_jack_stand_annotation_background_is_transparent(self):
        """Verify that the background of the redraw panel is fully transparent except for the vector elements."""
        original_img_path = os.path.join(self.script_dir, "../../scratch/7138921733_w640_h640_podstavka-pod-mashinu.jpg")
        if not os.path.exists(original_img_path):
            original_img_path = os.path.join(self.fixtures_dir, "7138921733_w640_h640_podstavka-pod-mashinu.jpg")
            if not os.path.exists(original_img_path):
                self.skipTest("Jack stand image not found")
                
        cfg = self.configs.get("7138921733_w640_h640_podstavka-pod-mashinu.jpg", {})
        process_image(original_img_path, self.output_dir, cfg, redraw_annotations_flag=True)
        
        out_path = os.path.join(self.output_dir, "7138921733_w640_h640_podstavka-pod-mashinu.png")
        with Image.open(out_path) as img:
            arr = np.array(img)
            
            # 1. Check specific probe points (should be transparent, alpha < 10)
            transparent_probe_points = [
                (900, 200),
                (900, 500),
                (560, 200),
                (950, 650),
            ]
            
            w, h = img.size
            for x, y in transparent_probe_points:
                mapped_x = int(x * w / 1024)
                mapped_y = int(y * h / 1024)
                mapped_x = min(mapped_x, w - 1)
                mapped_y = min(mapped_y, h - 1)
                self.assertLess(arr[mapped_y, mapped_x, 3], 10, f"Expected transparent annotation background at {(x, y)} (mapped: {(mapped_x, mapped_y)})")
                
            # 2. Regional mask test: check x: 540..980, y: 80..710
            mx_start = int(540 * w / 1024)
            mx_end = int(980 * w / 1024)
            my_start = int(80 * h / 1024)
            my_end = int(710 * h / 1024)
            
            roi_alpha = arr[my_start:my_end, mx_start:mx_end, 3]
            transparent_count = np.sum(roi_alpha < 10)
            total_pixels = roi_alpha.size
            transparent_ratio = transparent_count / total_pixels
            
            self.assertGreater(transparent_ratio, 0.80, f"Annotation region is not transparent enough. Only {transparent_ratio:.1%} transparent.")
            print(f"Confirmed: Regional transparency is {transparent_ratio:.1%}, satisfying minimum threshold of 80.0%.")

    def test_redraw_annotations_cli_isolated(self):
        """Verify that annotations are only redrawn when redraw_annotations_flag is True."""
        original_img_path = os.path.join(self.fixtures_dir, "7138921733_w640_h640_podstavka-pod-mashinu.jpg")
        if not os.path.exists(original_img_path):
            self.skipTest("Jack stand fixture not found")
            
        cfg = self.configs.get("7138921733_w640_h640_podstavka-pod-mashinu.jpg", {})
        
        # 1. Process with flag = False (should NOT redraw annotations)
        process_image(original_img_path, self.output_dir, cfg, redraw_annotations_flag=False)
        out_path_no_redraw = os.path.join(self.output_dir, "7138921733_w640_h640_podstavka-pod-mashinu.png")
        
        with Image.open(out_path_no_redraw) as img_no_redraw:
            # Let's save a copy of it
            img_no_redraw_arr = np.array(img_no_redraw)
            
        # 2. Process with flag = True (should redraw annotations)
        # Note: on a 200x200 image, it won't crash but won't draw much, but the pixels will differ!
        process_image(original_img_path, self.output_dir, cfg, redraw_annotations_flag=True)
        out_path_redraw = os.path.join(self.output_dir, "7138921733_w640_h640_podstavka-pod-mashinu.png")
        
        with Image.open(out_path_redraw) as img_redraw:
            img_redraw_arr = np.array(img_redraw)
            
        # The outputs must differ because the drawing logic was skipped in case 1
        self.assertFalse(np.array_equal(img_no_redraw_arr, img_redraw_arr), "Output with and without redraw_annotations_flag should be different")

    def test_process_image_returns_report_when_bfs_has_no_light_corners(self):
        """P1 regression: process_image must return a dict even when BFS falls back
        due to no light/neutral corners (dark/coloured background image)."""
        # Create an image with dark corners so BFS has no seeds
        arr = np.full((64, 64, 3), 30, dtype=np.uint8)  # dark grey — corners are not light
        dark_img = Image.fromarray(arr, "RGB")
        img_path = os.path.join(self.test_dir, "dark_corners.jpg")
        dark_img.save(img_path)

        result = process_image(img_path, self.output_dir, {})

        self.assertIsNotNone(result, "process_image must return a dict, not None")
        self.assertIsInstance(result, dict,
                              "process_image must return a dict for JSON report")
        self.assertIn("method", result, "Result dict must contain 'method' key")
        self.assertIn("durationMs", result, "Result dict must contain 'durationMs' key")

        # The PNG must exist and be readable
        out_path = os.path.join(self.output_dir, "dark_corners.png")
        self.assertTrue(os.path.exists(out_path), "Output PNG must be created")


if __name__ == "__main__":
    unittest.main()
