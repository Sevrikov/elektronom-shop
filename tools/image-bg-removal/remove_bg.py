import os
import sys
import argparse
import json
import time

# Check dependencies and fail gracefully with instructions
try:
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
except ImportError as e:
    print(f"Error: Missing required dependency. {e}")
    print("Please install requirements by running:")
    print("  pip install -r requirements.txt")
    sys.exit(1)


class NeuralBackendUnavailable(RuntimeError):
    """Raised when rembg/neural backend is requested but not installed."""
    pass


def normalize_transparent_pixels(img: "Image.Image", alpha_threshold: int = 0) -> "Image.Image":
    """
    Normalise all pixels with alpha <= alpha_threshold to (255, 255, 255, 0).
    Fully vectorised via NumPy — no per-pixel loop.
    Prevents transparent-black artefacts (black rectangles) after any pipeline method.
    """
    arr = np.array(img)
    mask = arr[:, :, 3] <= alpha_threshold
    arr[mask] = [255, 255, 255, 0]
    return Image.fromarray(arr, "RGBA")


def redraw_jack_stand_annotations(img):
    """
    Clears noisy, hand-drawn annotations from the jack stand diagram
    and draws high-quality vector circles, dashed lines, arrows, and labels.
    """
    width, height = img.size
    pixels = img.load()
    
    # 1. Clear the noisy annotations
    # Red circle badge region at left
    cx, cy, R_val = 233.5, 261.0, 128.0
    for y in range(int(cy - R_val - 10), int(cy + R_val + 10)):
        for x in range(int(cx - R_val - 10), int(cx + R_val + 10)):
            if 0 <= x < width and 0 <= y < height:
                if (x - cx)**2 + (y - cy)**2 < (R_val + 6)**2:
                    pixels[x, y] = (255, 255, 255, 0)
                    
    # Clear the entire right annotations region (from x=540 to 980, y=80 to 710)
    for y in range(80, 710):
        for x in range(540, 980):
            if 0 <= x < width and 0 <= y < height:
                pixels[x, y] = (255, 255, 255, 0)
                
    # Extra clearing for the horizontal dashed lines connection to the stand
    # Top line connection: x from 430 to 540, y from 120 to 136
    for y in range(120, 136):
        for x in range(430, 540):
            if 0 <= x < width and 0 <= y < height:
                pixels[x, y] = (255, 255, 255, 0)
                
    # Bottom line connection: x from 525 to 540, y from 654 to 670
    for y in range(654, 670):
        for x in range(525, 540):
            if 0 <= x < width and 0 <= y < height:
                pixels[x, y] = (255, 255, 255, 0)
                
    # 2. Draw clean vector graphics
    draw = ImageDraw.Draw(img)
    
    # Font path logic (cross-platform fallback)
    font_path = "C:/Windows/Fonts/arial.ttf"
    if not os.path.exists(font_path):
        font_path = "C:/Windows/Fonts/arialbd.ttf"
        if not os.path.exists(font_path):
            font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
            if not os.path.exists(font_path):
                font_path = None
                
    if font_path:
        try:
            font_badge = ImageFont.truetype(font_path, 130)
            font_text = ImageFont.truetype(font_path, 42)
        except Exception:
            font_badge = ImageFont.load_default()
            font_text = ImageFont.load_default()
    else:
        font_badge = ImageFont.load_default()
        font_text = ImageFont.load_default()
        
    # A. Draw the "3T" badge
    # Draw soft drop shadow
    draw.ellipse((cx - 124, cy - 124 + 3, cx + 124, cy + 124 + 3), fill=(0, 0, 0, 40))
    # Draw white outer ring
    draw.ellipse((cx - 121, cy - 121, cx + 121, cy + 121), fill=(255, 255, 255, 255))
    # Draw red circle
    red_color = (218, 12, 12, 255)
    draw.ellipse((cx - 114, cy - 114, cx + 114, cy + 114), fill=red_color)
    
    # Draw white text "3" and "T"
    try:
        draw.text((cx - 46, cy - 8), "3", fill=(255, 255, 255, 255), font=font_badge, anchor="mm")
        draw.text((cx + 42, cy - 8), "Т", fill=(255, 255, 255, 255), font=font_badge, anchor="mm")
    except Exception:
        # Fallback text drawing if anchor mm is not supported
        draw.text((cx - 60, cy - 50), "3", fill=(255, 255, 255, 255), font=font_badge)
        draw.text((cx + 20, cy - 50), "T", fill=(255, 255, 255, 255), font=font_badge)
        
    # B. Draw the arrows and text
    grey_color = (160, 160, 160, 255)
    x_grey = 684.5
    x_red = 781.5
    y_top_tip = 135.0
    y_bot_tip = 650.0
    y_mid_coord = 395.0
    text_gap = 60.0
    
    # Helper to draw vertical dashed line
    def draw_vertical_dashed(x, y1, y2, color, thickness=6):
        dash_len = 12
        gap_len = 10
        y_pos = y1
        while y_pos < y2:
            next_y = min(y_pos + dash_len, y2)
            draw.line([(x, y_pos), (x, next_y)], fill=color, width=thickness)
            y_pos = next_y + gap_len

    # Helper to draw horizontal dashed line
    def draw_horizontal_dashed(y, x1, x2, color, thickness=3):
        dash_len = 8
        gap_len = 6
        x_pos = x1
        while x_pos < x2:
            next_x = min(x_pos + dash_len, x2)
            draw.line([(x_pos, y), (next_x, y)], fill=color, width=thickness)
            x_pos = next_x + gap_len

    # Left grey dashed vertical arrow
    draw_vertical_dashed(x_grey, y_top_tip + 25, y_mid_coord - text_gap, grey_color, thickness=6)
    draw_vertical_dashed(x_grey, y_mid_coord + text_gap, y_bot_tip - 25, grey_color, thickness=6)
    
    # Right red solid vertical arrow
    draw.line([(x_red, y_top_tip + 25), (x_red, y_mid_coord - text_gap)], fill=red_color, width=16)
    draw.line([(x_red, y_mid_coord + text_gap), (x_red, y_bot_tip - 25)], fill=red_color, width=16)
    
    # Arrowheads (pointing up and down)
    # Grey up
    draw.polygon([(x_grey - 15, y_top_tip + 25), (x_grey + 15, y_top_tip + 25), (x_grey, y_top_tip)], fill=grey_color)
    # Grey down
    draw.polygon([(x_grey - 15, y_bot_tip - 25), (x_grey + 15, y_bot_tip - 25), (x_grey, y_bot_tip)], fill=grey_color)
    # Red up
    draw.polygon([(x_red - 20, y_top_tip + 25), (x_red + 20, y_top_tip + 25), (x_red, y_top_tip)], fill=red_color)
    # Red down
    draw.polygon([(x_red - 20, y_bot_tip - 25), (x_red + 20, y_bot_tip - 25), (x_red, y_bot_tip)], fill=red_color)
    
    # Horizontal dashed lines (connecting stand body to arrows)
    # Top dashed lines
    draw_horizontal_dashed(128.0, 430, x_grey, grey_color, thickness=3)
    draw_horizontal_dashed(128.0, x_grey, x_red + 40, red_color, thickness=3)
    # Bottom dashed lines
    draw_horizontal_dashed(662.0, 525, x_grey, grey_color, thickness=3)
    draw_horizontal_dashed(662.0, x_grey, x_red + 40, red_color, thickness=3)
    
    # C. Draw text "288-430 мм"
    try:
        draw.text((733.0, y_mid_coord), "288-430 мм", fill=(255, 255, 255, 255), 
                  font=font_text, anchor="mm", stroke_width=3, stroke_fill=(0, 0, 0, 255))
    except Exception:
        draw.text((650.0, y_mid_coord - 20), "288-430 мм", fill=(255, 255, 255, 255), 
                  font=font_text)


