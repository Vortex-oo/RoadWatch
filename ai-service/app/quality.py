import cv2
import numpy as np
from app.config import settings

def assess_quality(image: np.ndarray) -> tuple[str, str]:
    """Return (quality_code, user_message). Does not persist the image."""
    height, width = image.shape[:2]

    if width < settings.min_width or height < settings.min_height:
        return "too_small", "Photo resolution is too low. Please upload a larger photo."

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    if blur_score < settings.min_blur_score:
        return "blurry", "Photo is too blurry. Please retake it with the road in focus."

    brightness = float(np.mean(gray))
    if brightness < settings.min_brightness:
        return "too_dark", "Photo is too dark. Please retake it in better lighting."

    if brightness > settings.max_brightness:
        return "too_dark", "Photo is overexposed. Please retake it with less glare."

    return "ok", "Photo quality is acceptable."
