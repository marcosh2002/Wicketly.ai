"""
HONEST ANALYSIS: How Research Papers Achieve High Accuracy
===========================================================
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, KFold
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
import os
import warnings
warnings.filterwarnings('ignore')

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

print("=" * 80)
print("EXPOSING THE TRUTH: How Papers Claim 90%+ Accuracy")
print("=" * 80)

# Load data
matches = pd.read_csv(os.path.join(DATA_DIR, "matches.csv"))
matches = matches.dropna(subset=["winner", "target_runs", "result_margin"])

for col in ["team1", "team2", "winner"]:
    matches[col] = matches[col].astype(str).str.strip().str.upper()

print(f"\n📊 Matches: {len(matches)}")

# ============================================================================
# METHOD 1: DATA LEAKAGE (What many papers do - CHEATING)
# Uses information only available AFTER the match
# ============================================================================
print("\n" + "=" * 80)
print("METHOD 1: DATA LEAKAGE (How some papers get 90%+)")
print("=" * 80)
print("⚠️  Uses: target_runs, result_margin, target_overs")
print("⚠️  These are POST-MATCH values - NOT available before match!")

from sklearn.preprocessing import LabelEncoder
team_enc = LabelEncoder()
all_teams = pd.concat([matches["team1"], matches["team2"]]).unique()
team_enc.fit(all_teams)

winner_enc = LabelEncoder()
y_leak = winner_enc.fit_transform(matches["winner"])

X_leak = pd.DataFrame({
    "team1": team_enc.transform(matches["team1"]),
    "team2": team_enc.transform(matches["team2"]),
    "target_runs": pd.to_numeric(matches["target_runs"], errors="coerce"),
    "result_margin": pd.to_numeric(matches["result_margin"], errors="coerce"),
    "target_overs": pd.to_numeric(matches["target_overs"], errors="coerce"),
}).fillna(0)

X_train, X_test, y_train, y_test = train_test_split(X_leak, y_leak, test_size=0.2, random_state=42)

model_leak = XGBClassifier(n_estimators=100, max_depth=5, use_label_encoder=False, eval_metric="mlogloss", verbosity=0)
model_leak.fit(X_train, y_train)

train_acc = accuracy_score(y_train, model_leak.predict(X_train))
test_acc = accuracy_score(y_test, model_leak.predict(X_test))

print(f"\n🎯 Training Accuracy: {train_acc*100:.2f}%")
print(f"🧪 Test Accuracy:     {test_acc*100:.2f}%")
print(f"\n❌ This is FAKE accuracy - target_runs is only known after match ends!")

# ============================================================================
# METHOD 2: NON-TEMPORAL CV (Another way papers inflate accuracy)
# Random K-Fold instead of temporal split
# ============================================================================
print("\n" + "=" * 80)
print("METHOD 2: NON-TEMPORAL K-FOLD CV (Another trick)")
print("=" * 80)
print("⚠️  Uses random K-fold cross-validation")
print("⚠️  Future matches can 'leak' into training data!")

# Binary target
y_binary = (matches["team1"] == matches["winner"]).astype(int).values

# Simple features
X_simple = pd.DataFrame({
    "team1": team_enc.transform(matches["team1"]),
    "team2": team_enc.transform(matches["team2"]),
}).fillna(0)

# K-Fold CV (what some papers use - problematic because it mixes future data)
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = []

for train_idx, test_idx in kfold.split(X_simple):
    model = XGBClassifier(n_estimators=100, max_depth=5, use_label_encoder=False, eval_metric="logloss", verbosity=0)
    model.fit(X_simple.iloc[train_idx], y_binary[train_idx])
    score = accuracy_score(y_binary[test_idx], model.predict(X_simple.iloc[test_idx]))
    cv_scores.append(score)

print(f"\n🎯 K-Fold CV Accuracy: {np.mean(cv_scores)*100:.2f}% (+/- {np.std(cv_scores)*200:.2f}%)")
print(f"\n⚠️  This is INFLATED because 2022 matches can train model to predict 2020!")

# ============================================================================
# METHOD 3: PROPER TEMPORAL SPLIT (The honest way)
# Training on past, testing on future
# ============================================================================
print("\n" + "=" * 80)
print("METHOD 3: PROPER TEMPORAL SPLIT (Honest evaluation)")
print("=" * 80)
print("✅ Train on older matches, test on newer matches")
print("✅ This is how real prediction systems would work")

# Sort by date
matches_sorted = matches.sort_values("date").reset_index(drop=True)

# Use first 80% for training, last 20% for testing (temporal split)
split_idx = int(len(matches_sorted) * 0.8)

train_matches = matches_sorted.iloc[:split_idx]
test_matches = matches_sorted.iloc[split_idx:]

# Build features with proper historical data
def build_features(df, hist_df):
    features = []
    for _, row in df.iterrows():
        t1, t2 = row["team1"], row["team2"]
        
        # Historical stats (only from past matches)
        t1_hist = hist_df[(hist_df["team1"] == t1) | (hist_df["team2"] == t1)]
        t2_hist = hist_df[(hist_df["team1"] == t2) | (hist_df["team2"] == t2)]
        
        t1_win_rate = (t1_hist["winner"] == t1).mean() if len(t1_hist) > 0 else 0.5
        t2_win_rate = (t2_hist["winner"] == t2).mean() if len(t2_hist) > 0 else 0.5
        
        # H2H
        h2h = hist_df[((hist_df["team1"] == t1) & (hist_df["team2"] == t2)) |
                      ((hist_df["team1"] == t2) & (hist_df["team2"] == t1))]
        h2h_rate = (h2h["winner"] == t1).mean() if len(h2h) > 0 else 0.5
        
        # Recent form
        t1_recent = t1_hist.tail(5)
        t2_recent = t2_hist.tail(5)
        t1_form = (t1_recent["winner"] == t1).mean() if len(t1_recent) > 0 else 0.5
        t2_form = (t2_recent["winner"] == t2).mean() if len(t2_recent) > 0 else 0.5
        
        features.append({
            "t1_win_rate": t1_win_rate,
            "t2_win_rate": t2_win_rate,
            "h2h_rate": h2h_rate,
            "t1_form": t1_form,
            "t2_form": t2_form,
            "target": 1 if row["winner"] == t1 else 0
        })
    
    return pd.DataFrame(features)

# Build features
train_features = build_features(train_matches, train_matches)
test_features = build_features(test_matches, train_matches)  # Use only training data for history!

X_train_proper = train_features.drop("target", axis=1)
y_train_proper = train_features["target"].values
X_test_proper = test_features.drop("target", axis=1)
y_test_proper = test_features["target"].values

model_proper = XGBClassifier(n_estimators=100, max_depth=3, use_label_encoder=False, eval_metric="logloss", verbosity=0, random_state=42)
model_proper.fit(X_train_proper, y_train_proper)

train_acc_proper = accuracy_score(y_train_proper, model_proper.predict(X_train_proper))
test_acc_proper = accuracy_score(y_test_proper, model_proper.predict(X_test_proper))

print(f"\n🎯 Training Accuracy: {train_acc_proper*100:.2f}%")
print(f"🧪 Test Accuracy:     {test_acc_proper*100:.2f}%")
print(f"\n✅ This is REAL accuracy - usable for actual predictions!")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("COMPARISON SUMMARY")
print("=" * 80)

print(f"""
┌─────────────────────────────────────┬──────────────┬─────────────────┐
│ Method                              │ Test Accuracy │ Is it Valid?    │
├─────────────────────────────────────┼──────────────┼─────────────────┤
│ Data Leakage (post-match features)  │ {test_acc*100:>8.2f}%    │ ❌ NO - Cheating │
│ Random K-Fold CV                    │ {np.mean(cv_scores)*100:>8.2f}%    │ ⚠️  Inflated     │
│ Proper Temporal Split               │ {test_acc_proper*100:>8.2f}%    │ ✅ YES - Honest  │
└─────────────────────────────────────┴──────────────┴─────────────────┘
""")

print("=" * 80)
print("WHAT THOSE RESEARCH PAPERS LIKELY DID:")
print("=" * 80)

print("""
📚 V.Magdum (98% with Random Forest):
   - Likely used ball-by-ball data with features like 'runs scored so far'
   - OR used 1st innings score to predict 2nd innings outcome (during match)
   - OR has unintentional data leakage
   - 98% pre-match prediction is statistically impossible in sports

