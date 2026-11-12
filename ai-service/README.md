# Road Damage AI Service

A small FastAPI service. It accepts one image in memory, checks photo quality, and returns a stable JSON contract. It starts in **dummy mode** so the Node backend can integrate before the model is trained.

## 1. Run locally (Windows PowerShell)

```powershell
cd road-damage-ai-service
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` and set `AI_SERVICE_SECRET` to a long random value. Then:

```powershell
uvicorn app.main:app --reload --port 8000
```

Open `http://127.0.0.1:8000/docs`.

## 2. Test

```powershell
pytest -v
```

## 3. Call from Node

```js
const form = new FormData();
form.append("file", imageBuffer, {
  filename: "road.jpg",
  contentType: "image/jpeg",
});

const result = await fetch(`${process.env.AI_SERVICE_URL}/analyze`, {
  method: "POST",
  headers: { "X-AI-Secret": process.env.AI_SERVICE_SECRET },
  body: form,
});
```

Do not manually set the multipart `Content-Type` header in Node; the FormData implementation adds its boundary.

## 4. Enable the trained ONNX model

1. Train MobileNetV2 with class indices in this exact order: `damage=0`, `normal_road=1`, `not_road=2`.
2. Export to `models/model-v1.onnx` with input shape `[1, 224, 224, 3]` (NHWC) and one output `[1, 3]`.
3. Verify the ONNX input/output names and tensor layout. If your export is NCHW, update `preprocess.py` accordingly.
4. Update `.env`: `AI_MODE=onnx`, `MODEL_VERSION=v1`, and tune `CONFIDENCE_THRESHOLD` using validation data only.
5. Run tests plus a labelled, location-separated holdout evaluation.

## Important implementation notes

- `/health` is public and does not load the model; it is a liveness endpoint.
- `/analyze` requires `X-AI-Secret`. Keep the secret only in the Node server and AI-service environment, never in frontend code.
- The API checks MIME type, byte size, decoding, minimum dimensions, blur, and brightness. Thresholds are starting points, not universal truths.
- The image is processed in memory and is not written to disk. Avoid logging request bodies or image bytes.
- `isDamage=false` also covers uncertain/normal/non-road cases; the message and confidence help explain the result. Consider adding a separate `predictedClass` field in a future API version if the frontend needs to distinguish normal road from non-road.
- Severity stays `unknown` until human review or a dedicated detector estimates physical damage.
