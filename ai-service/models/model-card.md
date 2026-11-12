# Model card

## Status
Dummy integration mode. No trained model is included in this starter package.

## Intended classes
1. `damage`
2. `normal_road`
3. `not_road`

## Preprocessing contract
RGB, 224x224, float32, scaled to [-1, 1], batch dimension included.

## ONNX output contract
One output tensor containing three class scores in exactly the class order above.
The inference adapter accepts probabilities or logits.

## Known limitations
- Severity is always `unknown`; classification confidence is not physical severity.
- Quality thresholds are initial values and must be calibrated using real phone photos.
- Validate by road/location/source to prevent train-test leakage.
- Record dataset licences, provenance, split manifest, metrics, and model date before deployment.
