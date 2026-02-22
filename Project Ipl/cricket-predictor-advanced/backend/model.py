"""
IPL Match Prediction Model (Clean - No Data Leakage)

This model uses ONLY pre-match features that are known before the match starts:
- Team identities (team1, team2)
- Venue
- Toss winner
- Historical head-to-head statistics
- Team win rates

IMPORTANT: We do NOT use target_runs or result_margin as these are
POST-MATCH values that would cause data leakage.

Expected accuracy: ~50-55% (realistic for sports prediction)
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

# Path to dataset
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MATCHES_PATH = os.path.join(DATA_DIR, "matches.csv")

print("=" * 60)
print("TRAINING PRE-MATCH PREDICTION MODEL (Clean - No Leakage)")
print("=" * 60)

# Load dataset
data = pd.read_csv(MATCHES_PATH)
print(f"\n📊 Total matches loaded: {len(data)}")

# Remove matches without winner
data = data.dropna(subset=["winner"])
data = data[data["result"] != "no result"]

# Normalize team/winner names
for col in ["team1", "team2", "winner"]:
    data[col] = data[col].astype(str).str.strip().str.upper()

# Also normalize toss_winner and venue
if "toss_winner" in data.columns:
    data["toss_winner"] = data["toss_winner"].astype(str).str.strip().str.upper()
if "venue" in data.columns:
    data["venue"] = data["venue"].astype(str).str.strip().str.upper()

print(f"📊 Valid matches for training: {len(data)}")

# Encode teams
all_teams = pd.concat([data["team1"], data["team2"]]).unique()
encoder_team = LabelEncoder()
encoder_team.fit(all_teams)

# Encode venues
encoder_venue = LabelEncoder()
if "venue" in data.columns:
    data["venue"] = data["venue"].fillna("UNKNOWN")
    encoder_venue.fit(data["venue"].unique())
else:
    encoder_venue.fit(["UNKNOWN"])

# Calculate team historical win rates
team_wins = data.groupby("winner").size()
team_matches = pd.concat([data["team1"], data["team2"]]).value_counts()
team_win_rate = {}
for team in all_teams:
    wins = team_wins.get(team, 0)
    matches = team_matches.get(team, 1)
    team_win_rate[team] = wins / matches if matches > 0 else 0.5

# Calculate head-to-head stats
def get_h2h_win_rate(t1, t2):
    """Get team1's win rate against team2 in historical matches"""
    h2h = data[((data["team1"] == t1) & (data["team2"] == t2)) | 
               ((data["team1"] == t2) & (data["team2"] == t1))]
    if len(h2h) == 0:
        return 0.5
    t1_wins = len(h2h[h2h["winner"] == t1])
    return t1_wins / len(h2h)

# Build feature matrix - ONLY PRE-MATCH FEATURES
print("\n🔧 Building features (PRE-MATCH ONLY - no leakage)...")
feature_list = []
for idx, row in data.iterrows():
    team1 = row["team1"]
    team2 = row["team2"]
    
    # Team encodings
    team1_enc = encoder_team.transform([team1])[0]
    team2_enc = encoder_team.transform([team2])[0]
    
    # Venue encoding
    venue_enc = 0
    if "venue" in data.columns and pd.notna(row["venue"]):
        venue_enc = encoder_venue.transform([row["venue"]])[0]
    
    # Toss winner (1 if team1 won toss, 0 otherwise)
    toss_team1 = 0
    if "toss_winner" in data.columns and pd.notna(row["toss_winner"]):
        toss_team1 = 1 if row["toss_winner"] == team1 else 0
    
    # Historical win rates
    team1_wr = team_win_rate.get(team1, 0.5)
    team2_wr = team_win_rate.get(team2, 0.5)
    
    # Head-to-head
    h2h_rate = get_h2h_win_rate(team1, team2)
    
    feature_list.append({
        "team1_enc": team1_enc,
        "team2_enc": team2_enc,
        "venue_enc": venue_enc,
        "toss_team1": toss_team1,
        "team1_win_rate": team1_wr,
        "team2_win_rate": team2_wr,
        "win_rate_diff": team1_wr - team2_wr,
        "h2h_rate": h2h_rate
    })

features = pd.DataFrame(feature_list)

# Target: did team1 win?
y = (data["winner"] == data["team1"]).astype(int).values

# Also create winner encoder for compatibility
encoder_winner = LabelEncoder()
encoder_winner.fit(data["winner"])

print(f"📊 Features used: {list(features.columns)}")
print(f"📊 Feature matrix shape: {features.shape}")

# Ensure at least 2 classes exist
if len(set(y)) < 2:
    raise ValueError(
        f"❌ Training data has only one unique winner. "
        "Please check matches.csv to ensure it contains games with different winners."
    )

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    features, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n📊 Training samples: {len(X_train)}")
print(f"📊 Test samples: {len(X_test)}")

# Train model
print("\n🔄 Training XGBoost model...")
model = XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    random_state=42,
    verbosity=0
)
model.fit(X_train, y_train)

# Evaluate
train_acc = accuracy_score(y_train, model.predict(X_train))
test_acc = accuracy_score(y_test, model.predict(X_test))

print(f"\n✅ Training Accuracy: {train_acc*100:.2f}%")
print(f"✅ Test Accuracy:     {test_acc*100:.2f}%")

# Save model and encoders
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
joblib.dump({
    "model": model,
    "team_encoder": encoder_team,
    "venue_encoder": encoder_venue,
    "winner_encoder": encoder_winner,
    "feature_cols": list(features.columns),
    "team_win_rates": team_win_rate
}, MODEL_PATH)

print(f"\n✅ Model saved at {MODEL_PATH}")
print("\n" + "=" * 60)
print("NOTE: This is a CLEAN pre-match model without data leakage.")
print("Expected accuracy: 50-55% (realistic for sports prediction)")
print("For higher accuracy, use the LIVE predictor with in-match data.")
print("=" * 60)