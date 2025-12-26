import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

# Load the model and encoders
model_bundle = joblib.load(MODEL_PATH)

print("Keys in model.pkl:", list(model_bundle.keys()))
print("Model type:", type(model_bundle["model"]))
print("Team encoder classes:", model_bundle["team_encoder"].classes_)
print("Winner encoder classes:", model_bundle["winner_encoder"].classes_)