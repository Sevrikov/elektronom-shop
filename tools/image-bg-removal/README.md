# Background Removal Tool for Elektronom

A CLI tool to clean product image backgrounds, remove bottom shadows, and handle diagrams/transparent elements.

## Requirements

* **Python version**: Python 3.8+ (fully compatible with Python 3.11).
* **Libraries**: `Pillow` (image manipulation) and `numpy` (fast matrix masking).

## Reproducible Environment & Setup

If you have issues running Python globally or using the `py` launcher, we recommend setting up a local virtual environment. 

Run the following commands from the **root directory** of the repository:

### 1. Create and configure virtual environment (venv)
```powershell
# Create the virtual environment (.venv)
py -3.11 -m venv .venv

# Install dependencies into the virtual environment
.\.venv\Scripts\python.exe -m pip install -r tools\image-bg-removal\requirements.txt
```

### 2. Run the background removal script
```powershell
# Run using the venv Python interpreter
.\.venv\Scripts\python.exe tools\image-bg-removal\remove_bg.py --input public\images\products --output delivery\bg-removal\output --config tools\image-bg-removal\config.json --compare
```

### 3. Run unit tests
```powershell
# Execute the test suite using the venv python interpreter
.\.venv\Scripts\python.exe -m unittest discover tools\image-bg-removal\tests
```

---

## Global CLI Usage

Alternatively, if your global environment is set up correctly, you can run directly from the project root:

```bash
python tools/image-bg-removal/remove_bg.py --input public/images/products --output delivery/bg-removal/output --config tools/image-bg-removal/config.json --compare
```

### CLI Arguments

* `--input`: Path to the input image file or directory containing images to process. (Default: `public/images/products`)
* `--output`: Path to the output directory where transparent PNG images will be saved. (Default: `delivery/bg-removal/output`)
* `--config`: Path to the JSON configuration file containing overrides for specific images. (Default: `tools/image-bg-removal/config.json`)
* `--compare`: (Optional flag) Generate 4-way side-by-side comparison sheets in `delivery/bg-removal/comparisons/`.
* `--redraw-annotations`: (Optional flag) Draw vector annotations (dashed lines, arrows, redrawn badges) for images configured with `"redrawAnnotations": true` in `config.json`.
* `--force`: (Optional flag) Reprocess images even if the output file already exists.
* `--method auto|bfs|neural`: Background removal method. Default: `auto` (smart selection). `bfs` forces the deterministic algorithm. `neural` forces rembg/U2-Net.
* `--complexity-threshold`: Complexity score threshold (0.0–1.0) for auto neural switch. Default: `0.55`.
* `--neural-unavailable warn-fallback|error|skip`: Behaviour when rembg is not installed. Default: `warn-fallback` (use BFS with a warning).
* `--write-report`: (Optional flag) Save a JSON processing report.
* `--report-path`: Path for the JSON report. Default: `delivery/bg-removal/processing_report.json`.

---

## Optional Neural Background Removal

The default tool uses the deterministic BFS/masking pipeline, which works well for studio product photos on white/light backgrounds.
For complex images (natural lighting, textured backgrounds, etc.), the tool can optionally use **rembg** (U2-Net neural model).

> **Note**: First run of rembg will download the U2-Net model (~170 MB). Ensure internet access or pre-download manually.

### 1. Install neural backend

```powershell
.\.venv\Scripts\python.exe -m pip install -r tools\image-bg-removal\requirements-neural.txt
```

### 2. Auto mode (smart detection)

```powershell
.\.venv\Scripts\python.exe tools\image-bg-removal\remove_bg.py --method auto --complexity-threshold 0.55 --write-report
```

### 3. Force neural mode

```powershell
.\.venv\Scripts\python.exe tools\image-bg-removal\remove_bg.py --method neural --neural-unavailable error
```

### 4. Force deterministic BFS mode

```powershell
.\.venv\Scripts\python.exe tools\image-bg-removal\remove_bg.py --method bfs
```

### Per-image config override

Add `"method"` to any image entry in `config.json`:

```json
{
  "complex_product_photo.jpg": {
    "method": "neural",
    "neuralUnavailable": "warn-fallback",
    "neuralPostprocess": { "alphaThreshold": 8 }
  },
  "schematic_diagram.jpg": {
    "method": "bfs",
    "redrawAnnotations": true
  }
}
```
