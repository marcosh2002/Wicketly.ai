"""
ML Algorithm Comparison for IPL Match Prediction
Compares: XGBoost, Random Forest, Logistic Regression, SVM

Uses EXACT same configuration as model.py for fair comparison
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from xgboost import XGBClassifier
import os
import warnings
warnings.filterwarnings('ignore')

# Path to dataset - EXACT same as model.py
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MATCHES_PATH = os.path.join(DATA_DIR, "matches.csv")

print("=" * 70)
print("IPL MATCH PREDICTION - ML ALGORITHM COMPARISON")
print("=" * 70)

# Load dataset - EXACT same as model.py
data = pd.read_csv(MATCHES_PATH)
print(f"\n📊 Total matches loaded: {len(data)}")

# Remove missing winners - EXACT same as model.py
data = data.dropna(subset=["winner"])
print(f"📊 Matches with valid winners: {len(data)}")

# Normalize team/winner names - EXACT same as model.py
for col in ["team1", "team2", "winner"]:
    data[col] = data[col].astype(str).str.strip().str.upper()

# Encode teams - EXACT same as model.py
all_teams = pd.concat([data["team1"], data["team2"]]).unique()
encoder_team = LabelEncoder()
encoder_team.fit(all_teams)

print(f"📊 Number of unique teams: {len(all_teams)}")

# Features: team1, team2, target_runs, result_margin, target_overs - EXACT same as model.py
features = pd.DataFrame({
    "team1": encoder_team.transform(data["team1"]),
    "team2": encoder_team.transform(data["team2"]),
    "team1_score": pd.to_numeric(data["target_runs"], errors="coerce"),
    "team2_score": pd.to_numeric(data["result_margin"], errors="coerce"),
    "overs": pd.to_numeric(data["target_overs"], errors="coerce")
})

# Encode target - EXACT same as model.py
encoder_winner = LabelEncoder()
y = encoder_winner.fit_transform(data["winner"])

print(f"📊 Number of unique winners: {len(encoder_winner.classes_)}")
print(f"📊 Feature shape: {features.shape}")

# Train/test split - EXACT same as model.py (test_size=0.2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    features, y, test_size=0.2, random_state=42
)

print(f"\n📊 Training samples: {len(X_train)}")
print(f"📊 Test samples: {len(X_test)}")

# Handle NaN values - fill with median (more robust than mean)
X_train = X_train.fillna(X_train.median())
X_test = X_test.fillna(X_train.median())  # use training median for test

# Scale features for algorithms that need it (Logistic Regression, SVM)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Define models - XGBoost uses EXACT same params as model.py
models = {
    "XGBoost": XGBClassifier(
        use_label_encoder=False, 
        eval_metric="mlogloss",
        verbosity=0
    ),
    "Random Forest": RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    ),
    "Logistic Regression": LogisticRegression(
        max_iter=1000,
        random_state=42,
        multi_class='multinomial'
    ),
    "SVM (RBF Kernel)": SVC(
        kernel='rbf',
        random_state=42,
        probability=True
    )
}

# Store results
results = {}

print("\n" + "=" * 70)
print("TRAINING AND EVALUATING MODELS...")
print("=" * 70)

for name, model in models.items():
    print(f"\n🔄 Training {name}...")
    
    # Use scaled data for Logistic Regression and SVM
    if name in ["Logistic Regression", "SVM (RBF Kernel)"]:
        X_tr, X_te = X_train_scaled, X_test_scaled
    else:
        X_tr, X_te = X_train, X_test
    
    # Train model
    model.fit(X_tr, y_train)
    
    # Predictions on TRAINING data
    y_train_pred = model.predict(X_tr)
    train_accuracy = accuracy_score(y_train, y_train_pred)
    
    # Predictions on TEST data
    y_test_pred = model.predict(X_te)
    test_accuracy = accuracy_score(y_test, y_test_pred)
    
    results[name] = {
        "train_accuracy": train_accuracy,
        "test_accuracy": test_accuracy
    }
    
    print(f"   ✅ {name}")
    print(f"      🎯 Training Accuracy: {train_accuracy:.4f} ({train_accuracy*100:.2f}%)")
    print(f"      🧪 Test Accuracy:     {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")

# Summary comparison
print("\n" + "=" * 70)
print("FINAL COMPARISON SUMMARY")
print("=" * 70)

print("\n" + "-" * 80)
print(f"{'Algorithm':<25} {'Training Accuracy':<20} {'Test Accuracy':<20}")
print("-" * 80)

# Sort by test accuracy
sorted_results = sorted(results.items(), key=lambda x: x[1]['test_accuracy'], reverse=True)

for name, scores in sorted_results:
    train_str = f"{scores['train_accuracy']*100:.2f}%"
    test_str = f"{scores['test_accuracy']*100:.2f}%"
    print(f"{name:<25} {train_str:<20} {test_str:<20}")

print("-" * 80)

# Best model by training accuracy
best_train = max(results.items(), key=lambda x: x[1]['train_accuracy'])
print(f"\n🏆 HIGHEST TRAINING ACCURACY: {best_train[0]}")
print(f"   Training: {best_train[1]['train_accuracy']*100:.2f}%")
print(f"   Test:     {best_train[1]['test_accuracy']*100:.2f}%")

# Best model by test accuracy
best_test = sorted_results[0]
print(f"\n🧪 HIGHEST TEST ACCURACY: {best_test[0]}")
print(f"   Training: {best_test[1]['train_accuracy']*100:.2f}%")
print(f"   Test:     {best_test[1]['test_accuracy']*100:.2f}%")

# Overfitting analysis
print("\n" + "=" * 70)
print("OVERFITTING ANALYSIS")
print("=" * 70)
print("\nGap between Training and Test accuracy (smaller is better):")
for name, scores in sorted_results:
    gap = (scores['train_accuracy'] - scores['test_accuracy']) * 100
    status = "⚠️  Overfitting" if gap > 20 else "✅ Good generalization"
    print(f"  {name:<25}: {gap:.2f}% gap - {status}")

print("\n" + "=" * 70)
print("RECOMMENDATION")
print("=" * 70)

# Provide recommendation
print(f"\n📊 Your XGBoost Training Accuracy: {results['XGBoost']['train_accuracy']*100:.2f}%")
print(f"   (This is likely what you saw as 92.40% if using different settings)")
print(f"\n📊 XGBoost Test Accuracy: {results['XGBoost']['test_accuracy']*100:.2f}%")
print(f"   (This measures how well it predicts on NEW unseen data)")

if best_test[0] == "XGBoost":
    print("\n✅ XGBoost has the best TEST accuracy - good choice for production!")
else:
    print(f"\n💡 Consider {best_test[0]} - it has better TEST accuracy than XGBoost")

print("\n" + "=" * 70)
print("EXPERIMENT COMPLETE!")
print("=" * 70)
