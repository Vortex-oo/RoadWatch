# RoadWatch AI Service

FastAPI service for RoadWatch. It checks uploaded road images, then uses YOLO and a FastAI classifier to identify potential potholes.

## 1. Get the models

Place these files in `ai-service/models/`:

```text
models/
├── best.pt
└── road_classifier.pkl
```

- `best.pt` — Ultralytics YOLO pothole detector.
- `road_classifier.pkl` — FastAI ConvNeXt-Tiny classifier (`normal_road`, `not_road`, `pothole`).

If the classifier is stored with Git LFS, run this from the repository root:

```powershell
git lfs install
git lfs pull
```

Check that `road_classifier.pkl` is the full model file, not a small Git LFS pointer.

## 2. Create the Python environment

Use Python 3.13.5, the version used for the current local deployment.

```powershell
cd RoadWatch\ai-service
py -3.13 -m venv .venv313
.\.venv313\Scripts\Activate.ps1
python --version
```

## 3. Install dependencies

Install the PyTorch/Torchvision build compatible with your machine. The tested environment used PyTorch 2.14.1 and Torchvision 0.29.1.

```powershell
python -m pip install --upgrade pip
python -m pip install torch==2.14.1 torchvision==0.29.1
python -m pip install fastai==2.8.12 timm ultralytics==8.4.211
python -m pip install -r requirements.txt
```

If the exact PyTorch versions are unavailable for your platform, use the installation command from https://pytorch.org/get-started/locally/.

## 4. Configure the service

Check `app/config.py` for the supported settings and defaults. Current configuration:

```dotenv
AI_MODE=ensemble
MODEL_VERSION=roadwatch-yolo-fastai-v1
CLASSIFIER_MODEL_PATH=models/road_classifier.pkl
DETECTOR_MODEL_PATH=models/best.pt
CLASSIFIER_CONFIDENCE_THRESHOLD=0.70
YOLO_CONFIDENCE_THRESHOLD=0.25
INFERENCE_DEVICE=cpu
MAX_UPLOAD_BYTES=5242880
```

If using a local `.env` file, keep it private and do not commit it.

## 5. Start the API

Run from the `ai-service` directory:

```powershell
python -m uvicorn app.main:app --reload
```

Open:

- Swagger API docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

## 6. Test image analysis

Use Swagger:

1. Open `/docs`.
2. Expand `POST /analyze`.
3. Click **Try it out**.
4. Upload a JPEG, PNG, or WebP image (maximum 5 MB).
5. Click **Execute** and inspect the JSON response.

Or use PowerShell:

```powershell
$imagePath = "C:\path\to\road-image.jpg"
curl.exe -X POST "http://127.0.0.1:8000/analyze" -H "accept: application/json" -F "file=@$imagePath"
```

Run automated tests from `ai-service`:

```powershell
python -m pytest -v
```

## 7. Main files

- `app/main.py` — FastAPI endpoints.
- `app/config.py` — configuration and model paths.
- `app/classifier.py` — FastAI classifier.
- `app/detector.py` — YOLO detector.
- `app/infer.py` — combines model predictions.
- `app/quality.py` — image-quality checks.
- `app/schemas.py` — API response validation.
- `app/severity.py` — severity placeholder.
- `models/` — trained model files.

**Note:** `severity` currently returns `unknown`. The API has no authentication configured, so keep it on a trusted development network until access controls are added.
