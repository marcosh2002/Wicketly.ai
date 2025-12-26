import json
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sns.set(style="whitegrid", context="talk")

repo_root = Path(__file__).resolve().parents[1]  # backend/
data_dir = repo_root / "data"
out_dir = repo_root.parent / "reports" / "figures"
out_dir.mkdir(parents=True, exist_ok=True)

# Helper to safe read CSV
def read_csv_safe(p):
    try:
        return pd.read_csv(p, low_memory=False)
    except Exception as e:
        print(f"Error reading {p}: {e}")
        return pd.DataFrame()

# 1) Matches per year
matches_path = data_dir / "matches.csv"
if matches_path.exists():
    df = read_csv_safe(matches_path)
    # Try to parse date column
    if "date" in df.columns:
        df["date_parsed"] = pd.to_datetime(df["date"], errors="coerce")
    else:
        df["date_parsed"] = pd.NaT
    df["year"] = df["date_parsed"].dt.year.fillna("Unknown")
    try:
        order = df["year"].value_counts().index.tolist()
        plt.figure(figsize=(8,5))
        sns.countplot(data=df, y="year", order=order, palette="Blues_d")
        plt.title("Matches per Year")
        plt.xlabel("Count")
        plt.ylabel("Year")
        plt.tight_layout()
        plt.savefig(out_dir / "matches_per_year.png", dpi=200)
        plt.close()
        print("Saved matches_per_year.png")
    except Exception as e:
        print("Error plotting matches_per_year:", e)
else:
    print("matches.csv not found; skipping matches_per_year")

# 2) Team wins (assumes 'winner' column or 'winner' named differently)
if matches_path.exists() and not df.empty:
    if "winner" in df.columns:
        wins = df["winner"].fillna("TBD").value_counts().reset_index()
        wins.columns = ["team", "wins"]
        plt.figure(figsize=(9,6))
        sns.barplot(data=wins.head(20), x="wins", y="team", palette="viridis")
        plt.title("Top Teams by Wins")
        plt.tight_layout()
        plt.savefig(out_dir / "team_wins.png", dpi=200)
        plt.close()
        print("Saved team_wins.png")
    else:
        print("No 'winner' column in matches.csv; skipping team_wins")

# 3) Winning probability histogram from predictions.json
pred_json = data_dir / "predictions.json"
if pred_json.exists():
    try:
        with open(pred_json) as fh:
            preds = json.load(fh)
    except Exception as e:
        preds = []
        print("Error reading predictions.json:", e)
    preds_list = []
    if isinstance(preds, dict):
        if "predictions" in preds and isinstance(preds["predictions"], list):
            preds_list = preds["predictions"]
        else:
            # try to collect list values
            for v in preds.values():
                if isinstance(v, list):
                    preds_list = v
                    break
    elif isinstance(preds, list):
        preds_list = preds

    prob_vals = [float(p.get("winning_probability")) for p in preds_list if p and p.get("winning_probability") is not None]
    if prob_vals:
        plt.figure(figsize=(8,5))
        sns.histplot(prob_vals, bins=20, kde=True, color="#2a9d8f")
        plt.title("Distribution of Winning Probability (Predictions)")
        plt.xlabel("Winning Probability (%)")
        plt.tight_layout()
        plt.savefig(out_dir / "winning_probability_hist.png", dpi=200)
        plt.close()
        print("Saved winning_probability_hist.png")
    else:
        print("No winning_probability values found in predictions.json; skipping histogram")
else:
    print("predictions.json not found; skipping probability histogram")

# 4) Tokens distribution from users.json
users_path = data_dir / "users.json"
if users_path.exists():
    try:
        users = pd.read_json(users_path)
    except Exception as e:
        users = pd.DataFrame()
        print("Error reading users.json:", e)
    if not users.empty and "tokens" in users.columns:
        plt.figure(figsize=(8,5))
        sns.histplot(users["tokens"].fillna(0).astype(int), bins=15, kde=False, color="#4f6ef7")
        plt.title("Users: Tokens Distribution")
        plt.xlabel("Tokens")
        plt.tight_layout()
        plt.savefig(out_dir / "tokens_distribution.png", dpi=200)
        plt.close()
        print("Saved tokens_distribution.png")
    else:
        print("No 'tokens' in users.json or users empty; skipping tokens_distribution")
else:
    print("users.json not found; skipping tokens_distribution")

print("Figures generation complete. Output directory:", out_dir)

