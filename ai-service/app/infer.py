
from app.classifier import predict_classifier
from app.detector import detect_potholes
from app.config import settings


def predict(image):
    classifier = predict_classifier(image)
    detector = detect_potholes(image)

    class_name = classifier["label"]
    class_confidence = classifier["confidence"]

    detection_count = detector["count"]
    detection_confidence = detector["confidence"]

    # YOLO localization takes priority when detections exist.
    if detection_count > 0:
        is_damage = True
        confidence = detection_confidence

        message = (
            f"{detection_count} potential pothole(s) detected "
            "and localized in the image."
        )

    elif (
        class_name == "pothole"
        and class_confidence >= settings.classifier_confidence_threshold
    ):
        # Classifier suggests pothole, but YOLO could not localize it.
        is_damage = True
        confidence = class_confidence

        message = (
            "Possible pothole identified by image classification, "
            "but the detector could not localize it. "
            "Manual verification is recommended."
        )

    elif class_name == "not_road":
        is_damage = False
        confidence = class_confidence

        message = "This image does not appear to show a road."

    else:
        is_damage = False
        confidence = class_confidence

        message = "No pothole detected in the submitted image."

    return {
        "is_damage": is_damage,
        "confidence": float(confidence),
        "message": message,
        "classifier": classifier,
        "detector": detector
    }
