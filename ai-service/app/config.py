
import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

AI_SERVICE_DIR = Path(__file__).resolve().parents[1]


def resolve_model_path(environment_variable: str, default: str) -> Path:
    path = Path(os.getenv(environment_variable, default))

    if not path.is_absolute():
        path = AI_SERVICE_DIR / path

    return path.resolve()


@dataclass(frozen=True)
class Settings:
    service_secret: str = os.getenv(
        "AI_SERVICE_SECRET", "change-this-secret"
    )

    model_version: str = os.getenv(
        "MODEL_VERSION", "roadwatch-yolo-fastai-v1"
    )

    ai_mode: str = os.getenv("AI_MODE", "ensemble").lower()

    classifier_model_path: Path = resolve_model_path(
        "CLASSIFIER_MODEL_PATH", "models/road_classifier.pkl"
    )

    detector_model_path: Path = resolve_model_path(
        "DETECTOR_MODEL_PATH", "models/best.pt"
    )

    classifier_confidence_threshold: float = float(
        os.getenv("CLASSIFIER_CONFIDENCE_THRESHOLD", "0.70")
    )

    yolo_confidence_threshold: float = float(
        os.getenv("YOLO_CONFIDENCE_THRESHOLD", "0.25")
    )

    inference_device: str = os.getenv("INFERENCE_DEVICE", "cpu")

    max_upload_bytes: int = int(
        os.getenv("MAX_UPLOAD_BYTES", str(5 * 1024 * 1024))
    )

    min_width: int = int(os.getenv("MIN_IMAGE_WIDTH", "160"))
    min_height: int = int(os.getenv("MIN_IMAGE_HEIGHT", "160"))

    min_blur_score: float = float(os.getenv("MIN_BLUR_SCORE", "40"))
    min_brightness: float = float(os.getenv("MIN_BRIGHTNESS", "25"))
    max_brightness: float = float(os.getenv("MAX_BRIGHTNESS", "235"))


settings = Settings()
