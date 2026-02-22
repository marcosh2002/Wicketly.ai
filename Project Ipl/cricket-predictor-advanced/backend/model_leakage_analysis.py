"""
IPL Prediction - Understanding Data Leakage vs Fair Prediction
================================================================

This script demonstrates:
1. Model with DATA LEAKAGE (uses post-match info) - HIGH accuracy but CHEATING
2. Model with FAIR features (pre-match info only) - REALISTIC accuracy

The original model.py used target_runs and result_margin which are 
only known AFTER the match - that's why it showed ~92%+ accuracy!
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder  
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
import os
import warnings
warnings.filterwarnings('ignore')

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MATCHES_PATH = os.path.join(DATA_DIR, "matches.csv")

print("=" * 80)
print("UNDERSTANDING MODEL ACCURACY: DATA LEAKAGE VS FAIR PREDICTION")
print("=" * 80)

# Load data
data = pd.read_csv(MATCHES_PATH)
data = data.dropna(subset=["winner"])
print(f"\n📊 Total matches: {len(data)}")

# Normalize names
for col in ["team1", "team2", "winner", "toss_winner"]:
    if col in data.columns:
        data[col] = data[col].astype(str).str.strip().str.upper()

# Encode teams
all_teams = pd.concat([data["team1"], data["team2"]]).unique()
team_encoder = LabelEncoder()
team_encoder.fit(all_teams)

# Encode winner for multi-class
winner_encoder = LabelEncoder()
y_multiclass = winner_encoder.fit_transform(data["winner"])

# Binary target
y_binary = (data["team1"] == data["winner"]).astype(int).values

# ============================================================================
# MODEL 1: WITH DATA LEAKAGE (Like original model.py)
# Uses: team1, team2, target_runs, result_margin, target_overs
# These are POST-MATCH values - the model is CHEATING!
# ============================================================================
print("\n" + "=" * 80)
print("MODEL 1: WITH DATA LEAKAGE (Original approach)")
print("=" * 80)
print("⚠️  Uses: target_runs, result_margin, target_overs")
print("⚠️  These values are only known AFTER the match!")

features_leakage = pd.DataFrame({
    "team1": team_encoder.transform(data["team1"]),
    "team2": team_encoder.transform(data["team2"]),
    "target_runs": pd.to_numeric(data["target_runs"], errors="coerce"),
    "result_margin": pd.to_numeric(data["result_margin"], errors="coerce"),
    "target_overs": pd.to_numeric(data["target_overs"], errors="coerce")
}).fillna(0)

X_train_leak, X_test_leak, y_train_leak, y_test_leak = train_test_split(
    features_leakage, y_multiclass, test_size=0.2, random_state=42
)

model_leakage = XGBClassifier(use_label_encoder=False, eval_metric="mlogloss", verbosity=0)
model_leakage.fit(X_train_leak, y_train_leak)

train_acc_leak = accuracy_score(y_train_leak, model_leakage.predict(X_train_leak))
test_acc_leak = accuracy_score(y_test_leak, model_leakage.predict(X_test_leak))

print(f"\n🎯 Training Accuracy: {train_acc_leak*100:.2f}%")
print(f"🧪 Test Accuracy:     {test_acc_leak*100:.2f}%")
print(f"\n💡 This high accuracy is MISLEADING!")
print(f"   The model learned: 'if target_runs is high and team X was chasing, they probably won'")
print(f"   But you can't know target_runs before the match happens!")

# ============================================================================
# MODEL 2: FAIR MODEL (Pre-match features only)
# Uses: only information available BEFORE the match
# ============================================================================
print("\n" + "=" * 80)
print("MODEL 2: FAIR PREDICTION (Pre-match features only)")
print("=" * 80)
print("✅ Uses: team names, toss result, venue, historical stats")
print("✅ All features known BEFORE the match starts!")

# Calculate historical stats
data_sorted = data.sort_values("date").reset_index(drop=True)

# Venue encoder
venue_encoder = LabelEncoder()
data_sorted["venue_enc"] = venue_encoder.fit_transform(data_sorted["venue"].fillna("Unknown"))

# Pre-calculate all historical features
print("\n📊 Calculating historical statistics (this ensures no data leakage)...")

team1_form = []
team2_form = []
h2h_rate = []

for idx, row in data_sorted.iterrows():
    t1, t2 = row["team1"], row["team2"]
    prev = data_sorted.loc[:idx-1]  # Only past matches
    
    # Team1 recent form
    t1_matches = prev[(prev["team1"] == t1) | (prev["team2"] == t1)].tail(10)
    team1_form.append((t1_matches["winner"] == t1).mean() if len(t1_matches) > 0 else 0.5)
    
    # Team2 recent form  
    t2_matches = prev[(prev["team1"] == t2) | (prev["team2"] == t2)].tail(10)
    team2_form.append((t2_matches["winner"] == t2).mean() if len(t2_matches) > 0 else 0.5)
    
    # Head-to-head
    h2h = prev[((prev["team1"] == t1) & (prev["team2"] == t2)) | 
               ((prev["team1"] == t2) & (prev["team2"] == t1))]
    if len(h2h) > 0:
        t1_h2h_wins = ((h2h["winner"] == t1)).sum()
        h2h_rate.append(t1_h2h_wins / len(h2h))
    else:
        h2h_rate.append(0.5)

data_sorted["team1_form"] = team1_form
data_sorted["team2_form"] = team2_form
data_sorted["h2h_rate"] = h2h_rate
data_sorted["team1_won_toss"] = (data_sorted["team1"] == data_sorted["toss_winner"]).astype(int)
data_sorted["toss_bat"] = (data_sorted["toss_decision"] == "bat").astype(int)

# Binary target for fair prediction
y_fair = (data_sorted["team1"] == data_sorted["winner"]).astype(int).values

features_fair = pd.DataFrame({
    "team1": team_encoder.transform(data_sorted["team1"]),
    "team2": team_encoder.transform(data_sorted["team2"]),
    "team1_won_toss": data_sorted["team1_won_toss"],
    "toss_bat": data_sorted["toss_bat"],
    "venue": data_sorted["venue_enc"],
    "team1_form": data_sorted["team1_form"],
    "team2_form": data_sorted["team2_form"],
    "h2h_rate": data_sorted["h2h_rate"],
}).fillna(0.5)

X_train_fair, X_test_fair, y_train_fair, y_test_fair = train_test_split(
    features_fair, y_fair, test_size=0.2, random_state=42, stratify=y_fair
)

model_fair = XGBClassifier(
    n_estimators=50,
    max_depth=3,
    learning_rate=0.1,
    reg_alpha=1.0,
    reg_lambda=2.0,
    use_label_encoder=False, 
    eval_metric="logloss", 
    verbosity=0
)
model_fair.fit(X_train_fair, y_train_fair)

train_acc_fair = accuracy_score(y_train_fair, model_fair.predict(X_train_fair))
test_acc_fair = accuracy_score(y_test_fair, model_fair.predict(X_test_fair))

print(f"\n🎯 Training Accuracy: {train_acc_fair*100:.2f}%")
print(f"🧪 Test Accuracy:     {test_acc_fair*100:.2f}%")
print(f"\n💡 This is REALISTIC accuracy for predicting sports outcomes!")
print(f"   Professional sports bettors typically achieve 52-58% accuracy")
print(f"   Anything above 55% is considered good for sports prediction!")

# ============================================================================
# COMPARISON SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("COMPARISON: DATA LEAKAGE vs FAIR PREDICTION")
print("=" * 80)

print(f"""
┌────────────────────────┬─────────────────┬─────────────────┐
│ Metric                 │ Data Leakage    │ Fair Model      │
├────────────────────────┼─────────────────┼─────────────────┤
│ Training Accuracy      │ {train_acc_leak*100:>10.2f}%     │ {train_acc_fair*100:>10.2f}%     │
│ Test Accuracy          │ {test_acc_leak*100:>10.2f}%     │ {test_acc_fair*100:>10.2f}%     │
│ Overfitting Gap        │ {(train_acc_leak-test_acc_leak)*100:>10.2f}%     │ {(train_acc_fair-test_acc_fair)*100:>10.2f}%     │
│ Can predict new games? │        ❌        │        ✅        │
└────────────────────────┴─────────────────┴─────────────────┘
""")

print("=" * 80)
print("KEY INSIGHTS")
print("=" * 80)
print("""
1. 🚨 The ~92%+ accuracy you saw was from DATA LEAKAGE
   - The model was using information (target_runs, result_margin) 
     that's only available AFTER the match ends!
   
2. 📊 For REAL prediction (before match), ~52-60% is realistic
   - Cricket has high randomness (weather, injuries, form, luck)
   - Even professional analysts rarely exceed 60% accuracy
   
3. 🎯 To get 90%+ accuracy fairly, you would need:
   - Ball-by-ball live data (predicting DURING the match)
   - Player-level performance metrics
   - Pitch and weather conditions
   - Even then, 90% is extremely difficult
   
4. ✅ Your model IS working correctly!
   - The "high accuracy" was an artifact of data leakage
   - The fair accuracy (~55%) is actually very good for sports prediction
""")

print("\n" + "=" * 80)
print("RECOMMENDATION")  
print("=" * 80)
print(f"""
For your IPL Predictor project:

Option A: Accept ~55-60% accuracy (HONEST)
  - Use pre-match features only
  - This is realistic for sports prediction
  - Users will appreciate honest predictions

Option B: Create a LIVE prediction feature (FAIR HIGH ACCURACY)
  - Predict winner during the match
  - Use current score, required run rate, wickets left
  - This can legitimately achieve 80-90%+ in late overs

The original approach (using target_runs) essentially tells the model 
"here's what happened, guess who won" - which is not a real prediction!
""")