# --- Additional figures ---
try:
    # Head-to-head (unordered pair counts)
    if not df.empty and "team1" in df.columns and "team2" in df.columns:
        pair_series = df.apply(lambda r: tuple(sorted([str(r['team1']), str(r['team2'])])), axis=1)
        pair_counts = pair_series.value_counts().reset_index()
        pair_counts.columns = ['pair', 'count']
        pair_counts['pair_label'] = pair_counts['pair'].apply(lambda t: f"{t[0]} \nvs\n {t[1]}")
        plt.figure(figsize=(10,8))
        sns.barplot(data=pair_counts.head(20), x='count', y='pair_label', palette='magma')
        plt.title('Top 20 Head-to-Head Matchups')
        plt.xlabel('Matches')
        plt.ylabel('Team Pair')
        plt.tight_layout()
        plt.savefig(out_dir / 'head_to_head_top20.png', dpi=200)
        plt.close()
        print('Saved head_to_head_top20.png')
    else:
        print('Insufficient team columns for head-to-head; skipping')

    # Venue distribution (top venues)
    if not df.empty and 'venue' in df.columns:
        venue_counts = df['venue'].fillna('Unknown').value_counts().reset_index()
        venue_counts.columns = ['venue', 'count']
        plt.figure(figsize=(10,8))
        sns.barplot(data=venue_counts.head(25), x='count', y='venue', palette='cubehelix')
        plt.title('Top Venues by Number of Matches')
        plt.xlabel('Matches')
        plt.ylabel('Venue')
        plt.tight_layout()
        plt.savefig(out_dir / 'venue_distribution_top25.png', dpi=200)
        plt.close()
        print('Saved venue_distribution_top25.png')
    else:
        print('No venue column; skipping venue distribution')

    # Top players by 'player_of_match' awards
    if not df.empty and 'player_of_match' in df.columns:
        pom = df['player_of_match'].fillna('Unknown').value_counts().reset_index()
        pom.columns = ['player', 'awards']
        plt.figure(figsize=(8,10))
        sns.barplot(data=pom.head(30), x='awards', y='player', palette='viridis')
        plt.title('Top Players by Player-of-the-Match Awards')
        plt.xlabel('Awards')
        plt.ylabel('Player')
        plt.tight_layout()
        plt.savefig(out_dir / 'top_player_of_match_awards.png', dpi=200)
        plt.close()
        print('Saved top_player_of_match_awards.png')
    else:
        print("No 'player_of_match' column; skipping top players chart")

    # Team wins time-series (top teams over years)
    if not df.empty and 'winner' in df.columns and 'year' in df.columns:
        # ensure year is numeric for sorting
        df_year = df.copy()
        df_year['year_num'] = pd.to_numeric(df_year['year'], errors='coerce')
        wins_by_year = df_year[df_year['winner'].notna() & df_year['year_num'].notna()].groupby(['year_num', 'winner']).size().reset_index(name='wins')
        # pick top teams overall
        top_teams = df['winner'].value_counts().head(6).index.tolist()
        pivot = wins_by_year[wins_by_year['winner'].isin(top_teams)].pivot(index='year_num', columns='winner', values='wins').fillna(0)
        pivot = pivot.sort_index()
        if not pivot.empty:
            plt.figure(figsize=(12,6))
            pivot.plot(marker='o')
            plt.title('Wins per Year — Top Teams')
            plt.xlabel('Year')
            plt.ylabel('Wins')
            plt.legend(title='Team', bbox_to_anchor=(1.05, 1), loc='upper left')
            plt.tight_layout()
            plt.savefig(out_dir / 'team_wins_timeseries_top6.png', dpi=200)
            plt.close()
            print('Saved team_wins_timeseries_top6.png')
        else:
            print('No numeric year data for team wins time-series; skipping')
    else:
        print('Insufficient data for team wins time-series; skipping')
except Exception as e:
    print('Error while generating additional figures:', e)

