
from functools import lru_cache

import numpy as np
from ultralytics import YOLO

from app.config import settings


@lru_cache(maxsize=1)
def get_detector():
    if not settings.detector_model_path.exists():
        raise FileNotFoundError(
            f"YOLO model not found: {settings.detector_model_path}"
        )

    model = YOLO(str(settings.detector_model_path))

    if model.task != "detect":
        raise RuntimeError("Expected a YOLO detection model.")

    return model


def detect_potholes(image: np.ndarray):
    """Detect potholes and return confidence scores and bounding boxes."""

    model = get_detector()

    results = model.predict(
        source=image,
        conf=settings.yolo_confidence_threshold,
        device=settings.inference_device,
        verbose=False
    )

    result = results[0]

    if result.boxes is None or len(result.boxes) == 0:
        return {
            "count": 0,
            "confidence": 0.0,
            "boxes": []
        }

    confidences = result.boxes.conf.cpu().numpy().tolist()
    coordinates = result.boxes.xyxy.cpu().numpy().tolist()

    boxes = [
        {
            "confidence": float(conf),
            "coordinates": [float(v) for v in box]
        }
        for conf, box in zip(confidences, coordinates)
    ]

    return {
        "count": len(boxes),
        "confidence": max(confidences),
        "boxes": boxes
    }
