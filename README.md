# RoadWatch AI Service

This directory contains the AI inference service developed for
**RoadWatch**, a smart road-damage reporting platform. It exposes a REST
API that accepts road photographs, checks image quality, runs pothole
classification and object detection, and returns a structured result.

> **Scope:** This README documents the AI-service contribution: model
> files, inference pipeline, API, local setup, testing, and integration
> contract. It does not describe the frontend, main application backend,
> database, map, or reporting workflow.

## 1. Overview

The service combines two trained models:

  -------------------------------------------------------------------------
  Component               Model                     Responsibility
  ----------------------- ------------------------- -----------------------
  Object detector         Ultralytics YOLO          Detects and localizes
                          (`best.pt`)               potholes; returns
                                                    bounding boxes and
                                                    confidence scores

  Image classifier        FastAI exported learner   Classifies an image as
                          (`road_classifier.pkl`)   `normal_road`,
                                                    `not_road`, or
                                                    `pothole`
  -------------------------------------------------------------------------

### Inference flow

1.  Receive an uploaded image.
2.  Validate its content type and size.
3.  Decode it in memory using OpenCV.
4.  Check image quality.
5.  If quality is acceptable, run ensemble inference.
6.  Combine detector and classifier results.
7.  Return a Pydantic-validated JSON response.

### Ensemble decision logic

-   If YOLO returns one or more detections, report potential pothole
    damage and the number of detections. The response confidence is the
    highest YOLO detection confidence.
-   If YOLO returns no detections but the classifier predicts `pothole`
    above its configured threshold, report a potential pothole for
    manual review.
-   If the classifier predicts `not_road`, report that the image does
    not appear to show a road.
-   Otherwise, report that no pothole was detected.

The classifier and detector scores come from different models and are
not directly comparable probabilities. The API's `confidence` field
represents the confidence associated with the decision source used for
that response.

## 2. Project structure

``` text
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application and endpoints
│   ├── config.py        # Configuration and model paths
│   ├── classifier.py    # FastAI model loading and prediction
│   ├── detector.py      # YOLO model loading and detection
│   ├── infer.py         # Combines classifier and detector decisions
│   ├── quality.py       # Image-quality checks
│   ├── schemas.py       # Pydantic response schema
│   └── severity.py      # Severity estimation placeholder
├── models/
│   ├── best.pt
│   ├── road_classifier.pkl
│   └── model-card.md
├── tests/
│   └── test_api.py
├── Dockerfile
├── requirements.txt
└── README.md
```

The `ml/` training workspace is not required to run this API. Training
notebooks and datasets are maintained separately in Google Colab/Google
Drive. The trained model artifacts must still be present locally in
`models/`.

## 3. Model artifacts

### 3.1 YOLO pothole detector

-   File: `models/best.pt`
-   Task: object detection
-   Class mapping: `{0: "Pothole"}`
-   Runtime: Ultralytics
-   Configured confidence threshold: `0.25`

The detector returns localized bounding boxes and confidence values.
When detections exist, the service uses the maximum detection confidence
for the response confidence.

### 3.2 FastAI road-image classifier

-   File: `models/road_classifier.pkl`
-   Framework: FastAI
-   Architecture: ConvNeXt-Tiny
-   Export format: FastAI learner export (`learn.export(...)`)
-   Class order: `normal_road`, `not_road`, `pothole`
-   Configured classification threshold: `0.70`

The exported learner contains its FastAI preprocessing pipeline. Do not
apply the old MobileNetV2 preprocessing routine to this model.

The model was exported in a Linux/Colab environment. The current Windows
loader contains a `pathlib` compatibility workaround in
`app/classifier.py`; retain it unless the model is re-exported and the
replacement is tested.

### 3.3 Downloading model files

Both artifacts must exist at:

``` text
ai-service/models/best.pt
ai-service/models/road_classifier.pkl
```

If the repository uses Git LFS for the `.pkl` file, install Git LFS
before pulling the model:

``` powershell
git lfs install
git lfs pull
```