# --- Even more figures ---
try:
    # Toss decision distribution
    if not df.empty and 'toss_decision' in df.columns:
        td = df['toss_decision'].fillna('Unknown').value_counts().reset_index()
        td.columns = ['decision', 'count']
        plt.figure(figsize=(6,5))
        sns.barplot(data=td, x='decision', y='count', palette='pastel')
        plt.title('Toss Decision Distribution')
        plt.xlabel('Decision')
        plt.ylabel('Count')
        plt.tight_layout()
        plt.savefig(out_dir / 'toss_decision_distribution.png', dpi=200)
        plt.close()
        print('Saved toss_decision_distribution.png')
    else:
        print('No toss_decision column; skipping toss decision distribution')

    # Result margin distribution (numeric)
    if not df.empty and 'result_margin' in df.columns:
        rm = pd.to_numeric(df['result_margin'], errors='coerce').dropna()
        if not rm.empty:
            plt.figure(figsize=(8,5))
            sns.histplot(rm, bins=30, kde=False, color='#ff7f0e')
            plt.title('Result Margin Distribution')
            plt.xlabel('Margin (runs/wickets)')
            plt.tight_layout()
            plt.savefig(out_dir / 'result_margin_hist.png', dpi=200)
            plt.close()
            print('Saved result_margin_hist.png')
        else:
            print('No numeric result_margin values; skipping result margin histogram')
    else:
        print('No result_margin column; skipping result margin histogram')

    # Toss winners top teams
    if not df.empty and 'toss_winner' in df.columns:
        tw = df['toss_winner'].fillna('Unknown').value_counts().reset_index()
        tw.columns = ['team', 'count']
        plt.figure(figsize=(8,6))
        sns.barplot(data=tw.head(20), x='count', y='team', palette='rocket')
        plt.title('Top Teams by Toss Wins')
        plt.xlabel('Toss Wins')
        plt.ylabel('Team')
        plt.tight_layout()
        plt.savefig(out_dir / 'toss_winner_top20.png', dpi=200)
        plt.close()
        print('Saved toss_winner_top20.png')
    else:
        print('No toss_winner column; skipping toss winners chart')

    # Team vs Team matrix heatmap (team1 vs team2 counts)
    if not df.empty and 'team1' in df.columns and 'team2' in df.columns:
        mat = pd.crosstab(df['team1'].fillna('Unknown'), df['team2'].fillna('Unknown'))
        # reduce to top teams to keep heatmap readable
        top = (mat.sum(axis=1) + mat.sum(axis=0)).sort_values(ascending=False).head(12).index.tolist()
        mat_small = mat.loc[mat.index.isin(top), mat.columns.isin(top)]
        plt.figure(figsize=(10,8))
        sns.heatmap(mat_small, cmap='YlGnBu', annot=False)
        plt.title('Team vs Team Match Counts (Top 12 Teams)')
        plt.xlabel('Team 2')
        plt.ylabel('Team 1')
        plt.tight_layout()
        plt.savefig(out_dir / 'team_vs_team_heatmap_top12.png', dpi=200)
        plt.close()
        print('Saved team_vs_team_heatmap_top12.png')
    else:
        print('Insufficient team columns for team-vs-team heatmap; skipping')

    # Prediction accuracy analysis (where match_id maps to actual match winner)
    pred_path = data_dir / 'predictions.json'
    if pred_path.exists():
        try:
            with open(pred_path, 'r', encoding='utf-8') as fh:
                preds = json.load(fh)
        except Exception:
            preds = []

        if preds and not df.empty and 'id' in df.columns and 'winner' in df.columns:
            preds_df = pd.DataFrame(preds)
            preds_df['match_id'] = pd.to_numeric(preds_df.get('match_id'), errors='coerce')
            matches_df = df.copy()
            matches_df['id'] = pd.to_numeric(matches_df['id'], errors='coerce')
            merged = preds_df.merge(matches_df[['id', 'winner']], left_on='match_id', right_on='id', how='left')
            merged_valid = merged[merged['winner'].notna()]
            if not merged_valid.empty:
                merged_valid['pred_correct'] = merged_valid.apply(lambda r: str(r.get('predicted_winner')) == str(r.get('winner')), axis=1)
                acc = merged_valid['pred_correct'].mean() * 100
                plt.figure(figsize=(6,4))
                sns.barplot(x=['Accuracy'], y=[acc], palette=['#2ca02c'])
                plt.ylim(0,100)
                plt.title(f'Prediction Accuracy (matched by match_id): {acc:.1f}%')
                plt.tight_layout()
                plt.savefig(out_dir / 'prediction_accuracy.png', dpi=200)
                plt.close()
                print('Saved prediction_accuracy.png')

                plt.figure(figsize=(8,5))
                merged_valid['winning_probability'] = pd.to_numeric(merged_valid.get('winning_probability'), errors='coerce')
                sns.kdeplot(data=merged_valid, x='winning_probability', hue='pred_correct', common_norm=False)
                plt.title('Winning Probability Distribution: Correct vs Incorrect Predictions')
                plt.xlabel('Winning Probability (%)')
                plt.tight_layout()
                plt.savefig(out_dir / 'winning_probability_by_outcome.png', dpi=200)
                plt.close()
                print('Saved winning_probability_by_outcome.png')
            else:
                print('No matching match_id entries found to compute prediction accuracy; skipping accuracy plots')
        else:
            print('predictions.json missing or matches data inadequate; skipping prediction accuracy')
    else:
        print('predictions.json not found; skipping prediction accuracy')
except Exception as e:
    print('Error while generating extra figures:', e)
