import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
import joblib
import os

# Path to dataset
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MATCHES_PATH = os.path.join(DATA_DIR, "matches.csv")

# Load dataset
data = pd.read_csv(MATCHES_PATH)

# Remove missing winners
data = data.dropna(subset=["winner"])

# Normalize team/winner names
for col in ["team1", "team2", "winner"]:
    data[col] = data[col].astype(str).str.strip().str.upper()

# Encode teams
all_teams = pd.concat([data["team1"], data["team2"]]).unique()
encoder_team = LabelEncoder()
encoder_team.fit(all_teams)

# Features: team1, team2, target_runs, result_margin, target_overs
features = pd.DataFrame({
    "team1": encoder_team.transform(data["team1"]),
    "team2": encoder_team.transform(data["team2"]),
    "team1_score": pd.to_numeric(data["target_runs"], errors="coerce"),
    "team2_score": pd.to_numeric(data["result_margin"], errors="coerce"),
    "overs": pd.to_numeric(data["target_overs"], errors="coerce")
})

# Encode target
encoder_winner = LabelEncoder()
y = encoder_winner.fit_transform(data["winner"])

# Ensure at least 2 classes exist
if len(set(y)) < 2:
    raise ValueError(
        f"❌ Training data has only one unique winner ({encoder_winner.classes_}). "
        "Please check matches.csv to ensure it contains games with different winners."
    )

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    features, y, test_size=0.2, random_state=42
)

# Train model
model = XGBClassifier(use_label_encoder=False, eval_metric="mlogloss")
model.fit(X_train, y_train)

# Save model and encoders
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
joblib.dump(
    {"model": model, "team_encoder": encoder_team, "winner_encoder": encoder_winner},
    MODEL_PATH
)

print(f"✅ Model trained and saved at {MODEL_PATH}")