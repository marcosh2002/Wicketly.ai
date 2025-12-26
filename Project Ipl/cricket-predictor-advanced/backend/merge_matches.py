import pandas as pd
import os

data_dir = "e:/Project Ipl/cricket-predictor-advanced/backend/data"
main_path = os.path.join(data_dir, "matches.csv")
ipl2025_path = os.path.join(data_dir, "ipl2025_for_matches.csv")
output_path = os.path.join(data_dir, "matches_merged.csv")

# Load both datasets
main_df = pd.read_csv(main_path)
ipl2025_df = pd.read_csv(ipl2025_path)

# Concatenate and drop duplicates
merged = pd.concat([main_df, ipl2025_df], ignore_index=True)
merged = merged.drop_duplicates()

# Save merged file
merged.to_csv(output_path, index=False)
print(f"✅ Merged file saved as {output_path}")
