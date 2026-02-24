import os
import pandas as pd

# Define the data directory path
data_dir = os.path.join("cricket-predictor-advanced", "backend", "data")
os.makedirs(data_dir, exist_ok=True)

# Path for matches.csv
matches_path = os.path.join(data_dir, "matches.csv")

# Create a sample matches.csv if it doesn't exist
if not os.path.exists(matches_path):
    sample_data = pd.DataFrame({
        "team1": ["MI", "CSK", "RCB", "KKR"],
        "team2": ["CSK", "MI", "KKR", "RCB"],
        "winner": ["MI", "CSK", "RCB", "KKR"]
    })
    sample_data.to_csv(matches_path, index=False)
    print(f"Sample matches.csv created at {matches_path}")
else:
    print(f"matches.csv already exists at {matches_path}")

print("✅ Project setup complete.")