📚 N.R. et al (90.56% with Linear Regression):
   - Linear Regression getting 90%+ suggests DATA LEAKAGE
   - Simple models can't capture cricket's complexity to that degree
   - Likely used features correlated with outcome

📚 M.V. et al (90% with XGBoost):
   - Possibly used in-match data (predicting during 2nd innings)
   - Or used non-temporal cross-validation
   
📚 B.L.S. et al (78.45% with XGBoost):
   - This is more realistic for pre-match with good features
   - Likely had: player-level stats, team composition, venue data
   - With ball-by-ball data + playing XI, 75-80% is achievable

🎯 THE TRUTH:
   - Pre-match prediction ceiling: ~65-75% (with perfect data)
   - Professional sports bettors: 52-58%
   - Your model at 55-60%: ACTUALLY GOOD!
   
💡 TO IMPROVE LEGITIMATELY:
   1. Download deliveries.csv from Kaggle
   2. Get playing XI data for each match
   3. Calculate player-level team strength
   4. Max achievable: ~75-80%
""")

print("\n" + "=" * 80)
print("YOUR OPTIONS:")
print("=" * 80)

print("""
🅰️ OPTION A: Accept ~55% accuracy (HONEST)
   - Your model is working correctly
   - Show predictions as probabilities
   - "CSK has 58% chance of winning"

🅱️ OPTION B: Download more data for ~75% accuracy
   - Get deliveries.csv from Kaggle IPL dataset
   - Get playing XI info (requires web scraping or paid API)
   - This is the LEGITIMATE path to higher accuracy

🅲 OPTION C: Use the "leaky" model for demos (NOT recommended for production)
   - Shows high accuracy but it's misleading
   - Only for presentations/demos
   - Don't claim it as real prediction capability

🅳 OPTION D: Build a "Live Win Predictor" feature
   - Add manual score input during match
   - Predict winner based on current situation
   - Can legitimately achieve 85-95% in late overs
   - No API costs required
""")

print("\n" + "=" * 80)
