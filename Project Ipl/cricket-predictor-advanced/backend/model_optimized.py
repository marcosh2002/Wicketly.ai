"""
OPTIMIZED IPL Match Prediction Model
Goal: Reduce overfitting and achieve 90%+ test accuracy

Key improvements:
1. Binary classification (team1 wins vs team2 wins) - easier to predict
2. Rich feature engineering (toss, venue, head-to-head, season stats)
3. Strong regularization to prevent overfitting
4. Hyperparameter tuning with cross-validation
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
import os
import warnings
warnings.filterwarnings('ignore')

# Path to dataset
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MATCHES_PATH = os.path.join(DATA_DIR, "matches.csv")

print("=" * 80)
print("OPTIMIZED IPL PREDICTION MODEL - TARGETING 90%+ ACCURACY")
print("=" * 80)

# Load dataset
data = pd.read_csv(MATCHES_PATH)
print(f"\n📊 Total matches loaded: {len(data)}")

# Remove matches without a clear winner
data = data.dropna(subset=["winner"])
data = data[data["result"] != "no result"]
data = data[data["result"] != "tie"]  # Remove ties for cleaner binary classification
print(f"📊 Valid matches after cleanup: {len(data)}")

# Normalize names
for col in ["team1", "team2", "winner", "toss_winner"]:
    if col in data.columns:
        data[col] = data[col].astype(str).str.strip().str.upper()

# ============================================================================
# FEATURE ENGINEERING
# ============================================================================
print("\n🔧 Engineering features...")

# 1. Binary target: Did team1 win? (1 = yes, 0 = no)
data["team1_wins"] = (data["team1"] == data["winner"]).astype(int)

# 2. Toss features
data["team1_won_toss"] = (data["team1"] == data["toss_winner"]).astype(int)
data["toss_elect_bat"] = (data["toss_decision"] == "bat").astype(int)
data["toss_elect_field"] = (data["toss_decision"] == "field").astype(int)

# 3. Team encoding
all_teams = pd.concat([data["team1"], data["team2"]]).unique()
team_encoder = LabelEncoder()
team_encoder.fit(all_teams)
data["team1_encoded"] = team_encoder.transform(data["team1"])
data["team2_encoded"] = team_encoder.transform(data["team2"])

# 4. Venue encoding
venue_encoder = LabelEncoder()
data["venue_encoded"] = venue_encoder.fit_transform(data["venue"].fillna("Unknown"))

# 5. Season feature
data["season"] = pd.to_numeric(data["season"], errors="coerce").fillna(2020)

# 6. Calculate historical head-to-head win rate
print("📊 Calculating head-to-head statistics...")

def calculate_h2h_features(df):
    """Calculate head-to-head win rates up to each match"""
    h2h_team1_wins = []
    h2h_total = []
    
    for idx, row in df.iterrows():
        t1, t2 = row["team1"], row["team2"]
        # Get all previous matches between these teams
        prev_matches = df.loc[:idx-1]
        h2h_matches = prev_matches[
            ((prev_matches["team1"] == t1) & (prev_matches["team2"] == t2)) |
            ((prev_matches["team1"] == t2) & (prev_matches["team2"] == t1))
        ]
        
        if len(h2h_matches) > 0:
            # Count team1 wins in head-to-head
            t1_wins = ((h2h_matches["team1"] == t1) & (h2h_matches["winner"] == t1)).sum() + \
                      ((h2h_matches["team2"] == t1) & (h2h_matches["winner"] == t1)).sum()
            h2h_team1_wins.append(t1_wins)
            h2h_total.append(len(h2h_matches))
        else:
            h2h_team1_wins.append(0)
            h2h_total.append(0)
    
    return h2h_team1_wins, h2h_total

# Sort by date for proper historical calculation
data = data.sort_values("date").reset_index(drop=True)
h2h_wins, h2h_total = calculate_h2h_features(data)
data["h2h_team1_wins"] = h2h_wins
data["h2h_total_matches"] = h2h_total
data["h2h_win_rate"] = np.where(
    data["h2h_total_matches"] > 0,
    data["h2h_team1_wins"] / data["h2h_total_matches"],
    0.5  # Default to 50% if no history
)

# 7. Calculate team's recent form (win rate in last N matches)
print("📊 Calculating team form statistics...")

def calculate_team_form(df, window=10):
    """Calculate recent form for each team"""
    team1_form = []
    team2_form = []
    
    for idx, row in df.iterrows():
        t1, t2 = row["team1"], row["team2"]
        prev = df.loc[:idx-1]
        
        # Team1 recent matches
        t1_matches = prev[(prev["team1"] == t1) | (prev["team2"] == t1)].tail(window)
        if len(t1_matches) > 0:
            t1_wins = (t1_matches["winner"] == t1).sum()
            team1_form.append(t1_wins / len(t1_matches))
        else:
            team1_form.append(0.5)
        
        # Team2 recent matches
        t2_matches = prev[(prev["team1"] == t2) | (prev["team2"] == t2)].tail(window)
        if len(t2_matches) > 0:
            t2_wins = (t2_matches["winner"] == t2).sum()
            team2_form.append(t2_wins / len(t2_matches))
        else:
            team2_form.append(0.5)
    
    return team1_form, team2_form

team1_form, team2_form = calculate_team_form(data)
data["team1_recent_form"] = team1_form
data["team2_recent_form"] = team2_form
data["form_advantage"] = data["team1_recent_form"] - data["team2_recent_form"]

# 8. Home advantage (simplified - if venue contains team's city)
home_cities = {
    "CHENNAI SUPER KINGS": ["CHENNAI"],
    "MUMBAI INDIANS": ["MUMBAI"],
    "ROYAL CHALLENGERS BANGALORE": ["BANGALORE", "BENGALURU"],
    "KOLKATA KNIGHT RIDERS": ["KOLKATA"],
    "DELHI CAPITALS": ["DELHI"],
    "DELHI DAREDEVILS": ["DELHI"],
    "RAJASTHAN ROYALS": ["JAIPUR"],
    "SUNRISERS HYDERABAD": ["HYDERABAD"],
    "PUNJAB KINGS": ["MOHALI", "CHANDIGARH", "PUNJAB"],
    "KINGS XI PUNJAB": ["MOHALI", "CHANDIGARH", "PUNJAB"],
    "GUJARAT TITANS": ["AHMEDABAD"],
    "LUCKNOW SUPER GIANTS": ["LUCKNOW"],
}

def is_home_match(team, venue):
    venue = str(venue).upper()
    cities = home_cities.get(team, [])
    return any(city in venue for city in cities)

data["team1_home"] = data.apply(lambda r: is_home_match(r["team1"], r["venue"]), axis=1).astype(int)
data["team2_home"] = data.apply(lambda r: is_home_match(r["team2"], r["venue"]), axis=1).astype(int)
data["home_advantage"] = data["team1_home"] - data["team2_home"]

# ============================================================================
# PREPARE FINAL FEATURES
# ============================================================================
print("\n📊 Preparing feature matrix...")

feature_cols = [
    "team1_encoded",
    "team2_encoded", 
    "team1_won_toss",
    "toss_elect_bat",
    "venue_encoded",
    "h2h_win_rate",
    "team1_recent_form",
    "team2_recent_form",
    "form_advantage",
    "home_advantage",
    "season"
]

X = data[feature_cols].copy()
y = data["team1_wins"].values

# Handle any remaining NaN
X = X.fillna(X.median())

print(f"📊 Feature matrix shape: {X.shape}")
print(f"📊 Target distribution: {np.bincount(y)}")

# ============================================================================
# TRAIN/TEST SPLIT
# ============================================================================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n📊 Training samples: {len(X_train)}")
print(f"📊 Test samples: {len(X_test)}")

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ============================================================================
# MODEL TRAINING WITH REGULARIZATION
# ============================================================================
print("\n" + "=" * 80)
print("TRAINING MODELS WITH STRONG REGULARIZATION...")
print("=" * 80)

models = {}

# 1. XGBoost with strong regularization
print("\n🔄 Training XGBoost (Regularized)...")
xgb_model = XGBClassifier(
    n_estimators=50,           # Fewer trees to prevent overfitting
    max_depth=3,               # Shallow trees
    learning_rate=0.1,
    reg_alpha=1.0,             # L1 regularization
    reg_lambda=2.0,            # L2 regularization
    min_child_weight=5,        # Higher = more conservative
    subsample=0.8,             # Use 80% of data per tree
    colsample_bytree=0.8,      # Use 80% of features per tree
    use_label_encoder=False,
    eval_metric="logloss",
    verbosity=0,
    random_state=42
)
xgb_model.fit(X_train, y_train)
models["XGBoost (Regularized)"] = (xgb_model, X_train, X_test)

# 2. Random Forest with regularization
print("🔄 Training Random Forest (Regularized)...")
rf_model = RandomForestClassifier(
    n_estimators=50,
    max_depth=5,               # Limit depth
    min_samples_split=10,      # Require more samples to split
    min_samples_leaf=5,        # Require more samples in leaf
    max_features="sqrt",       # Use subset of features
    random_state=42,
    n_jobs=-1
)
rf_model.fit(X_train, y_train)
models["Random Forest (Regularized)"] = (rf_model, X_train, X_test)

# 3. Logistic Regression with regularization
print("🔄 Training Logistic Regression (Regularized)...")
lr_model = LogisticRegression(
    C=0.1,                     # Strong regularization (smaller C = stronger)
    penalty="l2",
    max_iter=1000,
    random_state=42
)
lr_model.fit(X_train_scaled, y_train)
models["Logistic Regression"] = (lr_model, X_train_scaled, X_test_scaled)

# 4. Gradient Boosting with regularization
print("🔄 Training Gradient Boosting (Regularized)...")
gb_model = GradientBoostingClassifier(
    n_estimators=50,
    max_depth=3,
    learning_rate=0.1,
    min_samples_split=10,
    min_samples_leaf=5,
    subsample=0.8,
    random_state=42
)
gb_model.fit(X_train, y_train)
models["Gradient Boosting"] = (gb_model, X_train, X_test)

# ============================================================================
# EVALUATION
# ============================================================================
print("\n" + "=" * 80)
print("RESULTS")
print("=" * 80)

results = {}
for name, (model, X_tr, X_te) in models.items():
    train_pred = model.predict(X_tr)
    test_pred = model.predict(X_te)
    
    train_acc = accuracy_score(y_train, train_pred)
    test_acc = accuracy_score(y_test, test_pred)
    
    # Cross-validation
    if "Logistic" in name:
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
    else:
        cv_scores = cross_val_score(model, X_train, y_train, cv=5)
    
    results[name] = {
        "train": train_acc,
        "test": test_acc,
        "cv_mean": cv_scores.mean(),
        "cv_std": cv_scores.std()
    }
    
    print(f"\n✅ {name}:")
    print(f"   Training Accuracy:     {train_acc*100:.2f}%")
    print(f"   Test Accuracy:         {test_acc*100:.2f}%")
    print(f"   Cross-Val Accuracy:    {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*200:.2f}%)")
    print(f"   Overfitting Gap:       {(train_acc-test_acc)*100:.2f}%")

# Summary table
print("\n" + "=" * 80)
print("SUMMARY COMPARISON")
print("=" * 80)
print(f"\n{'Model':<30} {'Train':<12} {'Test':<12} {'CV Mean':<12} {'Gap':<10}")
print("-" * 76)

sorted_results = sorted(results.items(), key=lambda x: x[1]['test'], reverse=True)
for name, scores in sorted_results:
    gap = (scores['train'] - scores['test']) * 100
    gap_status = "✅" if gap < 10 else "⚠️"
    print(f"{name:<30} {scores['train']*100:>6.2f}%     {scores['test']*100:>6.2f}%     {scores['cv_mean']*100:>6.2f}%     {gap:>5.1f}% {gap_status}")

# Best model
best = sorted_results[0]
print(f"\n🏆 BEST MODEL: {best[0]}")
print(f"   Test Accuracy: {best[1]['test']*100:.2f}%")

# ============================================================================
# HYPERPARAMETER TUNING FOR BEST MODEL
# ============================================================================
print("\n" + "=" * 80)
print("HYPERPARAMETER TUNING (XGBoost)")
print("=" * 80)

param_grid = {
    'n_estimators': [30, 50, 100],
    'max_depth': [2, 3, 4],
    'learning_rate': [0.05, 0.1, 0.2],
    'reg_alpha': [0.5, 1.0, 2.0],
    'reg_lambda': [1.0, 2.0, 3.0],
}

print("\n🔍 Running GridSearchCV (this may take a moment)...")
grid_search = GridSearchCV(
    XGBClassifier(
        use_label_encoder=False,
        eval_metric="logloss",
        verbosity=0,
        random_state=42,
        subsample=0.8,
        colsample_bytree=0.8,
        min_child_weight=5
    ),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)
grid_search.fit(X_train, y_train)

print(f"\n✅ Best parameters: {grid_search.best_params_}")
print(f"✅ Best CV score: {grid_search.best_score_*100:.2f}%")

# Evaluate tuned model
best_model = grid_search.best_estimator_
train_pred = best_model.predict(X_train)
test_pred = best_model.predict(X_test)

final_train_acc = accuracy_score(y_train, train_pred)
final_test_acc = accuracy_score(y_test, test_pred)

print(f"\n🎯 TUNED XGBOOST RESULTS:")
print(f"   Training Accuracy: {final_train_acc*100:.2f}%")
print(f"   Test Accuracy:     {final_test_acc*100:.2f}%")
print(f"   Overfitting Gap:   {(final_train_acc-final_test_acc)*100:.2f}%")

# ============================================================================
# FEATURE IMPORTANCE
# ============================================================================
print("\n" + "=" * 80)
print("FEATURE IMPORTANCE (Top features for prediction)")
print("=" * 80)

importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)

for _, row in importance.iterrows():
    bar = "█" * int(row['importance'] * 50)
    print(f"  {row['feature']:<25} {row['importance']:.4f} {bar}")

print("\n" + "=" * 80)
print("EXPERIMENT COMPLETE!")
print("=" * 80)

if final_test_acc >= 0.90:
    print("\n🎉 TARGET ACHIEVED! 90%+ test accuracy!")
else:
    print(f"\n📊 Current best: {final_test_acc*100:.2f}%")
    print("💡 To improve further, consider:")
    print("   - Adding more player-level statistics")
    print("   - Including pitch/weather conditions")
    print("   - Using more historical seasons data")
    print("   - Ensemble methods combining multiple models")
