import pandas as pd
import os

data_dir = "e:/Project Ipl/cricket-predictor-advanced/backend/data"
input_path = os.path.join(data_dir, "ipl_dataset_2025.csv")
output_path = os.path.join(data_dir, "ipl2025_for_matches.csv")

# Columns to keep (matches.csv structure)
columns_needed = [
    "id", "season", "city", "date", "match_type", "player_of_match", "venue",
    "team1", "team2", "toss_winner", "toss_decision", "winner", "result",
    "result_margin", "target_runs", "target_overs", "super_over", "method"
]

# Read IPL 2025 dataset
df = pd.read_csv(input_path)

# Map IPL 2025 columns to matches.csv columns
converted = pd.DataFrame({
    "id": df["id"],
    "season": 2025,
    "city": df["venue"],  # If you have a separate city column, use that
    "date": df["date"],
    "match_type": df["stage"] if "stage" in df.columns else "",
    "player_of_match": df["player_of_the_match"] if "player_of_the_match" in df.columns else "",
    "venue": df["venue"],
    "team1": df["team_1"],
    "team2": df["team_2"],
    "toss_winner": df["toss-winner"] if "toss-winner" in df.columns else "",
    "toss_decision": df["toss_decision"] if "toss_decision" in df.columns else "",
    "winner": df["match_winner"],
    "result": df["won_by"] if "won_by" in df.columns else "",
    "result_margin": df["margin"] if "margin" in df.columns else "",
    "target_runs": df["first_ings_score"],
    "target_overs": 20,
    "super_over": "N",  # Default, update if you have info
    "method": "",       # Default, update if you have info
})

# Save the cleaned and structured file
converted.to_csv(output_path, index=False)
print(f"✅ IPL 2025 dataset converted and saved as {output_path}")