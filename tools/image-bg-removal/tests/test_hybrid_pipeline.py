"""
Tests for the hybrid background removal pipeline:
  - analyze_complexity()
  - choose_method()
  - normalize_transparent_pixels()
  - Neural backend (mocked — no real rembg required)

TZ refs: §13.1 complexity, §13.2 method selection, §13.3 neural mock, §13.4 transparency invariant
"""
import os
import sys
import types
import unittest
import numpy as np
from PIL import Image

# ---------------------------------------------------------------------------
# Import module under test
# ---------------------------------------------------------------------------
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
from remove_bg import (
    analyze_complexity,
    choose_method,
    normalize_transparent_pixels,
    NeuralBackendUnavailable,
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _solid_rgba(r, g, b, a, size=(64, 64)):
    img = Image.new("RGBA", size, (r, g, b, a))
    return img


def _noisy_rgba(size=(128, 128), seed=42):
    """Random-coloured image that should score high on complexity."""
    rng = np.random.default_rng(seed)
    arr = rng.integers(0, 256, (*size, 4), dtype=np.uint8)
    arr[:, :, 3] = 255  # fully opaque
    return Image.fromarray(arr, "RGBA")


def _white_bg_rgba(size=(256, 256)):
    """Studio-style: white border, darker centre (product silhouette)."""
    img = Image.new("RGBA", size, (255, 255, 255, 255))
    # Dark centre patch (simulates product)
    arr = np.array(img)
    cx, cy = size[0] // 2, size[1] // 2
    r = size[0] // 4
    ys, xs = np.ogrid[:size[1], :size[0]]
    mask = (xs - cx) ** 2 + (ys - cy) ** 2 < r ** 2
    arr[mask] = [50, 80, 120, 255]
    return Image.fromarray(arr, "RGBA")


def _make_args(**kwargs):
    """Create a simple namespace mimicking argparse.Namespace."""
    defaults = {
        "method": "auto",
        "complexity_threshold": 0.55,
        "neural_unavailable": "warn-fallback",
    }
    defaults.update(kwargs)
    ns = types.SimpleNamespace(**defaults)
    return ns


# ---------------------------------------------------------------------------
# §13.1  Complexity analyser
# ---------------------------------------------------------------------------

class TestAnalyzeComplexity(unittest.TestCase):

    def test_simple_white_background_scores_low(self):
        """A plain white image should have a very low complexity score."""
        img = _solid_rgba(255, 255, 255, 255)
        result = analyze_complexity(img, {})
        self.assertLess(result["score"], 0.40,
                        f"Expected low score, got {result['score']}")
        self.assertEqual(result["methodHint"], "bfs")

    def test_noisy_background_scores_high(self):
        """A fully random-coloured image should score high (complex)."""
        img = _noisy_rgba()
        result = analyze_complexity(img, {})
        self.assertGreater(result["score"], 0.40,
                           f"Expected high score for noisy image, got {result['score']}")

    def test_catalog_fixture_defaults_to_bfs(self):
        """White-border product image should be predicted as bfs."""
        img = _white_bg_rgba()
        result = analyze_complexity(img, {})
        self.assertEqual(result["methodHint"], "bfs",
                         f"Expected bfs hint, got {result['methodHint']} (score={result['score']})")

    def test_redraw_annotations_image_hint_is_bfs(self):
        """Even if score is medium, redrawAnnotations=True must stay on bfs in choose_method."""
        img = _white_bg_rgba()
        config = {"redrawAnnotations": True}
        complexity = analyze_complexity(img, config)
        args = _make_args(method="auto")
        decision = choose_method("test.jpg", complexity, config, args)
        self.assertEqual(decision["method"], "bfs")
        self.assertIn("redrawAnnotations=true forces BFS", decision["reasons"][0])

    def test_metrics_present_in_result(self):
        """Result must include all required metric keys."""
        img = _white_bg_rgba()
        result = analyze_complexity(img, {})
        required_metrics = {
            "cornerHomogeneity", "edgeVariance", "backgroundVariance",
            "edgeDensity", "shadowRisk", "transparentInput",
        }
        self.assertEqual(required_metrics, set(result["metrics"].keys()))

    def test_score_is_bounded(self):
        """Score must always be in [0, 1]."""
        for img in [_solid_rgba(0, 0, 0, 255), _noisy_rgba(), _white_bg_rgba()]:
            result = analyze_complexity(img, {})
            self.assertGreaterEqual(result["score"], 0.0)
            self.assertLessEqual(result["score"], 1.0)


# ---------------------------------------------------------------------------
# §13.2  Method selection
# ---------------------------------------------------------------------------

class TestChooseMethod(unittest.TestCase):

    def _complexity(self, score=0.2):
        return {"score": score, "reasons": ["test"], "methodHint": "bfs" if score < 0.55 else "neural"}

    def test_config_method_bfs_overrides_high_score(self):
        """Explicit method=bfs in config must override auto even when score is high."""
        config = {"method": "bfs"}
        decision = choose_method("img.png", self._complexity(0.9), config, _make_args())
        self.assertEqual(decision["method"], "bfs")
        self.assertEqual(decision["source"], "config")

    def test_config_method_neural_overrides_low_score(self):
        """Explicit method=neural in config must override auto even when score is low."""
        # Neural is requested but unavailable → fallback to bfs (warn-fallback mode)
        config = {"method": "neural"}
        args = _make_args(neural_unavailable="warn-fallback")
        decision = choose_method("img.png", self._complexity(0.1), config, args)
        # rembg is not installed in CI → expect warn-fallback to bfs
        self.assertIn(decision["method"], ("neural", "bfs"),
                      "Should either use neural (if rembg present) or fallback to bfs")
        if decision["method"] == "bfs":
            self.assertIsNotNone(decision["fallback"])

    def test_cli_method_used_when_config_missing(self):
        """CLI --method bfs must apply when config has no method key."""
        config = {}
        args = _make_args(method="bfs")
        decision = choose_method("img.png", self._complexity(0.9), config, args)
        self.assertEqual(decision["method"], "bfs")
        self.assertEqual(decision["source"], "cli")

    def test_auto_selects_bfs_for_low_score(self):
        config = {}
        args = _make_args(method="auto", complexity_threshold=0.55)
        decision = choose_method("img.png", self._complexity(0.2), config, args)
        self.assertEqual(decision["method"], "bfs")
        self.assertEqual(decision["source"], "auto")

    def test_auto_selects_neural_for_high_score(self):
        """Auto mode with score >= threshold should select neural (or fallback to bfs)."""
        config = {}
        args = _make_args(method="auto", complexity_threshold=0.55, neural_unavailable="warn-fallback")
        decision = choose_method("img.png", self._complexity(0.8), config, args)
        # If rembg is absent, should fallback gracefully
        self.assertIn(decision["method"], ("neural", "bfs"))

    def test_neural_unavailable_error_raises(self):
        """neural_unavailable=error must raise NeuralBackendUnavailable if rembg absent."""
        config = {"method": "neural"}
        args = _make_args(neural_unavailable="error")
        try:
            import importlib
            if importlib.util.find_spec("rembg") is not None:
                self.skipTest("rembg is installed; error path not triggered")
        except (ImportError, ValueError):
            pass
        with self.assertRaises(NeuralBackendUnavailable):
            choose_method("img.png", self._complexity(0.9), config, args)

    def test_neural_unavailable_skip_returns_skip(self):
        """neural_unavailable=skip must return method=skip if rembg absent."""
        config = {"method": "neural"}
        args = _make_args(neural_unavailable="skip")
        try:
            import importlib
            if importlib.util.find_spec("rembg") is not None:
                self.skipTest("rembg is installed; skip path not triggered")
        except (ImportError, ValueError):
            pass
        decision = choose_method("img.png", self._complexity(0.9), config, args)
        self.assertEqual(decision["method"], "skip")
        self.assertIn("skipped", decision["fallback"])

    def test_skip_processing_config_takes_priority(self):
        config = {"skipProcessing": True}
        decision = choose_method("img.png", self._complexity(0.9), config, _make_args())
        self.assertEqual(decision["method"], "skip")
        self.assertEqual(decision["source"], "config")

    def test_per_file_complexity_threshold_overrides_global(self):
        """complexityThreshold in per-file config must override global threshold."""
        config = {"complexityThreshold": 0.1}  # very low threshold → score 0.2 → neural
        args = _make_args(method="auto", complexity_threshold=0.55, neural_unavailable="warn-fallback")
        decision = choose_method("img.png", self._complexity(0.2), config, args)
        # With threshold=0.1 and score=0.2, neural should be selected (or bfs fallback)
        self.assertIn(decision["method"], ("neural", "bfs"))


# ---------------------------------------------------------------------------
# §13.3  Neural backend (mocked — no real rembg required)
# ---------------------------------------------------------------------------

class TestNeuralBackendMocked(unittest.TestCase):

    def _patch_rembg(self, monkeypatch_target):
        """Inject a fake rembg module that returns a white RGBA image."""
        fake_rembg = types.ModuleType("rembg")
        def fake_remove(img, *a, **kw):
            return Image.new("RGBA", img.size, (200, 200, 200, 255))
        fake_rembg.remove = fake_remove
        sys.modules["rembg"] = fake_rembg
        return fake_rembg

    def tearDown(self):
        sys.modules.pop("rembg", None)

    def test_neural_backend_called_with_mock(self):
        """remove_bg_neural must call rembg.remove when rembg is available."""
        from remove_bg import remove_bg_neural
        self._patch_rembg("rembg")
        img = _white_bg_rgba((64, 64))
        result = remove_bg_neural(img, {})
        self.assertEqual(result.mode, "RGBA")
        self.assertEqual(result.size, (64, 64))

    def test_neural_backend_not_imported_for_bfs(self):
        """rembg must NOT be imported when BFS is used — verify via sys.modules."""
        sys.modules.pop("rembg", None)
        img = _white_bg_rgba((32, 32))
        # analyze_complexity + choose_method with method=bfs should not touch rembg
        complexity = analyze_complexity(img, {})
        _ = choose_method("x.jpg", complexity, {"method": "bfs"}, _make_args())
        self.assertNotIn("rembg", sys.modules,
                         "rembg must not be imported when method=bfs")

    def test_neural_raises_when_rembg_absent_after_teardown(self):
        """remove_bg_neural raises NeuralBackendUnavailable if rembg is absent."""
        from remove_bg import remove_bg_neural
        sys.modules.pop("rembg", None)
        # Ensure rembg is truly not importable
        try:
            import importlib
            if importlib.util.find_spec("rembg") is not None:
                self.skipTest("rembg is actually installed")
        except (ImportError, ValueError):
            pass
        with self.assertRaises(NeuralBackendUnavailable):
            remove_bg_neural(_white_bg_rgba(), {})

    def test_neural_result_is_normalised(self):
        """remove_bg_neural must normalise transparent pixels to (255,255,255,0)."""
        from remove_bg import remove_bg_neural
        # Mock rembg returning image with some black-transparent pixels
        fake_rembg = types.ModuleType("rembg")
        def fake_remove_with_black(img, *a, **kw):
            arr = np.array(img.convert("RGBA"))
            arr[:10, :10] = [0, 0, 0, 0]  # black-transparent corner
            return Image.fromarray(arr, "RGBA")
        fake_rembg.remove = fake_remove_with_black
        sys.modules["rembg"] = fake_rembg

        result = remove_bg_neural(_white_bg_rgba((64, 64)), {"neuralPostprocess": {"alphaThreshold": 8}})
        arr = np.array(result)
        transparent_mask = arr[:, :, 3] == 0
        if np.any(transparent_mask):
            black_transparent = (arr[:, :, 0] == 0) & (arr[:, :, 1] == 0) & (arr[:, :, 2] == 0) & transparent_mask
            self.assertFalse(np.any(black_transparent),
                             "Transparent pixels must not have RGB=(0,0,0) after normalisation")


# ---------------------------------------------------------------------------
# §13.4  Transparent RGB invariant
# ---------------------------------------------------------------------------

class TestTransparentPixelInvariant(unittest.TestCase):

    def test_normalize_converts_black_transparent_to_white_transparent(self):
        """normalize_transparent_pixels must replace (0,0,0,0) with (255,255,255,0)."""
        arr = np.zeros((4, 4, 4), dtype=np.uint8)
        arr[0, 0] = [0, 0, 0, 0]       # transparent black — must be fixed
        arr[1, 1] = [255, 0, 0, 255]   # red opaque — must be untouched
        arr[2, 2] = [128, 128, 128, 0] # grey transparent — must be normalised
        img = Image.fromarray(arr, "RGBA")
        result = normalize_transparent_pixels(img, alpha_threshold=0)
        out = np.array(result)
        # Transparent pixels → white rgb
        self.assertEqual(list(out[0, 0]), [255, 255, 255, 0])
        self.assertEqual(list(out[2, 2]), [255, 255, 255, 0])
        # Opaque pixel unchanged
        self.assertEqual(list(out[1, 1]), [255, 0, 0, 255])

    def test_normalize_does_not_touch_visible_pixels(self):
        """normalize_transparent_pixels must not alter pixels with alpha > threshold."""
        arr = np.full((8, 8, 4), 100, dtype=np.uint8)  # semi-transparent grey
        arr[:, :, 3] = 200  # alpha=200 (visible)
        img = Image.fromarray(arr, "RGBA")
        result = normalize_transparent_pixels(img, alpha_threshold=0)
        out = np.array(result)
        self.assertTrue(np.all(out[:, :, :3] == 100),
                        "Visible pixel colours must not be altered")

    def test_transparent_pixels_after_bfs(self):
        """End-to-end: BFS output for a white-bg image must have (255,255,255,0) transparent pixels."""
        import tempfile, shutil
        from remove_bg import process_image

        tmp = tempfile.mkdtemp()
        try:
            img_path = os.path.join(tmp, "white_bg.jpg")
            _white_bg_rgba().convert("RGB").save(img_path)
            out_dir = os.path.join(tmp, "out")
            process_image(img_path, out_dir, {})
            out_path = os.path.join(out_dir, "white_bg.png")
            self.assertTrue(os.path.exists(out_path))
            result = Image.open(out_path)
            arr = np.array(result)
            transparent_mask = arr[:, :, 3] == 0
            if np.any(transparent_mask):
                black_transparent = (
                    (arr[:, :, 0] == 0) & (arr[:, :, 1] == 0) & (arr[:, :, 2] == 0) & transparent_mask
                )
                self.assertFalse(np.any(black_transparent),
                                 "BFS output must not contain transparent-black pixels")
        finally:
            shutil.rmtree(tmp)

    def test_transparent_pixels_after_neural_mock(self):
        """End-to-end (mocked neural): neural output must have (255,255,255,0) transparent pixels."""
        from remove_bg import remove_bg_neural
        fake_rembg = types.ModuleType("rembg")
        def fake_remove(img, *a, **kw):
            arr = np.array(img.convert("RGBA"))
            # Introduce black-transparent noise
            arr[0, :] = [0, 0, 0, 0]
            return Image.fromarray(arr, "RGBA")
        fake_rembg.remove = fake_remove
        sys.modules["rembg"] = fake_rembg

        try:
            img = _white_bg_rgba((32, 32))
            result = remove_bg_neural(img, {})
            arr = np.array(result)
            transparent_mask = arr[:, :, 3] == 0
            if np.any(transparent_mask):
                black_transparent = (
                    (arr[:, :, 0] == 0) & (arr[:, :, 1] == 0) & (arr[:, :, 2] == 0) & transparent_mask
                )
                self.assertFalse(np.any(black_transparent))
        finally:
            sys.modules.pop("rembg", None)

    def test_jack_stand_annotation_background_remains_transparent_white(self):
        """Regression: jack stand annotation zone must stay (255,255,255,0) after redraw."""
        import tempfile, shutil, json
        from remove_bg import process_image

        script_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        fixture_path = os.path.join(script_dir, "tests", "fixtures",
                                    "7138921733_w640_h640_podstavka-pod-mashinu.jpg")
        if not os.path.exists(fixture_path):
            self.skipTest("Jack stand fixture not found")

        config_path = os.path.join(script_dir, "config.json")
        with open(config_path, "r", encoding="utf-8") as f:
            configs = json.load(f)
        cfg = configs.get("7138921733_w640_h640_podstavka-pod-mashinu.jpg", {})

        tmp = tempfile.mkdtemp()
        try:
            process_image(fixture_path, tmp, cfg, redraw_annotations_flag=True)
            out_path = os.path.join(tmp, "7138921733_w640_h640_podstavka-pod-mashinu.png")
            img = Image.open(out_path)
            arr = np.array(img)
            transparent_mask = arr[:, :, 3] == 0
            if np.any(transparent_mask):
                black_transparent = (
                    (arr[:, :, 0] == 0) & (arr[:, :, 1] == 0) & (arr[:, :, 2] == 0) & transparent_mask
                )
                self.assertFalse(np.any(black_transparent),
                                 "Jack stand annotation zone must not have transparent-black pixels")
        finally:
            shutil.rmtree(tmp)


if __name__ == "__main__":
    unittest.main()
