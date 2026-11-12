
import logging

import cv2
import numpy as np

from fastapi import FastAPI, File, HTTPException, UploadFile

from app.config import settings
from app.infer import predict
from app.quality import assess_quality
from app.schemas import AnalysisResponse
from app.severity import estimate_severity


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("road-damage-ai")


app = FastAPI(
    title="Road Damage AI Service",
    version=settings.model_version
)


ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp"
}


def response(
    is_damage: bool,
    confidence: float,
    quality: str,
    message: str
) -> AnalysisResponse:

    return AnalysisResponse(
        isDamage=is_damage,
        confidence=confidence,
        severity=estimate_severity(),
        quality=quality,
        message=message,
        modelVersion=settings.model_version
    )


@app.get("/health")
def health():
    return {
        "status": "ok",
        "modelVersion": settings.model_version,
        "mode": settings.ai_mode
    }


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    file: UploadFile = File(...)
):

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        await file.close()
        raise HTTPException(
            status_code=415,
            detail="Only JPEG, PNG, and WebP images are accepted."
        )

    try:
        raw = await file.read(settings.max_upload_bytes + 1)

    finally:
        await file.close()

    if not raw:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    if len(raw) > settings.max_upload_bytes:
        raise HTTPException(
            status_code=413,
            detail="Image exceeds the 5 MB upload limit."
        )

    # Decode image in memory. No image is written to disk.
    encoded = np.frombuffer(raw, dtype=np.uint8)

    image = cv2.imdecode(
        encoded,
        cv2.IMREAD_COLOR
    )

    del raw, encoded

    if image is None:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image."
        )

    try:
        # Image quality validation
        quality, quality_message = assess_quality(image)

        if quality != "ok":
            return response(
                False,
                0.0,
                quality,
                quality_message
            )

        # Verify ensemble configuration
        if settings.ai_mode != "ensemble":
            raise HTTPException(
                status_code=503,
                detail="AI service is not configured for ensemble inference."
            )

        # Run FastAI classifier + YOLO detector
        result = predict(image)

        return response(
            is_damage=result["is_damage"],
            confidence=result["confidence"],
            quality="ok",
            message=result["message"]
        )

    except HTTPException:
        raise

    except FileNotFoundError:
        logger.exception("AI model file missing")

        raise HTTPException(
            status_code=503,
            detail="AI model is not installed."
        )

    except Exception:
        logger.exception("AI inference failed")

        raise HTTPException(
            status_code=500,
            detail="Model inference failed."
        )

    finally:
        del image
