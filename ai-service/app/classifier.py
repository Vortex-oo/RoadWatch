
import os
import pathlib
from functools import lru_cache

import cv2
import numpy as np
from PIL import Image

from app.config import settings


def _patch_path_compatibility():
    """
    Allow a FastAI model exported on Linux/Colab
    to load on Windows.
    """
    if os.name == "nt":
        import pathlib._local as local

        local.PosixPath = pathlib.WindowsPath
        pathlib.PosixPath = pathlib.WindowsPath


@lru_cache(maxsize=1)
def get_classifier():
    # IMPORTANT: Apply compatibility patch before importing/loading FastAI.
    _patch_path_compatibility()

    from fastai.vision.all import load_learner

    model_path = settings.classifier_model_path

    if not model_path.exists():
        raise FileNotFoundError(
            f"Classifier model not found: {model_path}"
        )

    return load_learner(
        model_path,
        cpu=True
    )


def predict_classifier(image: np.ndarray):
    """Run image classification and return class probabilities."""

    learner = get_classifier()

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(rgb)

    label, index, probabilities = learner.predict(pil_image)

    classes = [str(x) for x in learner.dls.vocab]

    scores = probabilities.detach().cpu().numpy().astype(float)

    probability_map = {
        name: float(scores[i])
        for i, name in enumerate(classes)
    }

    return {
        "label": str(label),
        "confidence": float(scores[int(index)]),
        "probabilities": probability_map
    }
