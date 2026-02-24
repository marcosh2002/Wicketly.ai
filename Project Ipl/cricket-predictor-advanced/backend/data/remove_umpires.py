import pandas as pd

# Load your matches.csv
df = pd.read_csv("e:/Project Ipl/cricket-predictor-advanced/backend/data/matches.csv")

# Drop umpire1 and umpire2 columns
df = df.drop(columns=["umpire1", "umpire2"], errors="ignore")

# Save the cleaned file (overwrite or create a new one)
df.to_csv("e:/Project Ipl/cricket-predictor-advanced/backend/data/matches.csv", index=False)

print("✅ umpire1 and umpire2 columns removed!")