Check that `road_classifier.pkl` is the actual model file, not a small
Git LFS pointer. The current classifier artifact is approximately
114,693,757 bytes (about 109.38 MiB).

If model files are distributed separately, copy them into `models/`
without changing their filenames.

## 4. Requirements

The tested local deployment environment is:

-   Windows 11
-   Python 3.13.5
-   PyTorch 2.14.1+cu130
-   Torchvision 0.29.1+cu130
-   FastAI 2.8.12
-   Ultralytics 8.4.211
-   `timm`

The API also uses FastAPI, Uvicorn, `python-multipart`, OpenCV, NumPy,
Pydantic, and supporting runtime/test packages.

> These are the versions recorded in the working development
> environment. PyTorch wheel availability varies by platform. The
> service is currently configured for CPU inference
> (`INFERENCE_DEVICE=cpu`), even though the installed PyTorch build
> reported CUDA support.

## 5. Local setup (Windows PowerShell)

Run these commands from the repository root, adjusting the path if
necessary.

### 5.1 Enter the service directory

``` powershell
cd RoadWatch\ai-service
```

### 5.2 Create and activate a virtual environment

``` powershell
py -3.13 --version
py -3.13 -m venv .venv313
.\.venv313\Scripts\Activate.ps1
python --version
```

If PowerShell blocks activation, use the environment's Python executable
directly:

``` powershell
.\.venv313\Scripts\python.exe -m pip --version
```

### 5.3 Install PyTorch and Torchvision

The development environment used PyTorch 2.14.1 and Torchvision 0.29.1:

``` powershell
python -m pip install torch==2.14.1 torchvision==0.29.1
```

If these exact builds are unavailable for your platform, select a
compatible installation command from the official PyTorch selector:

https://pytorch.org/get-started/locally/

A CUDA-enabled wheel does not mean the service is using the GPU. The
current configuration selects CPU inference.

### 5.4 Install model and API dependencies

``` powershell
python -m pip install fastai==2.8.12 timm ultralytics==8.4.211
python -m pip install fastapi "uvicorn[standard]" python-multipart opencv-python-headless numpy pydantic python-dotenv httpx pytest
```

If `requirements.txt` contains the complete dependency list, install it
with:

``` powershell
python -m pip install -r requirements.txt
```

This API uses `opencv-python-headless`. Avoid installing both headless
and GUI OpenCV packages into the same environment unless specifically
required.

### 5.5 Verify model files

``` powershell
Get-ChildItem .\models
```

Expected artifacts:

``` text
best.pt
road_classifier.pkl
model-card.md
```

### 5.6 Configure environment variables

Create a local `.env` file inside `ai-service/` if the application
configuration reads it. Do not commit this file.

Example values (confirm supported names and defaults in
`app/config.py`):

``` dotenv
AI_MODE=ensemble
MODEL_VERSION=roadwatch-yolo-fastai-v1
CLASSIFIER_MODEL_PATH=models/road_classifier.pkl
DETECTOR_MODEL_PATH=models/best.pt
CLASSIFIER_CONFIDENCE_THRESHOLD=0.70
YOLO_CONFIDENCE_THRESHOLD=0.25
INFERENCE_DEVICE=cpu
MAX_UPLOAD_BYTES=5242880
```

## 6. Run the API

From `ai-service/`, with the virtual environment activated:

``` powershell
python -m uvicorn app.main:app --reload
```

Or run it without activating the environment:

``` powershell
.\.venv313\Scripts\python.exe -m uvicorn app.main:app --reload
```

Local development URLs:

  Resource         URL
  ---------------- ------------------------------------
  API              http://127.0.0.1:8000
  Swagger UI       http://127.0.0.1:8000/docs
  OpenAPI schema   http://127.0.0.1:8000/openapi.json
  Health check     http://127.0.0.1:8000/health

`--reload` is for development, not production deployment.

## 7. API reference

### `GET /health`

Returns basic service status and configuration.

``` powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

Example:

``` json
{
  "status": "ok",
  "modelVersion": "roadwatch-yolo-fastai-v1",
  "mode": "ensemble"
}
```

A successful health response confirms that the API process responds. It
does not prove that both models can perform inference; use `/analyze`
for an end-to-end check.

### `POST /analyze`

Accepts one image as multipart form data.

Accepted content types:

-   `image/jpeg`
-   `image/png`
-   `image/webp`

Maximum upload size: 5 MB (5,242,880 bytes).

PowerShell example:

``` powershell
$imagePath = "C:\path\to\road-image.jpg"

curl.exe -X POST "http://127.0.0.1:8000/analyze" `
  -H "accept: application/json" `
  -F "file=@$imagePath"
```

Example response:

``` json
{
  "isDamage": true,
  "confidence": 0.8636,
  "severity": "unknown",
  "quality": "ok",
  "message": "9 potential pothole(s) detected and localized in the image.",
  "modelVersion": "roadwatch-yolo-fastai-v1"
}
```

The detection count and confidence shown here are an example of a
previously observed test response. Actual results depend on the input
image and model inference.

### Response fields

  -----------------------------------------------------------------------
  Field                   Type                    Meaning
  ----------------------- ----------------------- -----------------------
  `isDamage`              Boolean                 Whether potential
                                                  pothole damage was
                                                  detected

  `confidence`            Float (0--1)            Confidence associated
                                                  with the decision
                                                  source used for this
                                                  response

  `severity`              String                  Currently `unknown`;
                                                  physical severity
                                                  estimation is not
                                                  implemented

  `quality`               String                  Image-quality result

  `message`               String                  Human-readable result
                                                  or quality message

  `modelVersion`          String                  Configured
                                                  model/service version
  -----------------------------------------------------------------------

### Image-quality outcomes

The current response schema permits:

-   `ok`
-   `blurry`
-   `too_dark`
-   `too_small`

The quality module checks image dimensions, blur using Laplacian
variance, and mean brightness. Current implementation thresholds:

  Check                      Threshold
  -------------------------- ----------------------------------
  Minimum width and height   160 pixels
  Blur                       Laplacian variance threshold: 40
  Mean brightness            25 to 235

Images that fail quality checks receive a quality response without model
inference.

**Known limitation:** The current quality implementation maps
overexposure to `too_dark`. If a separate `too_bright` status is
introduced, update `quality.py` and `schemas.py` together.

## 8. Configuration reference

Current configuration values:

  ------------------------------------------------------------------------------------------
  Setting                             Current value                  Purpose
  ----------------------------------- ------------------------------ -----------------------
  `AI_MODE`                           `ensemble`                     Enables combined
                                                                     classifier and detector
                                                                     inference

  `MODEL_VERSION`                     `roadwatch-yolo-fastai-v1`     Version label returned
                                                                     by the API

  `CLASSIFIER_MODEL_PATH`             `models/road_classifier.pkl`   FastAI model path

  `DETECTOR_MODEL_PATH`               `models/best.pt`               YOLO model path

  `CLASSIFIER_CONFIDENCE_THRESHOLD`   `0.70`                         Minimum classifier
                                                                     confidence for fallback
                                                                     pothole decision

  `YOLO_CONFIDENCE_THRESHOLD`         `0.25`                         YOLO detection
                                                                     threshold

  `INFERENCE_DEVICE`                  `cpu`                          Inference device

  `MAX_UPLOAD_BYTES`                  `5242880`                      Maximum upload size (5
                                                                     MiB)
  ------------------------------------------------------------------------------------------

`app/config.py` is the source of truth if this documentation and the
implementation differ.

## 9. Testing

The service includes API tests in `tests/test_api.py`.

Run from `ai-service/`:

``` powershell
python -m pytest -v
```

Manual end-to-end test:

1.  Start Uvicorn.
2.  Open http://127.0.0.1:8000/docs.
3.  Expand `POST /analyze`.
4.  Select **Try it out**.
5.  Upload a JPEG, PNG, or WebP image under 5 MB.
6.  Execute and inspect the HTTP status and JSON response.

Recommended test inputs:

-   Clear road image containing a pothole
-   Normal road image
-   Non-road image
-   Blurry image
-   Very dark image
-   Image smaller than 160 × 160 pixels
-   Unsupported file type
-   Empty or invalid image
-   Image larger than 5 MB

A successful `/health` request alone is not an end-to-end model test.

## 10. Docker

A `Dockerfile` is included. Check that it installs compatible PyTorch,
FastAI, Ultralytics, OpenCV, and all required dependencies, and that the
model artifacts are available inside the container.

Typical commands from `ai-service/`:

``` powershell
docker build -t roadwatch-ai .
docker run --rm -p 8000:8000 roadwatch-ai
```

These commands assume the Dockerfile includes or receives the model
files. If it expects models to be mounted separately, mount the
`models/` directory when running the container.

## 11. Limitations and production considerations

-   **Severity is not implemented.** `severity.py` currently returns
    `unknown`. Detection confidence is not a measure of physical pothole
    severity.
-   **Image-quality thresholds are heuristic.** They need validation on
    representative road images under varied lighting and camera
    conditions.
-   **Model confidence is not calibrated.** It should not be interpreted
    as a guaranteed probability of correctness.
-   **Classifier and detector scores are not directly comparable.** They
    come from different architectures and decision processes.
-   **Validation accuracy is not proof of field performance.**
    Independent evaluation on unseen roads, cameras, weather, and
    lighting conditions is still needed.
-   **No physical pothole dimensions are estimated.** Pixel bounding
    boxes do not establish real-world depth or area without calibration
    or additional measurements.
-   **The API currently has no authentication.** Keep it on a trusted
    development network. Before public deployment, add authentication,
    rate limiting, request controls, logging, and operational
    monitoring.
-   **Uploads are decoded and processed in memory.** Do not assume
    uploaded images are persisted for later retrieval.

## 12. Model maintenance and Git LFS

-   Keep model filenames and paths synchronized with `app/config.py`.
-   If `road_classifier.pkl` is stored using Git LFS, install Git LFS
    and run `git lfs pull` after cloning.
-   Do not commit `.env`, virtual environments, caches, or local output
    directories.
-   Keep model provenance, training-data descriptions, class
    definitions, and evaluation metrics in `models/model-card.md`.
-   When replacing a model, test loading and `/analyze` end to end,
    update the model card, and change `MODEL_VERSION`.

## 13. Troubleshooting

  -----------------------------------------------------------------------
  Problem                             What to check
  ----------------------------------- -----------------------------------
  `ModuleNotFoundError: fastai`       Activate the intended environment
                                      and install FastAI

  `ModuleNotFoundError: timm`         Install `timm`; it is required by
                                      the ConvNeXt model

  YOLO model missing                  Check `models/best.pt` and the
                                      configured detector path

  FastAI model missing                Check `models/road_classifier.pkl`
                                      and the configured classifier path

  FastAI `PosixPath` issue on Windows Confirm the compatibility
                                      workaround in `app/classifier.py`
                                      runs before loading the exported
                                      learner

  `/analyze` returns 415              Upload JPEG, PNG, or WebP with the
                                      matching content type

  `/analyze` returns 413              Reduce the image to 5 MB or less

  `/analyze` returns 400              Check that the upload is a valid,
                                      non-empty image

  `/analyze` returns 503              Check model files and `AI_MODE`
                                      configuration

  `.pkl` is unexpectedly tiny after   Run `git lfs install` and
  cloning                             `git lfs pull`; it may still be an
                                      LFS pointer
  -----------------------------------------------------------------------

## 14. Responsibility boundary

This component owns image-quality checks, model loading, inference
orchestration, the FastAPI interface, and the response contract.

The calling RoadWatch application is responsible for collecting user
reports, associating reports with location and user data, displaying
results, managing repair status, and presenting map or dashboard views.

------------------------------------------------------------------------

**Implementation status:** Initial local end-to-end integration of the
YOLO detector, FastAI classifier, and FastAPI `/analyze` endpoint has
been verified. Further evaluation, confidence calibration, severity
estimation, and production security hardening remain necessary.
