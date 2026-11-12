from typing import Literal
from pydantic import BaseModel, Field

Quality = Literal["ok", "blurry", "too_dark", "too_small"]

class AnalysisResponse(BaseModel):
    isDamage: bool
    confidence: float = Field(ge=0, le=1)
    severity: Literal["low", "medium", "high", "unknown"]
    quality: Quality
    message: str
    modelVersion: str
