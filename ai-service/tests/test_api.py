import os
os.environ["AI_SERVICE_SECRET"] = "test-secret"
os.environ["AI_MODE"] = "dummy"

from fastapi.testclient import TestClient
import numpy as np
import cv2
from app.main import app

client = TestClient(app)

def make_image():
    # Synthetic textured image to pass the blur check.
    rng = np.random.default_rng(7)
    image = rng.integers(0, 255, (300, 400, 3), dtype=np.uint8)
    ok, encoded = cv2.imencode(".jpg", image)
    assert ok
    return encoded.tobytes()

def test_health():
    result = client.get("/health")
    assert result.status_code == 200
    assert result.json()["status"] == "ok"

def test_analyze_requires_secret():
    result = client.post("/analyze", files={"file": ("road.jpg", make_image(), "image/jpeg")})
    assert result.status_code == 401

def test_dummy_analyze_contract():
    result = client.post(
        "/analyze",
        headers={"X-AI-Secret": "test-secret"},
        files={"file": ("road.jpg", make_image(), "image/jpeg")},
    )
    assert result.status_code == 200
    body = result.json()
    assert set(body) == {"isDamage", "confidence", "severity", "quality", "message", "modelVersion"}
    assert body["modelVersion"] == "v1-dummy"