def analyze_complexity(img: "Image.Image", config: dict) -> dict:
    """
    Analyse image complexity to choose the background removal method.
    Returns a dict with score 0.0..1.0 and per-metric breakdown.

    Weights (from TZ §7):
        0.30  background_variance  (high variance on borders → complex bg)
        0.25  edge_density          (many edges near borders → textured bg)
        0.20  corner_mismatch       (corners differ from each other → inhomogeneous)
        0.15  fg_confidence_risk    (many bg-seed candidates missed → complex shape)
        0.10  shadow_risk           (dark gradient at bottom → natural lighting)
    """
    arr = np.array(img.convert("RGB"))
    h, w = arr.shape[:2]
    brightness = arr.mean(axis=2)

    reasons: list[str] = []

    # --- Metric 1: background variance along borders ---
    border_w = max(1, min(20, w // 20, h // 20))
    border_pixels = np.concatenate([
        brightness[:border_w, :].ravel(),
        brightness[-border_w:, :].ravel(),
        brightness[:, :border_w].ravel(),
        brightness[:, -border_w:].ravel(),
    ])
    bg_var = float(np.std(border_pixels))
    bg_var_score = min(1.0, bg_var / 60.0)
    if bg_var_score > 0.5:
        reasons.append(f"high border variance ({bg_var:.1f})")

    # --- Metric 2: edge density along borders ---
    dy = np.abs(np.diff(brightness, axis=0))
    dx = np.abs(np.diff(brightness, axis=1))
    edge_map = np.zeros_like(brightness)
    edge_map[:-1, :] += dy
    edge_map[:, :-1] += dx
    border_edge = np.concatenate([
        edge_map[:border_w, :].ravel(),
        edge_map[-border_w:, :].ravel(),
        edge_map[:, :border_w].ravel(),
        edge_map[:, -border_w:].ravel(),
    ])
    edge_density = float(np.mean(border_edge > 15))
    edge_density_score = min(1.0, edge_density / 0.25)
    if edge_density_score > 0.5:
        reasons.append(f"high edge density on borders ({edge_density:.2f})")

    # --- Metric 3: corner mismatch ---
    def corner_mean(sy, ey, sx, ex):
        patch = brightness[sy:ey, sx:ex]
        return float(np.mean(patch)) if patch.size > 0 else 128.0

    cs = max(5, min(15, w // 20, h // 20))
    c_tl = corner_mean(0, cs, 0, cs)
    c_tr = corner_mean(0, cs, w - cs, w)
    c_bl = corner_mean(h - cs, h, 0, cs)
    c_br = corner_mean(h - cs, h, w - cs, w)
    corners = [c_tl, c_tr, c_bl, c_br]
    corner_spread = float(np.std(corners))
    corner_mismatch_score = min(1.0, corner_spread / 40.0)
    # Also penalise if corners are not light (not studio-white)
    avg_corner = float(np.mean(corners))
    if avg_corner < 180:
        corner_mismatch_score = min(1.0, corner_mismatch_score + (180 - avg_corner) / 180.0)
        reasons.append(f"dark corners (avg brightness {avg_corner:.0f})")
    elif corner_spread > 20:
        reasons.append(f"heterogeneous corners (spread {corner_spread:.1f})")

    # --- Metric 4: foreground confidence risk ---
    # Fast coarse BFS seed count: if very few border pixels are "light",
    # BFS has few seeds → risk of incomplete fill
    light_border_ratio = float(np.mean(border_pixels > 180))
    fg_conf_risk = max(0.0, 1.0 - light_border_ratio * 2.0)
    if fg_conf_risk > 0.4:
        reasons.append(f"low light-border ratio ({light_border_ratio:.2f})")

    # --- Metric 5: shadow risk ---
    bottom_strip = brightness[int(h * 0.75):, :]
    top_strip = brightness[:int(h * 0.25), :]
    shadow_gradient = float(np.mean(top_strip)) - float(np.mean(bottom_strip))
    shadow_risk = min(1.0, max(0.0, shadow_gradient / 80.0))
    if shadow_risk > 0.5:
        reasons.append(f"strong top-to-bottom gradient ({shadow_gradient:.1f})")

    # --- Weighted total ---
    score = (
        0.30 * bg_var_score +
        0.25 * edge_density_score +
        0.20 * corner_mismatch_score +
        0.15 * fg_conf_risk +
        0.10 * shadow_risk
    )
    score = float(min(max(score, 0.0), 1.0))

    if not reasons:
        reasons.append("homogeneous corners, low border variance")

    method_hint = "neural" if score >= 0.55 else "bfs"

    return {
        "score": round(score, 4),
        "methodHint": method_hint,
        "reasons": reasons,
        "metrics": {
            "cornerHomogeneity": round(1.0 - corner_mismatch_score, 4),
            "edgeVariance": round(edge_density_score, 4),
            "backgroundVariance": round(bg_var_score, 4),
            "edgeDensity": round(edge_density_score, 4),
            "shadowRisk": round(shadow_risk, 4),
            "transparentInput": img.mode == "RGBA" and bool(
                np.any(np.array(img)[:, :, 3] < 255)
            ),
        },
    }


def perform_qa(orig_img: "Image.Image", cleaned_img: "Image.Image", config: dict) -> dict:
    """
    Perform QA on the processed image to check for:
    - Over-cutting (too much of the product is removed)
    - Holes (transparent regions inside the product)
    - Residual halo (bright/white pixels left on the borders)
    
    Returns a dict with metrics and a boolean qa_passed.
    """
    arr_cleaned = np.array(cleaned_img)
    arr_orig = np.array(orig_img.convert("RGBA"))
    
    h, w = arr_cleaned.shape[:2]
    
    # 1. Check Over-cutting (keep ratio of opaque pixels)
    cleaned_alpha = arr_cleaned[:, :, 3]
    cleaned_opaque = np.sum(cleaned_alpha > 10)
    
    # In original, estimate product pixels (not white background and alpha > 10)
    orig_alpha = arr_orig[:, :, 3]
    orig_rgb = arr_orig[:, :, :3]
    orig_brightness = np.mean(orig_rgb, axis=2)
    # Product pixels in original: alpha > 10 and not close to white background (brightness < 245)
    orig_opaque = np.sum((orig_alpha > 10) & (orig_brightness < 245))
    
    if orig_opaque > 100:
        keep_ratio = float(cleaned_opaque) / float(orig_opaque)
    else:
        keep_ratio = 1.0
        
    over_cutting = keep_ratio < 0.15 # if we deleted more than 85% of original opaque pixels
    
    # 2. Check Holes in Product
    # BFS from borders to find external background
    visited_bg = np.zeros((h, w), dtype=np.bool_)
    queue = []
    # Seeds: border pixels where alpha is 0
    for x in range(w):
        if cleaned_alpha[0, x] == 0:
            visited_bg[0, x] = True
            queue.append((x, 0))
        if cleaned_alpha[h-1, x] == 0:
            visited_bg[h-1, x] = True
            queue.append((x, h-1))
    for y in range(1, h-1):
        if cleaned_alpha[y, 0] == 0:
            visited_bg[y, 0] = True
            queue.append((0, y))
        if cleaned_alpha[y, w-1] == 0:
            visited_bg[y, w-1] = True
            queue.append((w-1, y))
            
    head = 0
    while head < len(queue):
        cx, cy = queue[head]
        head += 1
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h:
                if not visited_bg[ny, nx] and cleaned_alpha[ny, nx] == 0:
                    visited_bg[ny, nx] = True
                    queue.append((nx, ny))
                    
    # Inner holes: pixels with alpha == 0 that are NOT reached by external BFS
    inner_holes_mask = (cleaned_alpha == 0) & (~visited_bg)
    holes_count = int(np.sum(inner_holes_mask))
    
    # Holes fail if size is larger than threshold
    holes_fail = holes_count > config.get("qaMaxHoleSize", 1200)
    
    # 3. Check Residual Halo (white/bright borders)
    boundary_mask = np.zeros((h, w), dtype=np.bool_)
    
    # Simple check for neighbors
    if h > 2 and w > 2:
        alpha_low_neighbors = (
            (cleaned_alpha[1:-1, 1:-1] > 50) & (
                (cleaned_alpha[:-2, 1:-1] <= 50) |
                (cleaned_alpha[2:, 1:-1] <= 50) |
                (cleaned_alpha[1:-1, :-2] <= 50) |
                (cleaned_alpha[1:-1, 2:] <= 50)
            )
        )
        boundary_mask[1:-1, 1:-1] = alpha_low_neighbors
        
    boundary_count = np.sum(boundary_mask)
    halo_count = 0
    halo_ratio = 0.0
    if boundary_count > 0:
        orig_boundary_brightness = orig_brightness[boundary_mask]
        halo_count = np.sum(orig_boundary_brightness > 230)
        halo_ratio = float(halo_count) / float(boundary_count)
        
    halo_fail = halo_ratio > 0.25 # if more than 25% of boundary pixels are bright halos
    
    qa_passed = not (over_cutting or holes_fail or halo_fail)
    
    return {
        "qaPassed": qa_passed,
        "metrics": {
            "keepRatio": round(keep_ratio, 4),
            "holesCount": holes_count,
            "haloRatio": round(halo_ratio, 4),
            "overCutting": over_cutting,
            "holesFail": holes_fail,
            "haloFail": halo_fail
        }
    }


def choose_method(filename: str, complexity: dict, config: dict, args) -> dict:
    """
    Decide which method to use for a given file.

    Priority order (TZ §5, §8):
        skipProcessing / method=skip
          > explicit method in per-file config
          > CLI --method (when config does NOT specify method)
          > auto complexity detection

    Returns dict: {method, source, complexityScore, threshold, reasons, fallback}
    """
    threshold = float(
        config.get("complexityThreshold", None) or
        getattr(args, "complexity_threshold", 0.55) or
        0.55
    )
    score = complexity["score"]
    reasons = list(complexity["reasons"])
    fallback = None

    # --- Priority 0: skip ---
    if config.get("skipProcessing", False) or config.get("method") == "skip":
        return {
            "method": "skip", "source": "config",
            "complexityScore": score, "threshold": threshold,
            "reasons": reasons, "fallback": None,
        }

    # --- Priority 1: explicit per-file config method ---
    config_method = config.get("method")  # "bfs" | "neural" | "auto" | None
    if config_method and config_method not in ("auto", None):
        method = config_method
        source = "config"
    else:
        # --- Priority 2: CLI override ---
        cli_method = getattr(args, "method", "auto") or "auto"
        if cli_method != "auto":
            method = cli_method
            source = "cli"
        else:
            # --- Priority 3: auto detection ---
            source = "auto"
            # TZ §8 rule: redrawAnnotations forces BFS in auto
            if config.get("redrawAnnotations", False):
                method = "bfs"
                reasons = ["redrawAnnotations=true forces BFS"] + reasons
            elif score >= threshold:
                method = "neural"
                reasons = [f"complexity score {score:.2f} >= threshold {threshold}"] + reasons
            else:
                method = "bfs"

    # --- Check neural availability ---
    if method == "neural":
        try:
            import importlib
            importlib.util.find_spec("rembg")
            if importlib.util.find_spec("rembg") is None:
                raise ImportError
        except (ImportError, ValueError):
            na_mode = (
                config.get("neuralUnavailable") or
                getattr(args, "neural_unavailable", "warn-fallback") or
                "warn-fallback"
            )
            if na_mode == "error":
                raise NeuralBackendUnavailable(
                    f"Neural backend required for {filename!r} but rembg is not installed.\n"
                    "Install: pip install -r tools/image-bg-removal/requirements-neural.txt"
                )
            elif na_mode == "skip":
                return {
                    "method": "skip", "source": source,
                    "complexityScore": score, "threshold": threshold,
                    "reasons": reasons,
                    "fallback": "neural unavailable, file skipped",
                }
            else:  # warn-fallback (default)
                print(
                    f"  WARNING: Neural backend requested but rembg is not installed.\n"
                    f"  Fallback: bfs\n"
                    f"  Install: pip install -r tools/image-bg-removal/requirements-neural.txt"
                )
                fallback = "neural unavailable, used bfs"
                method = "bfs"

    return {
        "method": method, "source": source,
        "complexityScore": score, "threshold": threshold,
        "reasons": reasons, "fallback": fallback,
    }


def remove_bg_neural(img: "Image.Image", config: dict) -> "Image.Image":
    """
    Remove background using rembg / U2-Net.
    Lazy-imports rembg — does NOT require it at module load time.
    Raises NeuralBackendUnavailable if rembg is not installed.
    """
    try:
        from rembg import remove as rembg_remove  # type: ignore
    except ImportError as exc:
        raise NeuralBackendUnavailable(
            "rembg is not installed. "
            "Run: pip install -r tools/image-bg-removal/requirements-neural.txt"
        ) from exc

    result = rembg_remove(img)
    if result.mode != "RGBA":
        result = result.convert("RGBA")

    # Apply postprocess settings from config
    np_cfg = config.get("neuralPostprocess", {})
    alpha_thr = int(np_cfg.get("alphaThreshold", 8))
    return normalize_transparent_pixels(result, alpha_threshold=alpha_thr)


def make_4way_comparison(orig_img, transparent_img, output_path, filename):
    """
    Generates a 2x2 comparison grid (Verification Sheet) showing the transparent image on:
    1. Dark background (#121212)
    2. White background (#FFFFFF)
    3. Checkerboard pattern
    4. Card background (#1E1E24)
    """
    w, h = 400, 400
    orig_r = orig_img.resize((w, h), Image.Resampling.LANCZOS)
    trans_r = transparent_img.resize((w, h), Image.Resampling.LANCZOS)
    
    grid = Image.new("RGBA", (840, 920), (30, 30, 30, 255))
    
    def create_checkerboard(width, height, box_size=16):
        cb = Image.new("RGBA", (width, height), (255, 255, 255, 255))
        cb_draw = ImageDraw.Draw(cb)
        for y in range(0, height, box_size):
            for x in range(0, width, box_size):
                if ((x // box_size) + (y // box_size)) % 2 == 1:
                    cb_draw.rectangle([x, y, x + box_size, y + box_size], fill=(220, 220, 220, 255))
        return cb

    bg_dark = Image.new("RGBA", (w, h), (18, 18, 18, 255))
    bg_white = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    bg_check = create_checkerboard(w, h, 20)
    bg_card = Image.new("RGBA", (w, h), (30, 30, 36, 255))
    
    bg_dark.paste(trans_r, (0, 0), trans_r)
    bg_white.paste(trans_r, (0, 0), trans_r)
    bg_check.paste(trans_r, (0, 0), trans_r)
    bg_card.paste(trans_r, (0, 0), trans_r)
    
    grid.paste(bg_dark, (10, 50))
    grid.paste(bg_white, (430, 50))
    grid.paste(bg_check, (10, 480))
    grid.paste(bg_card, (430, 480))
    
    draw = ImageDraw.Draw(grid)
    
    font_path = "C:/Windows/Fonts/arial.ttf"
    if not os.path.exists(font_path):
        font_path = "C:/Windows/Fonts/arialbd.ttf"
        if not os.path.exists(font_path):
            font_path = None

    if font_path:
        try:
            font = ImageFont.truetype(font_path, 20)
            font_title = ImageFont.truetype(font_path, 24)
        except Exception:
            font = ImageFont.load_default()
            font_title = ImageFont.load_default()
    else:
        font = ImageFont.load_default()
        font_title = ImageFont.load_default()
        
    try:
        draw.text((420, 25), f"Verification Sheet: {filename}", fill=(255, 255, 255, 255), font=font_title, anchor="mm")
        draw.text((210, 460), "1. Dark Theme (#121212)", fill=(255, 255, 255, 255), font=font, anchor="mm")
        draw.text((630, 460), "2. White Background (#FFFFFF)", fill=(255, 255, 255, 255), font=font, anchor="mm")
        draw.text((210, 890), "3. Checkerboard Mask View", fill=(255, 255, 255, 255), font=font, anchor="mm")
        draw.text((630, 890), "4. Card Background (#1E1E24)", fill=(255, 255, 255, 255), font=font, anchor="mm")
    except Exception:
        # Fallback if anchor is not supported by load_default()
        draw.text((220, 15), f"Verification Sheet: {filename}", fill=(255, 255, 255, 255), font=font_title)
        draw.text((10, 450), "1. Dark Theme (#121212)", fill=(255, 255, 255, 255), font=font)
        draw.text((430, 450), "2. White Background (#FFFFFF)", fill=(255, 255, 255, 255), font=font)
        draw.text((10, 880), "3. Checkerboard Mask View", fill=(255, 255, 255, 255), font=font)
        draw.text((430, 880), "4. Card Background (#1E1E24)", fill=(255, 255, 255, 255), font=font)
        
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    grid.save(output_path, "PNG")

def process_image(image_path, output_dir, config, compare_dir=None, redraw_annotations_flag=False, args=None):
    """Process a single image. Returns a report dict for --write-report."""
    # args may be None when called from tests (legacy compatibility)
    filename = os.path.basename(image_path)
    stem = os.path.splitext(filename)[0]
    out_filename = f"{stem}.png"
    out_path = os.path.join(output_dir, out_filename)

    img = Image.open(image_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    width, height = img.size

    # --- Complexity analysis & method selection ---
    complexity = analyze_complexity(img, config)
    method_decision = choose_method(filename, complexity, config, args or type('_Args', (), {"method": "auto", "complexity_threshold": 0.55, "neural_unavailable": "warn-fallback"})())
    method = method_decision["method"]
    score = method_decision["complexityScore"]
    source = method_decision["source"]

    print(f"Processing image: {filename} -> {out_filename}")
    print(f"  Complexity score: {score:.2f} | Method: {method} (source: {source})")
    print(f"  Reasons: {'; '.join(method_decision['reasons'][:3])}")
    if method_decision.get("fallback"):
        print(f"  Fallback: {method_decision['fallback']}")

    # --- Skip path ---
    if method == "skip" or config.get("skipProcessing", False):
        print(f"  Skipping background removal per config. Converting to PNG.")
        img = normalize_transparent_pixels(img)
        img.save(out_path, "PNG")
        if compare_dir:
            comp_path = os.path.join(compare_dir, f"comp_{stem}.png")
            make_4way_comparison(Image.open(image_path).convert('RGBA'), img, comp_path, filename)
        return method_decision
        
    t_start = time.time()

    # --- Neural path (rembg / U2-Net) ---
    if method == "neural":
        img = remove_bg_neural(img, config)
        if redraw_annotations_flag and config.get("redrawAnnotations", False):
            print("  Running vector annotation redraw for jack stand diagram...")
            redraw_jack_stand_annotations(img)
            
        # Run QA Gate
        orig_img_conv = Image.open(image_path)
        qa_result = perform_qa(orig_img_conv, img, config)
        method_decision["qa"] = qa_result
        print(f"  QA Result: {'PASSED' if qa_result['qaPassed'] else 'FAILED'} (keepRatio: {qa_result['metrics']['keepRatio']:.2f}, holes: {qa_result['metrics']['holesCount']}, haloRatio: {qa_result['metrics']['haloRatio']:.2f})")
        
        duration_ms = int((time.time() - t_start) * 1000)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        img.save(out_path, "PNG")
        print(f"  Saved cleaned image (neural): {out_path} ({duration_ms / 1000:.2f}s)")
        if compare_dir:
            comp_path = os.path.join(compare_dir, f"comp_{stem}.png")
            make_4way_comparison(Image.open(image_path).convert("RGBA"), img, comp_path, filename)
            print(f"  Saved comparison sheet: {comp_path}")
        method_decision["durationMs"] = duration_ms
        return method_decision

    # --- BFS path (deterministic algorithm) ---
    # Convert image to numpy array for fast vectorized computations
    arr = np.array(img)
    R, G, B, A = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    brightness = (R.astype(np.int32) + G.astype(np.int32) + B.astype(np.int32)) / 3.0

    # 1. Corner sampling
    def sample_corner(sx, sy):
        r_vals = R[sy:sy+3, sx:sx+3]
        g_vals = G[sy:sy+3, sx:sx+3]
        b_vals = B[sy:sy+3, sx:sx+3]
        if r_vals.size == 0:
            return None
        return (np.mean(r_vals), np.mean(g_vals), np.mean(b_vals))

    corners = [
        sample_corner(2, 2),
        sample_corner(width - 5, 2),
        sample_corner(2, height - 5),
        sample_corner(width - 5, height - 5)
    ]
    
    valid_corners = []
    for c in corners:
        if c is not None:
            r, g, b = c
            max_c = max(r, g, b)
            min_c = min(r, g, b)
            if (max_c - min_c) <= 15 and min_c >= 180:
                valid_corners.append(c)
                
    if not valid_corners:
        print(f"  Warning: No light/neutral background at corners. Copying to PNG.")
        img = normalize_transparent_pixels(img)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        img.save(out_path, "PNG")
        method_decision["fallback"] = "no light corners, copied as-is"
        method_decision["durationMs"] = int((time.time() - t_start) * 1000)
        return method_decision

    avg_bg = np.mean([np.mean(c) for c in valid_corners])
    
    # 2. Coarse BFS using boolean array to locate product bounds
    coarse_thresh = max(180, int(avg_bg - 15))
    visited_coarse = np.zeros((height, width), dtype=np.bool_)
    
    # Find initial seed white pixels on borders
    queue = []
    is_border_white = (brightness >= coarse_thresh)
    
    # Top and bottom row seeds
    for x in range(width):
        if is_border_white[0, x]:
            visited_coarse[0, x] = True
            queue.append((x, 0))
        if is_border_white[height - 1, x]:
            visited_coarse[height - 1, x] = True
            queue.append((x, height - 1))
    # Left and right column seeds
    for y in range(1, height - 1):
        if is_border_white[y, 0]:
            visited_coarse[y, 0] = True
            queue.append((0, y))
        if is_border_white[y, width - 1]:
            visited_coarse[y, width - 1] = True
            queue.append((width - 1, y))
            
    head = 0
    while head < len(queue):
        cx, cy = queue[head]
        head += 1
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                if not visited_coarse[ny, nx] and is_border_white[ny, nx]:
                    visited_coarse[ny, nx] = True
                    queue.append((nx, ny))
                    
    # Find bounding box of unvisited (product) pixels
    ys, xs = np.where(~visited_coarse)
    if ys.size == 0:
        min_y, max_y = 0, height
    else:
        min_y, max_y = int(np.min(ys)), int(np.max(ys))
        
    product_h = max_y - min_y
    y_top = min_y + product_h * 0.4
    y_mid = min_y + product_h * config.get("floorShadowY", 0.75)
    y_bot = max_y + 10
    
    # 3. Distance Transform
    dist = np.full((height, width), 99999, dtype=np.int32)
    
    for y in range(height):
        outline_thresh = 220
        if y >= y_mid:
            pct = (y - y_mid) / (y_bot - y_mid) if y_bot > y_mid else 1.0
            min_thresh = config.get("outlineThreshMin", 110)
            outline_thresh = 220 - (220 - min_thresh) * min(1.0, pct)
            
        row_brightness = brightness[y, :]
        row_alpha = A[y, :]
        outline_mask = (row_alpha < 10) | (row_brightness < outline_thresh)
        dist[y, outline_mask] = 0

    # Chamfer distance pass 1 (forward)
    for y in range(height):
        for x in range(width):
            d = dist[y, x]
            if x > 0: d = min(d, dist[y, x - 1] + 1)
            if y > 0: d = min(d, dist[y - 1, x] + 1)
            dist[y, x] = d

    # Chamfer distance pass 2 (backward)
    for y in range(height - 1, -1, -1):
        for x in range(width - 1, -1, -1):
            d = dist[y, x]
            if x < width - 1: d = min(d, dist[y, x + 1] + 1)
            if y < height - 1: d = min(d, dist[y + 1, x] + 1)
            dist[y, x] = d

    # 4. Fine BFS with dynamic outline threshold and distance blocker
    t_top = max(180, int(avg_bg - 15))
    t_mid = max(180, int(avg_bg - 30))
    t_bot = config.get("tBot", max(120, int(avg_bg - 130)))
    
    def get_outer_thresh(y):
        if y <= y_top: return t_top
        if y >= y_bot: return t_bot
        if y < y_mid:
            pct = (y - y_top) / (y_mid - y_top)
            return t_top + (t_mid - t_top) * pct
        else:
            pct = (y - y_mid) / (y_bot - y_mid)
            return t_mid + (t_bot - t_mid) * pct

    dist_block = config.get("distBlock", 3)
    
    def is_outer_white(x, y):
        a_val = A[y, x]
        if a_val < 10: return True
        
        # Dynamic distBlock below y_mid to clean shadows near bottom feet!
        curr_dist_block = dist_block
        if y >= y_mid:
            pct = min(1.0, (y - y_mid) / (y_bot - y_mid)) if y_bot > y_mid else 1.0
            curr_dist_block = max(1, int(dist_block - (dist_block - 1) * pct))
            
        if dist[y, x] <= curr_dist_block:
            return False
            
        thresh = get_outer_thresh(y)
        return R[y, x] >= thresh and G[y, x] >= thresh and B[y, x] >= thresh

    # visited mask: 0=unvisited, 1=background, 2=product, 4=candidate hole
    visited = np.zeros((height, width), dtype=np.uint8)
    queue = []
    
    # Initialize border seeds for fine BFS
    for x in range(width):
        if is_outer_white(x, 0):
            visited[0, x] = 1
            queue.append((x, 0))
        if is_outer_white(x, height - 1):
            visited[height - 1, x] = 1
            queue.append((x, height - 1))
    for y in range(1, height - 1):
        if is_outer_white(0, y):
            visited[y, 0] = 1
            queue.append((0, y))
        if is_outer_white(width - 1, y):
            visited[y, width - 1] = 1
            queue.append((width - 1, y))
            
    head = 0
    while head < len(queue):
        cx, cy = queue[head]
        head += 1
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                if visited[ny, nx] == 0 and is_outer_white(nx, ny):
                    visited[ny, nx] = 1
                    queue.append((nx, ny))

    # 5. Topologically Constrained Margin Expansion
    expansion_queue = []
    for y in range(height):
        for x in range(width):
            if visited[y, x] == 1:
                # Find border pixels of background
                has_unvisited = False
                for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if visited[ny, nx] == 0:
                            has_unvisited = True
                            break
                if has_unvisited:
                    expansion_queue.append((x, y))

    head = 0
    min_expansion_dist = 2 if dist_block > 0 else -1
    while head < len(expansion_queue):
        cx, cy = expansion_queue[head]
        head += 1
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                if visited[ny, nx] == 0:
                    if brightness[ny, nx] >= coarse_thresh and dist[ny, nx] > min_expansion_dist:
                        visited[ny, nx] = 1
                        expansion_queue.append((nx, ny))

    # 6. Inner Holes Detection (hollowing internal holes)
    inner_thresh = max(235, int(avg_bg - 5))
    min_hole_size = config.get("minHoleSize", 800)
    
    def is_inner_white(x, y):
        a_val = A[y, x]
        if a_val < 10: return True
        return R[y, x] >= inner_thresh and G[y, x] >= inner_thresh and B[y, x] >= inner_thresh

    for y in range(height):
        for x in range(width):
            if visited[y, x] == 0 and is_inner_white(x, y):
                comp = []
                comp_queue = [(x, y)]
                visited[y, x] = 4
                
                comp_head = 0
                touches_outer = False
                
                while comp_head < len(comp_queue):
                    cx, cy = comp_queue[comp_head]
                    comp_head += 1
                    comp.append((cx, cy))
                    
                    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            val = visited[ny, nx]
                            if val == 1:
                                touches_outer = True
                            elif val == 0 and is_inner_white(nx, ny):
                                visited[ny, nx] = 4
                                comp_queue.append((nx, ny))
                
                if not touches_outer and len(comp) >= min_hole_size:
                    for px, py in comp: visited[py, px] = 1
                else:
                    for px, py in comp: visited[py, px] = 2

    # 7. PIL Image Modification & Fringe Cleanup
    pixels_out = img.load()
    do_edge_cleanup = config.get("edgeCleanup", True)
    if dist_block > 0:
        # Default edgeCleanup to False for diagrams/thin lines to prevent erosion
        do_edge_cleanup = config.get("edgeCleanup", False)
        
    for y in range(height):
        for x in range(width):
            status = visited[y, x]
            if status == 1:
                # Background pixel
                product_neighbors = 0
                for dy in range(-1, 2):
                    for dx in range(-1, 2):
                        if dx == 0 and dy == 0: continue
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            n_status = visited[ny, nx]
                            if n_status != 1 and n_status != 4:
                                product_neighbors += 1
                r, g, b, a = R[y, x], G[y, x], B[y, x], A[y, x]
                if product_neighbors > 0:
                    pixels_out[x, y] = (r, g, b, min(255, 32 * product_neighbors))
                else:
                    pixels_out[x, y] = (r, g, b, 0)
            elif status != 4 and do_edge_cleanup:
                # Product pixel (feathering edge)
                bg_neighbors = 0
                for dy in range(-1, 2):
                    for dx in range(-1, 2):
                        if dx == 0 and dy == 0: continue
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if visited[ny, nx] == 1:
                                bg_neighbors += 1
                if bg_neighbors > 0:
                    r, g, b, a = R[y, x], G[y, x], B[y, x], A[y, x]
                    min_chan = min(r, g, b)
                    if min_chan > 150:
                        new_alpha = max(0, int(255 - 200 * (bg_neighbors / 8.0)))
                        pixels_out[x, y] = (r, g, b, new_alpha)

    # 8. Special redrawing logic for jack stands to ensure crystal clear vector annotations
    if redraw_annotations_flag and config.get("redrawAnnotations", False):
        print("  Running vector annotation redraw for jack stand diagram...")
        redraw_jack_stand_annotations(img)

    # 9. Always normalise transparent pixels to (255,255,255,0) — prevents black-rectangle artefacts
    img = normalize_transparent_pixels(img)

    # Run QA Gate
    orig_img_conv = Image.open(image_path)
    qa_result = perform_qa(orig_img_conv, img, config)
    method_decision["qa"] = qa_result
    print(f"  QA Result: {'PASSED' if qa_result['qaPassed'] else 'FAILED'} (keepRatio: {qa_result['metrics']['keepRatio']:.2f}, holes: {qa_result['metrics']['holesCount']}, haloRatio: {qa_result['metrics']['haloRatio']:.2f})")

    # Save final output as transparent PNG
    duration_ms = int((time.time() - t_start) * 1000)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "PNG")
    print(f"  Saved cleaned image: {out_path} ({duration_ms / 1000:.2f}s)")

    # 10. Comparison verification sheet
    if compare_dir:
        comp_path = os.path.join(compare_dir, f"comp_{stem}.png")
        make_4way_comparison(Image.open(image_path).convert('RGBA'), img, comp_path, filename)
        print(f"  Saved comparison sheet: {comp_path}")

    method_decision["durationMs"] = duration_ms
    return method_decision

def main():
    parser = argparse.ArgumentParser(description=" Elektronom Image Background Removal Tool")
    parser.add_argument("--input", default=None, help="Path to input file or directory")
    parser.add_argument("--output", default=None, help="Path to output directory")
    parser.add_argument("--config", default=None, help="Path to config.json file")
    parser.add_argument("--compare", action="store_true", help="Generate 4-way comparison sheets")
    parser.add_argument("--force", action="store_true", help="Force overwrite existing outputs")
    parser.add_argument("--redraw-annotations", action="store_true", help="Enable vector annotation redrawing for supported images")
    # Hybrid pipeline flags
    parser.add_argument("--method", default="auto", choices=["auto", "bfs", "neural"],
                        help="Background removal method (default: auto)")
    parser.add_argument("--complexity-threshold", type=float, default=0.55,
                        help="Complexity score threshold for auto neural switch (default: 0.55)")
    parser.add_argument("--neural-unavailable", default="warn-fallback",
                        choices=["warn-fallback", "error", "skip"],
                        help="Behaviour when rembg is not installed (default: warn-fallback)")
    parser.add_argument("--write-report", action="store_true",
                        help="Write a JSON processing report")
    parser.add_argument("--report-path", default=None,
                        help="Path for the JSON report (default: delivery/bg-removal/processing_report.json)")

    args = parser.parse_args()
    
    # Resolve relative paths: defaults relative to script folder, user arguments relative to CWD
    script_dir = os.path.dirname(os.path.realpath(__file__))
    
    input_path = args.input
    if input_path is None:
        input_path = os.path.abspath(os.path.join(script_dir, "../../public/images/products"))
    else:
        input_path = os.path.abspath(input_path)
        
    output_dir = args.output
    if output_dir is None:
        output_dir = os.path.abspath(os.path.join(script_dir, "../../delivery/bg-removal/output"))
    else:
        output_dir = os.path.abspath(output_dir)
        
    config_path = args.config
    if config_path is None:
        config_path = os.path.abspath(os.path.join(script_dir, "config.json"))
    else:
        config_path = os.path.abspath(config_path)
        
    # Load config file
    if os.path.exists(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                configs = json.load(f)
            print(f"Loaded {len(configs)} image configurations from {config_path}")
        except Exception as e:
            print(f"Error parsing config.json: {e}")
            sys.exit(1)
    else:
        print(f"Config file not found at {config_path}. Using empty configs.")
        configs = {}
        
    # Check if input path is a single file or a directory
    files_to_process = []
    if os.path.isfile(input_path):
        files_to_process.append(input_path)
    elif os.path.isdir(input_path):
        for name in os.listdir(input_path):
            p = os.path.join(input_path, name)
            if os.path.isfile(p) and name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                files_to_process.append(p)
    else:
        # Check scratch fallback
        scratch_fallback = os.path.normpath(os.path.join(script_dir, "../../scratch"))
        if os.path.isdir(scratch_fallback):
            print(f"Input path not found, scanning fallback scratch directory: {scratch_fallback}")
            for name in os.listdir(scratch_fallback):
                p = os.path.join(scratch_fallback, name)
                if os.path.isfile(p) and name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    # Check if file has config
                    if name in configs:
                        files_to_process.append(p)
        else:
            print(f"Error: Input path not found at {input_path}")
            sys.exit(1)
            
    if not files_to_process:
        print("No matching images found to process.")
        sys.exit(0)
        
    # Setup comparison directory if requested
    compare_dir = None
    if args.compare:
        compare_dir = os.path.normpath(os.path.join(output_dir, "../comparisons"))
        os.makedirs(compare_dir, exist_ok=True)
        print(f"Comparison sheets will be saved to: {compare_dir}")
        
    os.makedirs(output_dir, exist_ok=True)
    print(f"Output directory: {output_dir}")
    print(f"Found {len(files_to_process)} images to process.")
    
    processed_count = 0
    report_items = []

    for image_path in files_to_process:
        filename = os.path.basename(image_path)
        stem = os.path.splitext(filename)[0]
        out_path = os.path.join(output_dir, f"{stem}.png")

        if os.path.exists(out_path) and not args.force:
            print(f"Skipping {filename} - output already exists. Use --force to reprocess.")
            continue

        # Get config for the specific file name
        cfg = configs.get(filename, {})

        try:
            decision = process_image(image_path, output_dir, cfg, compare_dir, args.redraw_annotations, args)
            processed_count += 1
            report_item = {
                "file": filename,
                "method": decision.get("method"),
                "methodSource": decision.get("source"),
                "complexityScore": decision.get("complexityScore"),
                "threshold": decision.get("threshold"),
                "reasons": decision.get("reasons", []),
                "fallback": decision.get("fallback"),
                "status": "ok_with_warning" if decision.get("fallback") else "ok",
                "durationMs": decision.get("durationMs"),
                "qa": decision.get("qa"),
            }
        except NeuralBackendUnavailable as e:
            print(f"  NEURAL BACKEND ERROR for {filename}: {e}")
            report_item = {"file": filename, "status": "error", "error": str(e)}
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            import traceback
            traceback.print_exc()
            report_item = {"file": filename, "status": "error", "error": str(e)}

        report_items.append(report_item)

    print(f"Finished. Successfully processed {processed_count} images.")

    # --- Write JSON report ---
    if args.write_report:
        import datetime
        report_path = args.report_path
        if report_path is None:
            report_path = os.path.abspath(
                os.path.join(output_dir, "../processing_report.json")
            )
        report = {
            "generatedAt": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "input": str(input_path),
            "output": str(output_dir),
            "globalMethod": args.method,
            "complexityThreshold": args.complexity_threshold,
            "items": report_items,
        }
        os.makedirs(os.path.dirname(report_path), exist_ok=True)
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f"Processing report written to: {report_path}")

if __name__ == "__main__":
    main()
